const fs = require('fs');
const { execSync } = require('child_process');

// Vérifier si Pandoc est installé
try {
    execSync('pandoc --version', { stdio: 'ignore' });
    console.log('✓ Pandoc trouvé, génération du PDF...');

    // Générer le PDF avec Pandoc
    execSync('pandoc ROADMAP.md -o ROADMAP.pdf --pdf-engine=wkhtmltopdf -V geometry:margin=1in', {
        cwd: __dirname,
        stdio: 'inherit'
    });

    console.log('✓ PDF généré avec succès : ROADMAP.pdf');
} catch (error) {
    console.log('✗ Pandoc non installé, utilisation de la méthode alternative...');
    console.log('\nPour générer le PDF, vous avez 2 options :');
    console.log('\n1. Installer Pandoc :');
    console.log('   - Télécharger depuis : https://pandoc.org/installing.html');
    console.log('   - Puis exécuter : pandoc ROADMAP.md -o ROADMAP.pdf\n');
    console.log('2. Utiliser un convertisseur en ligne :');
    console.log('   - https://www.markdowntopdf.com/');
    console.log('   - https://md2pdf.netlify.app/');
    console.log('   - Uploader ROADMAP.md et télécharger le PDF\n');
    console.log('3. Utiliser VS Code :');
    console.log('   - Installer l\'extension "Markdown PDF"');
    console.log('   - Ouvrir ROADMAP.md');
    console.log('   - Ctrl+Shift+P > "Markdown PDF: Export (pdf)"\n');
}
