const fs = require('fs');
const download = require('download');
const decompress = require('decompress')
const fc = require('filecopy');
const config = require('./config').default;

async function downloadTo(url, path) {
    return new Promise((r, e) => {
        const d = download(url);
        d.then(r).catch(err => e(err));
        d.pipe(fs.createWriteStream(path));
    });
}

async function downloadDepends() {
    await Promise.all([        
        downloadTo(`${config.lanServerUrl}/${config.lanServerVersion}/CodeFormat.zip`, 'temp/CodeFormat.zip'),
    ]);
}

async function build() {
    if (!fs.existsSync('temp')) {
        fs.mkdirSync('temp')
    }
    
    await downloadDepends();
    
    await decompress('temp/CodeFormat.zip', 'temp/server');

    await fc('temp/server','server',  { mkdirp: true });
    // // mac
    // await fc('temp/server/macOS/bin/CodeFormatServer', 'server/macOS/bin/CodeFormatServer', { mkdirp: true });

    // // linux
    // await fc('temp/server/Linux/bin/CodeFormatServer', 'server/Linux/bin/CodeFormatServer', { mkdirp: true });

    // // win
    // await fc('temp/server/Windows/bin/CodeFormatServer.exe', 'server/Linux/bin/CodeFormatServer.exe', { mkdirp: true });
}

build().catch(console.error);