// Hashing

const crypto = require('crypto');
const rawPassword = "nguyet982002"

function hashWithSHA512(input) {
    const output = crypto
        .createHash('sha512')
        .update(input)
        .digest('hex')

    return output
}
// Hash password with salt
function hashWithSalt(input) {
    const salt = crypto.randomBytes(16).toString('hex')
    const output = crypto.pbkdf2Sync(
        input,
        salt,
        1000,
        64,
        'sha512',
    ).toString('hex')
    
    return output
}

module.exports = {
    hashWithSHA512,
    hashWithSalt
}