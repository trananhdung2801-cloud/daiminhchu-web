const http = require('http');
const { handleHttpRequest } = require('./src/app');

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
    handleHttpRequest(req, res);
});

server.listen(PORT, HOST, () => {
    console.log(`=======================================================`);
    console.log(`🗡️  ĐẠI MINH CHỦ PRIVATE SERVER EMULATOR IS RUNNING!   `);
    console.log(`📡 Local Address: http://127.0.0.1:${PORT}`);
    console.log(`📡 LAN / Emulator: http://${HOST}:${PORT}`);
    console.log(`=======================================================`);
});
