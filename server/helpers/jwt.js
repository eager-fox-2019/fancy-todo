const jwt = require('jsonwebtoken')

const generateToken = (input) => {
	let signOptions = {
	 issuer: "StefKwan",
	 expiresIn:  "1d",
	 algorithm:  "HS256"
	};
	
	return jwt.sign({input}, process.env.JWT_SECRET, signOptions)
}

const verifyToken = (token) => {
	let verifyOptions = {
	 issuer: "StefKwan",
	 expiresIn:  "1d",
	 algorithm:  "HS256"
	};

    return jwt.verify(token, process.env.JWT_SECRET, verifyOptions)
}

module.exports = {
	generateToken: generateToken,
	verifyToken: verifyToken
}
//Generate token payload