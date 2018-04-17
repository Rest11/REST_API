const libs = require('../libs/libs');
const { ItemsDB, usersDB } = require('../models');
const attr = ['id', 'phone', 'name', 'email'];

const createItem = async (req, res) => {
	try {
		const params = {
			find: {
				title: req.body.title,
				userId: req.currentUser.id,
			},
			forCreate: {
				title: req.body.title,
				price: req.body.price,
				userId: req.currentUser.id,
			}
		};

		const data = await libs.getOrCreate(ItemsDB, params);
		if (data.hasOwnProperty('err')) return res.status(422).send(data.err);

		data[0].dataValues.user = libs.showAttr(attr, req.currentUser);
		res.status(201).send(data[0].dataValues);
	} catch (err) {
		console.log('~~~~~~~~~~itemLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

const searchItems = async (req, res) => {
	try {
		const params = {
			order: {
				orderBy: req.query.order_by || 'createdAt',
				orderType: req.query.order_type || 'desc',
			},
			includeDB: {
				db: usersDB,
				index: 'userId',
				fields: [
					{ model: usersDB, attributes: ['id', 'name', 'phone', 'email'] },
				],
			},
		};

		let query = JSON.parse(JSON.stringify(req.query));
		delete query.order_by;
		delete query.order_type;

		const data = await libs.searchItem(ItemsDB, params, query);

		if(!data.length) return res.sendStatus(404);
		if (data.hasOwnProperty('err')) return res.status(422).send(data.err);
		res.status(200).send(data);
	} catch (err) {
		console.log('~~~~~~~~~~itemLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

const getItemById = async (req, res) => {
	try {
		const params = {
			query: {
				id: req.params.id,
			},
			includeDB: {
				db: usersDB,
				index: 'userId',
				fields: [
					{ model: usersDB, attributes: ['id', 'name', 'phone', 'email'] },
				],
			},
		};

		const data = await libs.getItemByID(ItemsDB, params);

		if (!data) return res.sendStatus(404);
		if (data.hasOwnProperty('err')) return res.status(422).send(data.err);
		res.status(200).send(data);
	} catch (err) {
		console.log('~~~~~~~~~~itemLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

const updateItem = async (req, res) => {
	try {
		const query = {
			id: req.params.id,
			userId: req.currentUser.id,
		};

		const data = await libs.updateItem(ItemsDB, query, req.body);

		if (!data) return res.sendStatus(404);
		if (data.hasOwnProperty('err')) return res.status(422).send(data.err);

		data.dataValues.user = libs.showAttr(attr, req.currentUser);
		res.status(200).send(data);
	} catch (err) {
		console.log('~~~~~~~~~~itemLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

const deleteItem = async (req, res) => {
	try {
		const query = {
			id: req.params.id,
			userId: req.currentUser.id,
		};

		const data = await libs.deleteItem(ItemsDB, query);

		if (!data) return res.sendStatus(404);
		if (data.hasOwnProperty('err')) return res.status(422).send(data.err);
		res.sendStatus(204);
	} catch (err) {
		console.log('~~~~~~~~~~itemLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

const uploadImg = async (req, res) => {
	try {
		const checkItem = {
			query: {
				id: req.params.id,
				userId: req.currentUser.id,
			},
		};

		const item = await libs.getItemByID(ItemsDB, checkItem);
		if (!item) return res.sendStatus(404);
		if (item.image) return res.sendStatus(403);

		const data = await libs.uploadFile(req, res);

		if (!data) return res.sendStatus(404);
		if (data.hasOwnProperty('err')) return res.status(422).send(data.err);

		const newParams = {
			image: data,
		};
		const itemData = await libs.updateItem(ItemsDB, checkItem.query, newParams);

		if (itemData.hasOwnProperty('err')) return res.status(422).send(itemData.err);
		itemData.dataValues.user = libs.showAttr(attr, req.currentUser);
		res.status(200).send(itemData);
	} catch (err) {
		console.log('~~~~~~~~~~itemLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

const removeImg = async (req, res) => {
	try {
		const checkItem = {
			query: {
				id: req.params.id,
				userId: req.currentUser.id,
			},
		};

		const item = await libs.getItemByID(ItemsDB, checkItem);
		if (!item) return res.sendStatus(404);
		if (!item.image) return res.sendStatus(403);

		const removeImg = item.image.match(/(image)(.*)/ig)[0].replace(/image\//i, '');
		await libs.removeFile(removeImg);

		const newParams = {
			image: null,
		};
		const itemData = await libs.updateItem(ItemsDB, checkItem.query, newParams);
		if (itemData.hasOwnProperty('err')) return res.status(422).send(itemData.err);

		res.sendStatus(204);
	} catch (err) {
		console.log('~~~~~~~~~~itemLibs- - err~~~~~~~~~~\n', err);
		res.sendStatus(500);
	}
};

module.exports = {
	createItem,
	searchItems,
	getItemById,
	updateItem,
	deleteItem,
	uploadImg,
	removeImg,
};