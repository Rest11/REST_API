const jwt = require('jsonwebtoken');
const config = require('config');
const { usersDB } = require('../models');

const checkToken = (token) => {
	return new Promise((resolve, reject) => {
		try {
			const emailUser = jwt.verify(token, config.get('secretKey'));
			resolve(emailUser);
		} catch (err) {
			reject(err);
		}
	})
};

const isAuthentication = async (req, res, next) => {
	try {
		const token = req.headers['authorization'];
		if (!token) throw new Error();

		const emailUser = await checkToken(token);
		const userDB = await usersDB.findOne({
			where: {
				email: { $like: emailUser },
			}
		});

		if (!userDB) throw new Error();

		req.currentUser = userDB.dataValues;
		next();
	} catch (err) {
		res.sendStatus(401);
	}
};

module.exports = {
	isAuthentication,
};