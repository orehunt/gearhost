<?php    
echo __FILE__;
echo "<br>";
chdir("./cygwin/rootfs/bin/");
     $psScriptPath = "C:\home\site\wwwroot\get-process.ps1";
     $query = shell_exec("C:\home\site\wwwroot\cygwin\rootfs\bin\ssh-host-config -y");
     passthru("bash -li -c './usr/sbin/sshd'");
	//	passthru("netstat -anop TCP");
	//passthru(".\cygwin.cmd");
   // passthru("powershell.exe -ExecutionPolicy Bypass -File .\chocoinstall.ps1");
    // Execute the PowerShell script, passing the parameters:
    //$query = shell_exec("powershell -command $psScriptPath -username 'untoreh'< NUL");
    //  echo exec("nzb\bin\NzbDrone.exe");
    echo $query;
echo "<br>done";
