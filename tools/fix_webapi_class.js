const fs = require('fs');
const path = require('path');

const webApiPath = path.join(__dirname, '..', 'src', 'routes', 'webApi.js');
let code = fs.readFileSync(webApiPath, 'utf8');

const marker = `        return { success: false, error: 'Địa danh thám hiểm không hợp lệ' };
    }
}

const controller = new WebApiController();

    getChat(body) {`;

// We want getChat and sendChat to be inside the class before the closing }
// Let's find:
// 'return { success: false, error: \'Địa danh thám hiểm không hợp lệ\' };\n    }\n}'
const oldEnd = `        return { success: false, error: 'Địa danh thám hiểm không hợp lệ' };
    }
}

const controller = new WebApiController();`;

const endOfFile = 'module.exports = controller;';

// Let's extract the getChat and sendChat methods from where they are now
const getChatIdx = code.indexOf('    getChat(body) {');
const exportIdx = code.lastIndexOf('module.exports = controller;');

if (getChatIdx !== -1 && exportIdx !== -1) {
    const chatMethods = code.slice(getChatIdx, exportIdx).trim();

    // Remove them from after controller
    let cleaned = code.slice(0, getChatIdx).trim();

    // In cleaned, find the closing } of WebApiController
    const classCloseIdx = cleaned.lastIndexOf('}');
    if (classCloseIdx !== -1) {
        // Insert chatMethods before classCloseIdx
        const finalCode = cleaned.slice(0, classCloseIdx) + '\n' + chatMethods + '\n}\n\nconst controller = new WebApiController();\nmodule.exports = controller;\n';
        fs.writeFileSync(webApiPath, finalCode, 'utf8');
        console.log('Fixed WebApiController class methods placement successfully!');
    }
}
