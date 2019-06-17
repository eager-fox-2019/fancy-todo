function generatePassword() {
    let length = Math.floor(Math.random()*(10-4)+4)

    let password = ""
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    for(let i = 0; i<length; i++) {
        let random = chars[Math.floor(Math.random()*(62))]
        password += random
    }
    return password
}

module.exports = generatePassword