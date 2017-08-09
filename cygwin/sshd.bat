@echo off

C:
chdir C:\local\Temp\cygwin\cygwin\bin
bash --login -c 'export PATH=/usr/local/bin:/usr/bin:/cygdrive/c/WINDOWS/system32:/cygdrive/c/WINDOWS:/cygdrive/c/WINDOWS/System32/Wbem:/cygdrive/c/WINDOWS/System32/WindowsPowerShell/v1.0 ; /usr/sbin/sshd -E /var/log/sshd.log -h /cygdrive/c/home/site/wwwroot/cygwin/ssh_host_rsa_key -d'
