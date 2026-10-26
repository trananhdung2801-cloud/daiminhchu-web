const crypto = require('crypto');

// AES-128-CBC keys extracted directly from Dai Minh Chu 8.0.2 APK Assembly-CSharp.dll
const KEY_BASE64 = 'AwUfAgUGAxUGFwUgKh9WIA==';
const IV_BASE64 = 'AwUfAgUGAxUGFwUgKh9WIA==';

const KEY = Buffer.from(KEY_BASE64, 'base64');
const IV = Buffer.from(IV_BASE64, 'base64');

/**
 * Encrypt a plaintext string (typically JSON) using AES-128-CBC PKCS7.
 * Returns Base64 encoded ciphertext string.
 */
function encrypt(plainText) {
    if (typeof plainText !== 'string') {
        plainText = JSON.stringify(plainText);
    }
    const cipher = crypto.createCipheriv('aes-128-cbc', KEY, IV);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

/**
 * Decrypt a Base64 encoded ciphertext string into UTF-8 plaintext.
 */
function decrypt(base64Cipher) {
    if (!base64Cipher) return '';
    const decipher = crypto.createDecipheriv('aes-128-cbc', KEY, IV);
    let decrypted = decipher.update(base64Cipher, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt,
    KEY,
    IV
};
