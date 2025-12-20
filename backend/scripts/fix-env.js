
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');

try {
    let content = fs.readFileSync(envPath, 'utf8');
    const bucket = 'smartschool-dev'; // Value we know from logs

    // Look for STORAGE_ENDPOINT line
    const endpointRegex = /^(STORAGE_ENDPOINT=.*?)(\/smartschool-dev)(.*)$/m;

    if (endpointRegex.test(content)) {
        console.log('⚠️ Found incorrect STORAGE_ENDPOINT with bucket suffix.');
        const newContent = content.replace(endpointRegex, '$1$3');
        fs.writeFileSync(envPath, newContent);
        console.log('✅ STORAGE_ENDPOINT fixed in .env');
    } else {
        console.log('ℹ️ STORAGE_ENDPOINT seems correct or bucket name not found in it.');
        // Debug: print the line to be sure (masked)
        const match = content.match(/^STORAGE_ENDPOINT=(.*)$/m);
        if (match) console.log(`Current value: ${match[1]}`);
    }
} catch (error) {
    console.error('❌ Error updating .env:', error);
}
