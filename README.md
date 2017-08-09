## nodejs ssh server
It partially works, linux on linux at least, can't seem to spawn a tty on windows. Worked sometimes forcefully disabling ttys (`ssh -T`)
## python paramiko
Works even less than ssh2 nodejs module, windows support is mostly theoretical.
## OpenSSH windows port
Requires admin privs, which makes it useless.
## Cygwin
The only thing that worked.
### how to on cygwin
- first of all check that you have a way to execute commands to the remote unprivileged machine. Like a php/nodejs/python/java/aspnet web server 
to wrap commands with, or a web browser shell from the control panel.
- Disabling privilege separation is needed to run sshd unprivileged. But openssh drepecated such option since version 7.5.
7.4 is still present in cygwin repositories, (for how long?) so such package is needed.
- If you do not have write permissions on the windows host because you are an unprivileged cucker, the Temp folder is probably still writable,
well at least it is for me.
- So we install cygwin with a script for unattended installation in the temp folder.
- Cygwin however does not provide a streamlined way to install previous or specific package versions, so the package must be downloaded 
manually. The package can be installed from the cygwin setup binary if prepare a tree that mirrors a repository. Nobody got time for that
so we extract the pkg directly on the root fs. No libs dependency hell encountered, phew.
- Permissions something something, this is the luck part...if you are on an  windows machine, you probably can't change permissions, and files are 
umasked (how do you say it on windows? acled?) quite openly. So ssh complains about permissions blah blah and you can't do much about it, 
(apart from turning off the checks in the source code i guess...). Somehow in this case deploying from git there are a couple permissions
templates that are preserved, 755 and 644 (which if I remember are kinda like standards in shared hosting?) anyway because of this the keys must
be pushed from git and copied over the cygwin rootfs.
- Configure sshd_config as needed, important bits, the `UsePrivilegeSeparation no` and the authorized_keys path.
- Who are you? call an `whoami` from cygwin to find out which user are you, that's the one that is gonna be used to login.
 Also create `/etc/passwd` and `/etc/group` from cygwin with `mkpasswd -l` and `mkgroup -l`, not sure if this is actually needed, probably yes.
- Assuming you have available keys (like ssh_host_rsa_key and authorized_keys) with correct permissions and set the rest up, it's time to start the ssh daemon.
 using a powershell cmdlet called `Start-Process` which spawns the command in background. The command is something like:
 ```
 powershell Start-Process C:\local\Temp\cygwin\sshd.bat
 ```
 - What's in that batfile? Nothing much, chdir to the correct cygwin root path before executing the daemon so that the correct libs are loaded, we also export an integral `$PATH`
   since we are spawning without tty from a non interactive cygwin bash shell. 
 - if the daemon doesn't start look at the sshd daemon log, make sure you are not using the default 22 port.
 - Assuming our shaking and crumbling and probably drunk sshd daemon is up, you probably want to tunnel the ssh connection because
  you are still an unprivilege cucker. Here the choice is wide and large, in this case we use `shootback` to host a master on our machine
  ```
  python /shootback/master.py -m 0.0.0.0:10000 -c 127.0.0.1:10022
  ```
  and a slaver from the unprivilege cucker windows machine.
  ```
  Start-Process python -ArgumentList \"C:\local\Temp\git\shootback/slaver.py -m $MYHOSTMACHINEIP:10000 -t 127.0.0.1:12346\" -RedirectStandardOutput python.out -RedirectStandardError python.err
  ```
  - 12346 is the port we chose for the ssh daemon, remember to install shootback in the temp folder because write permissions, or just clone it in the
  git deployment repository
  - It's time to test the connection, ssh from our machine with
  ```
  ssh -i cucker.key "$WHOAMI"@127.0.0.1 -p 10022
  ```
  make sure you are using the correct cucker private key, the port is the tunneled one, the user is the windows one, be aware that 
  windows is a little snowflake and has users with spaces so `'quote'` the username like `'user name'@127.0.0.1 ...`
  
  
  
