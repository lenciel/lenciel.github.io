---
layout: post
title: "Cryptography and Python"
date: 2013-07-25 15:13
comments: true
categories: 
- cryptography
- notes
- tutorials
- python
---

这周我们的一个项目里面需要调用第三方接口。对方的安全机制是调用时要进行加密和校验，但它们的文档没有描述具体是怎么加密的，而是给了一段代码：

```java
    private static BASE64Encoder base64 = new BASE64Encoder();
//  private static byte[] myIV = { 50, 51, 52, 53, 54, 55, 56, 57 };
//  private static byte[] myIV = null;
//  private static String strkey = "W9qPIzjaVGKUp7CKRk/qpCkg/SCMkQRu"; // 字节数必须是8的倍数
    //密钥
    private static String strkey = "NDg5MDY2NjczMxxxxXXXXXyNzUzNTg2";
    private static String removeBR(String str) {
        StringBuffer sf = new StringBuffer(str);

        for (int i = 0; i < sf.length(); ++i)
        {
          if (sf.charAt(i) == '\n')
          {
            sf = sf.deleteCharAt(i);
          }
        }
        for (int i = 0; i < sf.length(); ++i)
        {
          if (sf.charAt(i) == '\r')
          {
            sf = sf.deleteCharAt(i);
          }
        }
        return sf.toString();
    }

    private static String desEncrypt(String input) throws Exception
    {

        BASE64Decoder base64d = new BASE64Decoder();
        DESedeKeySpec p8ksp = null;
        p8ksp = new DESedeKeySpec(base64d.decodeBuffer(strkey));
        Key key = null;
        key = SecretKeyFactory.getInstance("DESede").generateSecret(p8ksp);

        byte[] plainBytes = (byte[])null;
        Cipher cipher = null;
        byte[] cipherText = (byte[])null;
        //“算法/模式/填充”
        plainBytes = input.getBytes("UTF8");
        cipher = Cipher.getInstance("DESede/ECB/PKCS5Padding");
        SecretKeySpec myKey = new SecretKeySpec(key.getEncoded(), "DESede");
 //       IvParameterSpec ivspec = new IvParameterSpec(myIV);
        cipher.init(1, myKey);
        cipherText = cipher.doFinal(plainBytes);
        return removeBR(base64.encode(cipherText));
    }

    private static String desDecrypt(String cipherText) throws Exception
    {

        BASE64Decoder base64d = new BASE64Decoder();
        DESedeKeySpec p8ksp = null;
        p8ksp = new DESedeKeySpec(base64d.decodeBuffer(strkey));
        Key key = null;
        key = SecretKeyFactory.getInstance("DESede").generateSecret(p8ksp);

        Cipher cipher = null;
        byte[] inPut = base64d.decodeBuffer(cipherText);
        //“算法/模式/填充”
        cipher = Cipher.getInstance("DESede/ECB/PKCS5Padding");
        SecretKeySpec myKey = new SecretKeySpec(key.getEncoded(), "DESede");
 //       IvParameterSpec ivspec = new IvParameterSpec(myIV);
        cipher.init(2, myKey);
        byte[] output = cipher.doFinal(inPut);
        return new String(output, "UTF8");
    }
```

很明显，在提供文档的同学看来大家都是JEE程序员。仔细看了半天这两个函数`desEncrypt`和`desDecrypt`外加Google，才明白是`DES3`算法。

接着这份文档的后面还有另一个对加密的描述也是代码，不过这次比较明显是MD5：

```java
public static final String MD5(String s)
{
  char hexDigits[] = {
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f'
    };
  char str[] = null;
  byte strTemp[] = s.getBytes();
  MessageDigest mdTemp;
  try {
    mdTemp = MessageDigest.getInstance("MD5");
    mdTemp.update(strTemp);
    byte md[] = mdTemp.digest();
    int j = md.length;
    str = new char[j * 2];
    int k = 0;
    for (int i = 0; i < j; i++)
    {
      byte b = md[i];
      str[k++] = hexDigits[b >> 4 & 0xf];
      str[k++] = hexDigits[b & 0xf];
    }
  } catch (NoSuchAlgorithmException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
  }

  return new String(str);
}
```

