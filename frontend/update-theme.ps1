#!/usr/bin/env pwsh

# Script to update all components to bright theme
$files = @(
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\AdministrationSection.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\VieScolaireSection.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\ComptabiliteSection.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\AcademicProgramSection.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\ConfigurationSection.tsx",
    "c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard\founder\CommunicationSection.tsx"
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
        
        # Add shadows to cards
        $content = $content -replace '(bg-white border border-slate-200 rounded-xl p-[0-9]+)(?! shadow)', '$1 shadow-sm'
        
        Set-Content $file $content -NoNewline
        Write-Host "Updated: $file"
    }
}

Write-Host "Theme update complete!"
