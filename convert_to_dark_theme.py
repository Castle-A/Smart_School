import os
import re
from pathlib import Path

# Mapping des classes Tailwind claires vers sombres
REPLACEMENTS = {
    # Backgrounds
    r'bg-white\b': 'bg-white/5 backdrop-blur-xl',
    r'bg-slate-50\b': 'bg-white/10',
    r'bg-slate-100\b': 'bg-white/10',
    r'bg-gray-50\b': 'bg-white/10',
    
    # Borders
    r'border-slate-200\b': 'border-white/10',
    r'border-slate-300\b': 'border-white/20',
    r'border-gray-200\b': 'border-white/10',
    
    # Text colors - headings
    r'text-slate-900\b': 'text-white',
    r'text-gray-900\b': 'text-white',
    
    # Text colors - body
    r'text-slate-700\b': 'text-slate-200',
    r'text-slate-600\b': 'text-slate-300',
    r'text-slate-500\b': 'text-slate-400',
    r'text-gray-700\b': 'text-slate-200',
    r'text-gray-600\b': 'text-slate-300',
    r'text-gray-500\b': 'text-slate-400',
    r'text-gray-200\b': 'text-white',
    
    # Dividers
    r'divide-slate-100\b': 'divide-white/10',
    r'divide-gray-100\b': 'divide-white/10',
    
    # Hover states
    r'hover:bg-slate-50\b': 'hover:bg-white/10',
    r'hover:bg-white/20\b': 'hover:bg-white/10',
    r'hover:text-slate-900\b': 'hover:text-white',
}

def process_file(file_path):
    """Process a single TSX file to apply dark theme replacements"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply all replacements
        for pattern, replacement in REPLACEMENTS.items():
            content = re.sub(pattern, replacement, content)
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    # Directories to process
    base_dir = Path(r'c:\Users\Leroi\.gemini\antigravity\playground\shining-universe\frontend\src\app\pages\dashboard')
    
    files_processed = 0
    files_modified = 0
    
    # Process all TSX files in dashboard directories
    for tsx_file in base_dir.rglob('*.tsx'):
        files_processed += 1
        if process_file(tsx_file):
            files_modified += 1
            print(f"Modified: {tsx_file.relative_to(base_dir)}")
    
    print(f"\nProcessed {files_processed} files")
    print(f"Modified {files_modified} files")

if __name__ == '__main__':
    main()
