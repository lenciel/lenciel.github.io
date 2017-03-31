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
