@echo off

C:
setup-x86.exe ^
--no-admin ^
--no-desktop ^
--no-startmenu ^
--root .\cygwin ^
--site http://cygwin.mirror.constant.com ^
--quiet-mode ^
--packages busybox,binutils,openssh,wget

copy openssh-7.4p1-1.tar.xz .\cygwin
copy apt-cyg .\cygwin\bin
chdir .\cygwin\bin
bash --login -c 'export PATH=/usr/local/bin:/usr/bin:/cygdrive/c/WINDOWS/system32:/cygdrive/c/WINDOWS:/cygdrive/c/WINDOWS/System32/Wbem:/cygdrive/c/WINDOWS/System32/WindowsPowerShell/v1.0 ; tar xf /openssh-7.4p1-1.tar.xz -C /'
bash --login -c 'export PATH=/usr/local/bin:/usr/bin:/cygdrive/c/WINDOWS/system32:/cygdrive/c/WINDOWS:/cygdrive/c/WINDOWS/System32/Wbem:/cygdrive/c/WINDOWS/System32/WindowsPowerShell/v1.0 ; /bin/echo.exe -e "yes\nyes\nno\nno\nno\n" | bash /usr/bin/ssh-host-config'
