---
layout: post
title: "Openssl Heartbleed Bug"
date: 2014-04-10 11:29:15 +0800
comments: true
categories: 
- note
- linux
- c
- rants
---
连某宝都中招的[Heartbleed bug](http://heartbleed.com/)究竟是个什么东西？简单地说就是攻击者可以读最多64KB内存的内容。

读了这64KB能干嘛？用报这个bug的人的话来说：

{% blockquote %}
Without using any privileged information or credentials we were able steal from ourselves the secret keys used for our X.509 certificates, user names and passwords, instant messages, emails and business critical documents and communication.
{% endblockquote %}

那么读取64KB内存和获取这么多关键信息究竟有什么关系呢？

## The bug
先来看看[patch](http://git.openssl.org/gitweb/?p=openssl.git;a=commitdiff;h=96db9023b881d7cd9f379b0c154650d6c108e9a3)里面的`ssl/d1_both.c`:

``` c
int            
dtls1_process_heartbeat(SSL *s)
    {          
    unsigned char *p = &s->s3->rrec.data[0], *pl;
    unsigned short hbtype;
    unsigned int payload;
    unsigned int padding = 16; /* Use minimum padding */
```

可以看到，heartbeat里有一个 [SSLv3](http://en.wikipedia.org/wiki/Transport_Layer_Security)  record的指针，这个`record`的代码如下:

``` c
typedef struct ssl3_record_st
    {
        int type;               /* type of record */
        unsigned int length;    /* How many bytes available */
        unsigned int off;       /* read/write offset into 'buf' */
        unsigned char *data;    /* pointer to the record data */
        unsigned char *input;   /* where the decode bytes are */
        unsigned char *comp;    /* only used with decompression - malloc()ed */
        unsigned long epoch;    /* epoch number, needed by DTLS1 */
        unsigned char seq_num[8]; /* sequence number, needed by DTLS1 */
    } SSL3_RECORD;
```
可以看到，每个`record`有它的`type`、`length`和`data`，规规矩矩。

回到`dtls1_process_heartbeat`：

``` c
/* Read type and payload length first */
hbtype = *p++;
n2s(p, payload);
pl = p;
```

可以看到`SSLv3 record`的第一个byte就是放这个`heartbeat`的`type`。 宏`n2s` 则是从`p`里面取两个byte放到payload里面，被用来作为payload的长度。 **注意这里并没有检查`SSLv3 record` 实际的长度。** 

接下来在这个函数里面干了下面这些事情：

``` c
unsigned char *buffer, *bp;
int r;

/* Allocate memory for the response, size is 1 byte
 * message type, plus 2 bytes payload length, plus
 * payload, plus padding
 */
buffer = OPENSSL_malloc(1 + 2 + payload + padding);
bp = buffer;
```

可以看到，用户要多少程序就分配多少，最多可以分配到`65535+1+2+16`，指针bp被用来操作这块内存。然后：

``` c
/* Enter response type, length and copy payload */
*bp++ = TLS1_HB_RESPONSE;
s2n(payload, bp);
memcpy(bp, pl, payload);
```

宏` s2n`把`n2s`做的操作恢复出来：先拿16个bit的值放到2个byte里面，也就是原来请求的payload的长度。然后把`pl`里面放的payload(请求者提交的data)拷贝到新分配的`bp`里面。

看起来是很平常的操作，只不过没有认真的检查用户输入而已，但问题也就在这里了。

## Where is the bug

如果用户并没有正在提交声称的那么多个bytes的payload，那么memcpy就会读到同一个process里面SSLv3 record附近的内存内容。

这附近有哪些内容呢？

首先要明白在linux上，内存的动态分配主要是通过[sbrk](http://linux.die.net/man/2/sbrk) 或者是 [mmap](http://man7.org/linux/man-pages/man2/mmap.2.html)。如果内存是通过sbrk分配的，它会使用`heap-grows-up`规则，泄露出来的东西不会那么多（但是如果是同时并发请求[还是有东西会漏](http://blog.existentialize.com/diagnosis-of-the-openssl-heartbleed-bug.html#fn:update)）。

在这里，`pl`因为malloc里面的mmap_threshhold多半是sbrk分配的，但是，那些关键的用户数据，则多半是通过mmap分配内存。于是这些数据就会被攻击者用`pl`拿到。如果再考虑并发请求，就...

## The fix

所以，整个patch里面最主要的fix就是：
* 检查是否有长度为0的虚假heartbeat
* 检查record的真实长度

代码如下：

``` c    
    /* Read type and payload length first */
    if (1 + 2 + 16 > s->s3->rrec.length)
        return 0; /* silently discard */
    hbtype = *p++;
    n2s(p, payload);
    if (1 + 2 + payload + 16 > s->s3->rrec.length)
        return 0; /* silently discard per RFC 6520 sec. 4 */
    pl = p;
```    

## So?

这个bug大概算是影响这么剧烈的bug里面最好明白的一个，所以居然我也看明白了。感受：

* 为了可扩展性引入了复杂度，经常都会带来恶梦
* 用户的输入，无论如何都不能相信，一定要check
* C语言的确是大牛小牛都会踩到坑啊


