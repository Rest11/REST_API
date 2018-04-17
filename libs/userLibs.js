const jwt = require('jsonwebtoken');
const config = require('config');
const libs = require('../libs/libs');
const { usersDB } = require('../models');
const attr = ['id', 'phone', 'name', 'email'];

const login = async (req, res) => {
	try {
		const params = {
			find: {
				email: req.body.email,
				password: req.body.password,
			},
			forCreate: {
				email: req.body.email,
				password: req.body.password,
			}
		};

		const data = await libs.getOrCreate(usersDB, params);
		if (data.hasOwnProperty('err')) return res.status(422).send(data.err);

		const token = jwt.sign(data[0].dataValues.email, config.get('secretKey'));
		res.status(200).send({ token });
	} catch (err) {
		console.log('~~~~~~~~~~userLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

const getUser = (req, res) => {
	try {
		const user = libs.showAttr(attr, req.currentUser);
		res.status(200).send(user);
	} catch (err) {
		console.log('~~~~~~~~~~userLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

const updateCurrentUser = async (req, res) => {
	try {
		const query = {
			email: req.currentUser.email,
		};
		const data = await libs.updateItem(usersDB, query, req.body);
		if (data.hasOwnProperty('err')) return res.status(422).send(data.err);

		const user = libs.showAttr(attr, data);
		res.status(200).send(user);
	} catch (err) {
		console.log('~~~~~~~~~~userLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

const getUserById = async (req, res) => {
	try {
		const params = {
			query: {
				id: req.params.id,
			},
		};

		const data = await libs.getItemByID(usersDB, params);

		if (!data) return res.sendStatus(404);
		if (data.hasOwnProperty('err')) return res.status(422).send(data.err);

		const user = libs.showAttr(attr, data);
		res.status(200).send(user);
	} catch (err) {
		console.log('~~~~~~~~~~userLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

module.exports = {
	login,
	getUser,
	updateCurrentUser,
	getUserById,
};