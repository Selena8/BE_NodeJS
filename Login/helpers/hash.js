const crypto = require('crypto')
const { log } = require('console')

const hashPassword = (input) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const hashedPassword = crypto.pbkdf2Sync(input, salt, 100, 64, 'sha1').toString('hex')

    return {
        salt,
        hashedPassword
    }
}

const hashPasswordWithSalt = (input, salt) => {
    const hashedPassword = crypto.pbkdf2Sync(input, salt, 100, 64, 'sha1').toString('hex');
    
    return hashedPassword;
};
module.exports = {
    hashPassword,
    hashPasswordWithSalt
}