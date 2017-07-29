# if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) { Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs; exit }

# Set directory for installation - Chocolatey does not lock
# down the directory if not the default
$InstallDir='.\choco'
$env:ChocolateyInstall="$InstallDir"
$env:ChocolateyBinRoot=".\choco\tools"

# If your PowerShell Execution policy is restrictive, you may
# not be able to get around that. Try setting your session to
# Bypass.
# Set-ExecutionPolicy Bypass

# All install options - offline, proxy, etc at
# https://chocolatey.org/install
# iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
# PowerShell 3+?
#iwr https://chocolatey.org/install.ps1 -UseBasicParsing | iex

#choco install win32-openssh -params '"/SSHServerFeature /KeyBasedAuthenticationFeature"' -confirm
#choco install cygwin -Confirm:$false
#choco install cyg-get -Confirm:$false
#choco install sonarr -Confirm:$false
.\Cygwin.bat
