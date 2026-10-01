$ErrorActionPreference = 'Stop'
$root = 'G:\23\nextChapter\NextChapterAssignments\ReEntryApp\meetAggergator'
$status = Join-Path $root 'logs\firewall-8081-result.json'
try {
    $ruleName = 'TCP Query User{73964D36-BC36-4B3E-9173-9F19C437731C}C:\program files\nodejs\node.exe'
    $rule = Get-NetFirewallRule -Name $ruleName -ErrorAction Stop
    $port = $rule | Get-NetFirewallPortFilter
    $program = ($rule | Get-NetFirewallApplicationFilter).Program
    if ($rule.Action.ToString() -ne 'Block' -or $port.Protocol -ne 'TCP' -or $program -ine 'C:\Program Files\nodejs\node.exe') { throw 'Original firewall rule identity changed; no changes made.' }
    $allowName = 'RecoveryMeetingFinder-Preview-8081-WiFi'
    if (!(Get-NetFirewallRule -Name $allowName -ErrorAction SilentlyContinue)) {
        New-NetFirewallRule -Name $allowName -DisplayName 'Recovery Meeting Finder preview 8081 (local Wi-Fi)' -Direction Inbound -Action Allow -Enabled True -Profile Public,Private -Program 'C:\Program Files\nodejs\node.exe' -Protocol TCP -LocalPort 8081 -LocalAddress 192.168.0.35 -RemoteAddress 192.168.0.0/24 -InterfaceAlias Wi-Fi | Out-Null
    }
    $rule | Get-NetFirewallPortFilter | Set-NetFirewallPortFilter -LocalPort @('1-8080','8082-65535')
    $allow = Get-NetFirewallRule -Name $allowName
    if ($allow.Action.ToString() -ne 'Allow' -or ($allow | Get-NetFirewallPortFilter).LocalPort -ne '8081') { throw 'Allow rule verification failed' }
    @{success=$true;port=8081;subnet='192.168.0.0/24';message='Verified narrow Wi-Fi allow rule and other-port Node block.'} | ConvertTo-Json | Set-Content -LiteralPath $status
} catch {
    @{success=$false;message=$_.Exception.Message} | ConvertTo-Json | Set-Content -LiteralPath $status
    exit 1
}
