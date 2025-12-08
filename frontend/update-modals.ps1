#!/usr/bin/env pwsh

# Script to update modals and settings to bright theme
$files = @(
    # Settings sections
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\settings\ProfileSection.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\settings\SecuritySection.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\settings\NotificationsSection.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\settings\AppearanceSection.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\settings\AccessibilitySection.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\settings\AdvancedSection.tsx",
    # Modals
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\MemberDetailsModal.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\shared\components\EditPermissionsModal.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\shared\components\SuccessCredentialsModal.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\shared\components\WelcomeModal.tsx",
    # Shared components
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\shared\components\PermissionsChecklist.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\CreateMemberPage.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace dark theme classes with light theme
        $content = $content -replace 'bg-white/5', 'bg-white'
        $content = $content -replace 'bg-white/10', 'bg-slate-50'
        $content = $content -replace 'border-white/10', 'border-slate-200'
        $content = $content -replace 'border-white/20', 'border-slate-300'
        $content = $content -replace 'text-white(?!-)', 'text-slate-900'
        $content = $content -replace 'text-gray-300', 'text-slate-700'
        $content = $content -replace 'text-gray-400', 'text-slate-600'
        $content = $content -replace 'text-gray-500', 'text-slate-500'
        $content = $content -replace 'divide-white/5', 'divide-slate-100'
        $content = $content -replace 'divide-white/10', 'divide-slate-200'
        
        # Update modal backgrounds
        $content = $content -replace 'bg-\[#1a1f37\]', 'bg-white'
        $content = $content -replace 'bg-slate-900', 'bg-white'
        $content = $content -replace 'from-slate-900 to-slate-800', 'from-white to-slate-50'
        
        # Update emerald colors for permissions
        $content = $content -replace 'bg-emerald-500/10 border-emerald-500/20', 'bg-emerald-50 border-emerald-200'
        $content = $content -replace 'text-emerald-100', 'text-emerald-700'
        $content = $content -replace 'text-emerald-200/60', 'text-emerald-600'
        
        # Update red colors for permissions
        $content = $content -replace 'bg-red-500/5 border-red-500/10', 'bg-red-50 border-red-200'
        $content = $content -replace 'text-red-200/70', 'text-red-700'
        $content = $content -replace 'text-red-200/40', 'text-red-600'
        
        Set-Content $file $content -NoNewline
        Write-Host "Updated: $file"
    }
}

Write-Host "Modals and settings update complete!"
