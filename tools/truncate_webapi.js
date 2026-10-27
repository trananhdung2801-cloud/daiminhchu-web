const fs = require('fs');
const path = require('path');

const webApiPath = path.join(__dirname, '..', 'src', 'routes', 'webApi.js');
let content = fs.readFileSync(webApiPath, 'utf8');

const endMarker = 'module.exports = controller;\n';
const idx = content.indexOf(endMarker);
if (idx !== -1) {
    content = content.slice(0, idx + endMarker.length);
    fs.writeFileSync(webApiPath, content, 'utf8');
    console.log('Truncated webApi.js at module.exports = controller;');
} else {
    console.error('endMarker not found');
}
