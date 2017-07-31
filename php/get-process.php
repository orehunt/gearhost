<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd"> <html> <head> <title>Testing
PowerShell</title> </head> <body> <?php
    echo "alive...<br>";
    // $psScriptPath = ".\get-process.ps1";
    passthru("powershell.exe -ExecutionPolicy Bypass -File .\openssh\FixHostFilePermissions.ps1 -Confirm:$false");
    // Execute the PowerShell script, passing the parameters:
    // $query = shell_exec("powershell -command $psScriptPath -username 'untoreh'< NUL");
    echo $query;
?>
</body>
</html>
