#*=============================================================================
#* Script Name: get-process.ps1
#* Created:     2012-01-01
#* Author:  Robin Malik
#* Purpose:     This is a simple script that executes get-process.
#*          
#*=============================================================================
 
#*=============================================================================
#* PARAMETER DECLARATION
#*=============================================================================
param(
[string]$username
)
#*=============================================================================
#* REVISION HISTORY
#*=============================================================================
#* Date: 
#* Author:
#* Purpose:
#*=============================================================================
 
#*=============================================================================
#* IMPORT LIBRARIES
#*=============================================================================
 
#*=============================================================================
#* PARAMETERS
#*=============================================================================
 
#*=============================================================================
#* INITIALISE VARIABLES
#*=============================================================================
# Increase buffer width/height to avoid PowerShell from wrapping the text before
# sending it back to PHP (this results in weird spaces).
$pshost = Get-Host
$pswindow = $pshost.ui.rawui
$newsize = $pswindow.buffersize
$newsize.height = 3000
$newsize.width = 400
$pswindow.buffersize = $newsize
 
#*=============================================================================
#* EXCEPTION HANDLER
#*=============================================================================
 
#*=============================================================================
#* FUNCTION LISTINGS
#*=============================================================================
 
#*=============================================================================
#* Function:    function1
#* Created:     2012-01-01
#* Author:  My Name
#* Purpose:     This function does X Y Z
#* =============================================================================
 
#*=============================================================================
#* END OF FUNCTION LISTINGS
#*=============================================================================
 
#*=============================================================================
#* SCRIPT BODY
#*=============================================================================
Write-Output "Hello $username <br />"
 
# Get a list of running processes:
$processes = Get-Process
 
# Write them out into a table with the columns you desire:
Write-Output "<table>"
Write-Output "<thead>"
Write-Output "  <tr>"
Write-Output "      <th>Process Name</th>"
Write-Output "      <th>Id</th>"
Write-Output "      <th>CPU</th>"
Write-Output "  </tr>"
Write-Output "</thead>"
Write-Output "<tfoot>"
Write-Output "  <tr>"
Write-Output "      <td>&nbsp;</td>"
Write-Output "      <td>&nbsp;</td>"
Write-Output "      <td>&nbsp;</td>"
Write-Output "  </tr>"
Write-Output "</tfoot>"
Write-Output "<tbody>"
foreach($process in $processes)
{
Write-Output "  <tr>"
Write-Output "      <td>$($process.Name)</td>"
Write-Output "      <td>$($process.Id)</td>"
Write-Output "      <td>$($process.CPU)</td>"
Write-Output "  </tr>"
}
Write-Output "</tbody>"
Write-Output "</table>"
#*=============================================================================
#* END SCRIPT BODY
#*=============================================================================
 
#*=============================================================================
#* END OF SCRIPT
#*=============================================================================
