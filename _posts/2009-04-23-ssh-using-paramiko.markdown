---
layout: post
title: "使用paramiko进行ssh工作"
date: 2009-04-23 00:37
comments: true
categories:
-  python
-  ssh
-  cli
-  paramiko
---

最近在单位写一个自动 build 的小工具。因为 clearcase 的`setview`命令实际上是激活一个新的`shell`，所以用简单的「串通」`shell`的脚本很难做到。

因为在邮件组里面看到有同样问题的 Matt 说用`paramiko`解决了问题，就试了试，过程还颇有点艰辛。

首先，`paramiko`没有直接的`msi`或者`exe`版本给`Windows`用户下载，而是需要在本地进行编译。而且`python`的`easy_install`工具在 Vista 下面会报错，所以至少花了十几分钟才算安装完毕。

结果在用 test.py 验证安装的时候就报错了，说什么：

```python
paramiko.SSHException: No suitable address
```

安装是我自己一步步弄得，难道搞错了？只好照着 demo 写了一个 sftp 的脚本，发现是可以跑的，干。

只好丢了封信给邮件组，然后自己开始找是啥问题。丢给邮件组的信至今没有回音（人气不行啊，`paramiko`），问题还是找到了。原来是 1.7.5 的`paramiko`增加了对 ipv6 的支持，结果引入了错误。更新了`client.py`后重新编译就可以用了。

最后，虽然 demo 的例子也挺多，但是好像没有说清楚怎么用 invoke_shell 和 get_pty 以及照例奉上一段代码。

{% highlight python %}
"""
This script is using for build the software package
"""

import sys
import time
import paramiko
import traceback
import ConfigParser

"""
The main class of the builder.
"""
class Builder:

    """Parses options from the ini file to create connection."""
    def __init__(self,inifile):
        try:
            config = ConfigParser.ConfigParser()
            config.readfp(open(inifile))

            self._ssh = paramiko.SSHClient()
            self._ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self._ssh.connect(config.get('host','server'),
                              port=config.getint('host', 'port'),
                              username=config.get('host','user'),
                              password=config.get('host','password'))

            self._t = paramiko.Transport((config.get('host','server'), config.getint('host', 'port')))
            self._t.start_client()
            self._t.auth_password(config.get('host','user'),config.get('host','password'))
            self._sftp = paramiko.SFTPClient.from_transport(self._t)
        except Exception, e:
            print '*** Caught exception: %s: %s' % (e.__class__, e)
            traceback.print_exc()
            try:
                self.closeConn()
            except:
                pass
            sys.exit(1)

        self._fpga = config.get('fpga compress','fpga')
        self._lpath = config.get('fpga compress','local_fpga_path')
        self._rpath = config.get('fpga compress','remote_fpga_path')
        self._oab = config.get('fpga compress','oab')

        self._xlf = config.get('xlf build','xlf')
        self._lmid = config.get('xlf build','lmid')
        self._xpp = config.get('xlf build','xpp')
        self._xdp = config.get('xlf build','xdp')
        self._rru = config.get('xlf build','rru')
        self._rruswdb = config.get('xlf build','rru_sw_db')
        self._xpl = config.get('xlf build','xpl')
        print("Your input fpga file is:"+self._lpath+self._fpga+"\n")
        print("Your ouput xlf file will be:"+self._xlf+"\n")

    """Run command on the server"""
    def runCmd(self, command):
        """run <command>
        Execute this command on all hosts in the list"""
        if command:
            stdin, stdout, stderr = self._ssh.exec_command(command)
            stdin.close()
            for line in stdout.read().splitlines():
                print line
        else:
            print "usage: run <command>"

    """Upload the fpga and compress it to oab.bin"""
    def createOab(self):
        self._sftp.put(self._lpath+self._fpga,self._rpath+self._fpga)

        self.runCmd("hou_create_fpga -bf \"/home/ehholli/fpgainput/fpga.med\" -dn \"CXC 172 8213/1\" -of oab -dev \"XC2V6000,-4\" -dir /home/ehholli/fpgaoutput/")
        try:
            self._sftp.get(self._oab,'oab.bin')
            print("Fpga file compress successfully!")
        except Exception, e:
            print '*** Caught exception: %s: %s' % (e.__class__, e)
            traceback.print_exc()
            try:
                self.closeConn()
            except:
                pass
            sys.exit(1)

    """Make the tlf"""
    def genXlf(self):
        #open a interactive shell
        ct_chan = self._t.open_session()
        ct_chan.setblocking()
        ct_chan.get_pty()
        ct_chan.invoke_shell()
        #ct setview ehholli
        if(ct_chan.send_ready()):
            ct_chan.send("ct setview ehholli\r\n")
        time.sleep(10)

        #compile
        build_cmd="/vobs/rbs/hw/bcp/xp/deliv/solaris2/bin/xlf_gen -r "+self._xpp+" "+self._xdp+" "+self._rru \
                     +" -i "+self._oab+" "+self._rruswdb \
                     +" -o /home/ehholli/tmp/"+self._xlf \
                     +" -x "+self._xpl \
                     +" -lmid \""+self._lmid+"\"" \
                     +" -t \"au_applic\" -v \r\n"
        print(build_cmd)
        if(ct_chan.send_ready()):
            ct_chan.send(build_cmd)
        tCheck2 =
        while not ct_chan.recv_ready():
            time.sleep(5)
            tCheck2+=1
            if tCheck2 >= 6:
                print 'time out'#TODO: add exeption here
        print(ct_chan.recv(65536))
        ct_chan.close()
        time.sleep(10)
        #download the xlf file
        try:
            self._sftp.get("/home/ehholli/tmp/"+self._xlf,self._xlf)
            print("xlf file downloaded successfully!")
        except Exception, e:
            print '*** Caught exception: %s: %s' % (e.__class__, e)
            traceback.print_exc()
            try:
                self.closeConn()
            except:
                pass
            sys.exit(1)

    """Close everything we opened"""
    def closeConn(self):
        self._ssh.close()
        self._sftp.close()
        self._t.close()
if __name__=='__main__':
    # setup logging
    paramiko.util.log_to_file('demo_builder.log')
    b=Builder('cfg.ini')
    b.createOab()
    b.genXlf()
    #b.runCmd('ls')
    b.closeConn()
{% endhighlight %}