这些算法用python来实现当然就简单多了:MD5就是一句话，看起来非常复杂的DES3也不过几句话:

```python
from pyDes import triple_des, ECB, PAD_PKCS5
import base64
import datetime

input_str = "test string"

key_base64_str = base64.b64decode("NDg5MDY2NjczMxxxxXXXXXyNzUzNTg2", "utf-8")
key_bytes = key_base64_str.encode('utf-8')
k = triple_des(key_bytes, ECB, pad=None, padmode=PAD_PKCS5)
d = base64.b64encode(k.encrypt(input_str))
print d
```

当然，要明白这些算法究竟怎么回事才叫认真负责的态度：下面这些内容主要来自[这篇文章](http://www.laurentluce.com/posts/python-and-cryptography-with-pycrypto/)

## **Hash**

hash就是给输入的字符串生成一个固定长度的字符串（被称为hash值）。理想的hash要满足：

- 根据生成的字符串非常难猜到输入的字符串
- 任意两个不同的字符串不会生成相同的hash值
- 如果输入字符串没有变生成的hash值应该不会变

![hash](/downloads/images/hash.png "Don't touch me...")

hash函数可以被用来计算checksum，也可以用来进行数字签名和认证。

### **MD5**

1991年面世的一种hash算法，生成的字符串长度为128bit。

它的算法详情可以看[这里](http://tools.ietf.org/html/rfc1321)，简单说如下：

- 首先需要对字符串进行扩展，使其位长对512求余的结果等于448。因此，位长（Bits Length）将被扩展至N*512+448，N为一个非负整数，N可以是零。填充的方法一般是在信息的后面填充一个1和无数个0，直到满足上面的条件时才停止用0对信息的填充。
- 然后，在这个结果后面附加一个以64位二进制表示的填充前信息长度。经过这两步的处理，现在的位长是 `N*512+448+64 = (N+1）*512`，即长度恰好是512的整数倍。
- 最后以512位分组来处理输入的信息，且每一分组又被划分为16个32位子分组，经过了一系列的处理后，算法的输出由四个32位分组组成，将这四个32位分组级联后将生成一个128位散列值。

MD5对碰撞攻击(不同的输入生成相同的hash)等攻击的抵抗力比较差。

在python中使用MD5:

```python
import os
from Crypto.Hash import MD5

def get_file_checksum(filename):
    h = MD5.new()
    chunk_size = 8192
    with open(filename, 'rb') as f:
        while True:
            chunk = f.read(chunk_size)
            if len(chunk) == 0:
                break
            h.update(chunk)
    return h.hexdigest()
```

## **加密算法**

加密算法使用key把输入的文本变成加密的文本。有两种加密的方式：分块和流。分块处理的单位是固定大小比如8或者16个bytes，流则是一个一个byte。只有知道了解密的`key`才能对加密的文本进行解密。

### *分块*

DES是分块加密的一种，其处理对象的大小是8个bytes。DES最简单的模式是所谓的`ECB( electronic code book)模式`，也就是每个block都是独立加密，最后组成整个加密后的文本。


![ecb](/downloads/images/block_cipher_ebc.png "Don't touch me...")

使用pycrpto对文本使用`DES/ECB`加密很简单。假设key是`10234567`，而我们要加密的文本是`abcdefgh`，那么：

```python
>>> from Crypto.Cipher import DES
>>> des = DES.new('01234567', DES.MODE_ECB)
>>> text = 'abcdefgh'
>>> cipher_text = des.encrypt(text)
>>> cipher_text
'\xec\xc2\x9e\xd9] a\xd0'
>>> des.decrypt(cipher_text)
'abcdefgh'
```

比`ECB`更健壮的是`CFB (Cipher feedback)`模式，也就是先组合前面加密的文本和待加密的文本，然后进行加密。

![cfb](/downloads/images/block_cipher_cfb.png "Don't touch me...")

下面的例子说明了算法的工作流程：待加密的是`abcdefghijklmnop`，两倍8bytes。首先生成一个随机的字符串作为初始的`iv`来生成两个`DES`对象，一个用来加密一个用来解密。之所以需要这两个对象，是因为`feedback`值会随着block被加密后变化。

```python
>>> from Crypto.Cipher import DES
>>> from Crypto import Random
>>> iv = Random.get_random_bytes(8)
>>> des1 = DES.new('01234567', DES.MODE_CFB, iv)
>>> des2 = DES.new('01234567', DES.MODE_CFB, iv)
>>> text = 'abcdefghijklmnop'
>>> cipher_text = des1.encrypt(text)
>>> cipher_text
"?\\\x8e\x86\xeb\xab\x8b\x97'\xa1W\xde\x89!\xc3d"
>>> des2.decrypt(cipher_text)
'abcdefghijklmnop'
```

### *流*

这些算法基于一个个bytes，所以block的大小总是1 byte。pycrypto提供了两个这样的算法：`ARC4` 和 `XOR`。这种基于流的算法只有一种模式：`ECB`。

下面是一个`ARC4`的算法，使用了key `01234567`:

```python
>>> from Crypto.Cipher import ARC4
>>> obj1 = ARC4.new('01234567')
>>> obj2 = ARC4.new('01234567')
>>> text = 'abcdefghijklmnop'
>>> cipher_text = obj1.encrypt(text)
>>> cipher_text
'\xf0\xb7\x90{#ABXY9\xd06\x9f\xc0\x8c '
>>> obj2.decrypt(cipher_text)
'abcdefghijklmnop'
```

### **应用程序**

在程序里面我们常常使用DES3对文件进行加密解密操作。一般来说操作对象是文件时，总是分成一个个chunck来处理以免占用太多内存。如果读入的chunck少于16bytes，就需要扩展它才能进行加密。

```python
import os
from Crypto.Cipher import DES3
  
def encrypt_file(in_filename, out_filename, chunk_size, key, iv):
    des3 = DES3.new(key, DES3.MODE_CFB, iv)
  
    with open(in_filename, 'r') as in_file:
        with open(out_filename, 'w') as out_file:
            while True:
                chunk = in_file.read(chunk_size)
                if len(chunk) == 0:
                    break
                elif len(chunk) % 16 != 0:
                    chunk += ' ' * (16 - len(chunk) % 16)
                out_file.write(des3.encrypt(chunk))
  
def decrypt_file(in_filename, out_filename, chunk_size, key, iv):
    des3 = DES3.new(key, DES3.MODE_CFB, iv)
  
    with open(in_filename, 'r') as in_file:
        with open(out_filename, 'w') as out_file:
            while True:
                chunk = in_file.read(chunk_size)
                if len(chunk) == 0:
                    break
                out_file.write(des3.decrypt(chunk))
```

有了上面定义的这两个函数我们可以这样使用它们：

```python
from Crypto import Random
iv = Random.get_random_bytes(8)
with open('to_enc.txt', 'r') as f:
    print 'to_enc.txt: %s' % f.read()
encrypt_file('to_enc.txt', 'to_enc.enc', 8192, key, iv)
with open('to_enc.enc', 'r') as f:
    print 'to_enc.enc: %s' % f.read()
decrypt_file('to_enc.enc', 'to_enc.dec', 8192, key, iv)
with open('to_enc.dec', 'r') as f:
    print 'to_enc.dec: %s' % f.read()
```

程序的输出如下：

```bash
to_enc.txt: this content needs to be encrypted.
  
to_enc.enc: ??~?E??.??]!=)??"t?
                                JpDw???R?UN0?=??R?UN0?}0r?FV9
to_enc.dec: this content needs to be encrypted.
```

## **Public-key algorithms**

上面提到的加密算法的一大问题是双方都需要知道key。而`public-key算法`提供了两个key，一个用来加密，一个用来解密。 

![ecb](/downloads/images/public_private_key.png "Don't touch me...")

### **public/private key**

使用pycrpto很容易就可以生成一对`private/public key`，生成key的时候必须规定key的长度，越长越安全。除开长度，还需要设定生成key的方法。下面是一个使用RSA生成1024bit长度key的过程：

```python
>>> from Crypto.PublicKey import RSA
>>> from Crypto import Random
>>> random_generator = Random.new().read
>>> key = RSA.generate(1024, random_generator)
>>> key
<_RSAobj @0x7f60cf1b57e8 n(1024),e,d,p,q,u,private>
```

key对象有一系列的方法：
- `can_encrypt()` 返回是否能用key来加密数据 
- `can_sign()` 返回是否能用key来进行签名
- `has_private()` 返回是否有private key

```python
>>> key.can_encrypt()
True
>>> key.can_sign()
True
>>> key.has_private()
True
```

### **加密**

现在我们有了一对key，我们就可以加密一些数据了。加密的时候使用的是公钥: `public key` ：

```python
>>> public_key = key.publickey()
>>> enc_data = public_key.encrypt('abcdefgh', 32)
>>> enc_data
('\x11\x86\x8b\xfa\x82\xdf\xe3sN ~@\xdbP\x85
\x93\xe6\xb9\xe9\x95I\xa7\xadQ\x08\xe5\xc8$9\x81K\xa0\xb5\xee\x1e\xb5r
\x9bH)\xd8\xeb\x03\xf3\x86\xb5\x03\xfd\x97\xe6%\x9e\xf7\x11=\xa1Y<\xdc
\x94\xf0\x7f7@\x9c\x02suc\xcc\xc2j\x0c\xce\x92\x8d\xdc\x00uL\xd6.
\x84~/\xed\xd7\xc5\xbe\xd2\x98\xec\xe4\xda\xd1L\rM`\x88\x13V\xe1M\n X
\xce\x13 \xaf\x10|\x80\x0e\x14\xbc\x14\x1ec\xf6Rs\xbb\x93\x06\xbe',)
```

### **解密**

只要有用于解密的私钥(private key)解密是很简单的：

```python
>>> key.decrypt(enc_data)
'abcdefgh'
```

### **签名**

对信息进行签名，可以用来验证信息的作者，让我们相信它的来源。下面这个例子展示了如何先算出信息的hash值，然后送给RSA key的`sign()`方法。使用其他算法如`DSA`或者是`ElGamal`也类似。

```python
>>> from Crypto.Hash import MD5
>>> from Crypto.PublicKey import RSA
>>> from Crypto import Random
>>> key = RSA.generate(1024, random_generator)
>>> text = 'abcdefgh'
>>> hash = MD5.new(text).digest()
>>> hash
'\xe8\xdc@\x81\xb144\xb4Q\x89\xa7 \xb7{h\x18'
>>> signature = key.sign(hash, '')
>>> signature
(1549358700992033008647390368952919655009213441715588267926189797
14352832388210003027089995136141364041133696073722879839526120115
25996986614087200336035744524518268136542404418603981729787438986
50177007820700181992412437228386361134849096112920177007759309019
6400328917297225219942913552938646767912958849053L,)
```

### **验证**

只要有公钥，验证信息就很简单了。未加密的文本和签名一起被发送给接收方。接收方计算hash值然后调用公钥的`verify()`方法来进行验证：

```python
>>> text = 'abcdefgh'
>>> hash = MD5.new(text).digest()
>>> public_key.verify(hash, signature)
True
```
