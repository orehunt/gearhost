<?php
echo 'before exe';
print_r(exec("C:\home\site\wwwroot\openssh\install-sshd.ps1"));
echo __FILE__;
print_r(getcwd());
// passthru("./usr/bin/dropbearmulti dropbear -p 127.0.0.1:12322 -RE");
?>
