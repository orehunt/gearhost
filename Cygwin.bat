@echo off

C:
chdir C:\home\site\wwwroot\cygwin\rootfs\\bin

bash --login -i -c 'ssh-host-config -y'
