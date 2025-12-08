# Guide de Génération du PDF - ROADMAP.md

## 📄 Méthode 1 : VS Code (Recommandé - Le plus simple)

### Étapes :
1. **Installer l'extension "Markdown PDF"** dans VS Code
   - Ouvrir VS Code
   - Aller dans Extensions (Ctrl+Shift+X)
   - Chercher "Markdown PDF" par yzane
   - Cliquer sur "Install"

2. **Générer le PDF**
   - Ouvrir `ROADMAP.md` dans VS Code
   - Appuyer sur `Ctrl+Shift+P` (ou `Cmd+Shift+P` sur Mac)
   - Taper "Markdown PDF: Export (pdf)"
   - Appuyer sur Entrée

3. **Résultat**
   - Le fichier `ROADMAP.pdf` sera créé dans le même dossier
   - Prêt à être envoyé !

---

## 📄 Méthode 2 : Convertisseur en Ligne (Sans installation)

### Sites recommandés :

1. **MarkdownToPDF** (https://www.markdowntopdf.com/)
   - Glisser-déposer `ROADMAP.md`
   - Cliquer sur "Convert"
   - Télécharger le PDF

2. **MD2PDF** (https://md2pdf.netlify.app/)
   - Uploader `ROADMAP.md`
   - Télécharger le PDF généré

3. **Dillinger** (https://dillinger.io/)
   - Importer `ROADMAP.md`
   - Export > PDF

---

## 📄 Méthode 3 : Pandoc (Pour les développeurs)

### Installation :

**Windows** :
```powershell
# Télécharger depuis https://pandoc.org/installing.html
# Ou avec Chocolatey :
choco install pandoc
```

**Mac** :
```bash
brew install pandoc
```

**Linux** :
```bash
sudo apt-get install pandoc
```

### Génération :
```bash
cd c:/Users/Leroi/.gemini/antigravity/playground/shining-universe
pandoc ROADMAP.md -o ROADMAP.pdf --pdf-engine=wkhtmltopdf -V geometry:margin=1in
```

---

## 📄 Méthode 4 : Chrome/Edge (Print to PDF)

### Étapes :
1. Ouvrir `ROADMAP.md` dans VS Code
2. Clic droit > "Open Preview" (ou `Ctrl+Shift+V`)
3. Clic droit dans la preview > "Open in Browser"
4. Dans le navigateur : `Ctrl+P` (Imprimer)
5. Destination : "Save as PDF"
6. Cliquer sur "Save"

---

## 🎨 Personnalisation du PDF

### Pour un PDF plus professionnel avec Pandoc :

```bash
pandoc ROADMAP.md -o ROADMAP.pdf \
  --pdf-engine=wkhtmltopdf \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V documentclass=article \
  --toc \
  --toc-depth=2 \
  -V colorlinks=true \
  -V linkcolor=blue \
  -V urlcolor=blue
```

Options :
- `--toc` : Ajoute une table des matières
- `--toc-depth=2` : Profondeur de la table des matières
- `-V geometry:margin=1in` : Marges de 1 pouce
- `-V fontsize=11pt` : Taille de police
- `-V colorlinks=true` : Liens colorés

---

## ✅ Recommandation Finale

**Pour vous (rapide et simple)** :
→ **Méthode 1 (VS Code)** ou **Méthode 2 (En ligne)**

**Pour un PDF professionnel** :
→ **Méthode 3 (Pandoc)** avec les options de personnalisation

---

## 📧 Envoi du PDF

Une fois le PDF généré :

1. **Par email** :
   - Attacher `ROADMAP.pdf`
   - Objet : "SmartSchool - Roadmap Technique & Business"

2. **Par partage de fichier** :
   - Google Drive
   - Dropbox
   - OneDrive

3. **Taille du fichier** :
   - Environ 500KB - 2MB selon la méthode
   - Parfait pour l'envoi par email

---

## 🆘 Besoin d'aide ?

Si aucune méthode ne fonctionne :
1. Ouvrir `ROADMAP.md` dans VS Code
2. Copier tout le contenu
3. Coller dans Google Docs
4. Fichier > Télécharger > PDF

C'est garanti de fonctionner ! 😊
