
const https = require('https');

const url = 'https://pub-25b305aecd1f405793c10dedc158efac.r2.dev/schools/c1925ef5-d392-487b-8ea1-b196b5b844de/logo.PNG';

console.log(`Checking headers for: ${url}`);

const options = {
    method: 'HEAD',
    headers: {
        'Origin': 'http://localhost:5173'
    }
};

const req = https.request(url, options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log('Headers:', res.headers);

    if (res.headers['access-control-allow-origin']) {
        console.log('✅ CORS Header found!');
    } else {
        console.log('❌ CORS Header MISSING');
    }
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
