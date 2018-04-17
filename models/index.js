const Sequelize = require('sequelize');
const config = require('config');
const { userSchema } = require('./schemes/userSchema');
const { itemSchema } = require('./schemes/itemSchema');

const sequelize = new Sequelize(config.get('db').dbName, config.get('db').user, config.get('db').password, {
	host: config.get('db').host,
	dialect: config.get('db').dialect,
	pool: {
		max: config.get('db').connectionLimitMax,
		min: config.get('db').connectionLimitMin,
		idle: config.get('db').idle,
	},
});

const usersDB = sequelize.define('users', userSchema);
const ItemsDB = sequelize.define('items', itemSchema);

module.exports = {
	usersDB,
	ItemsDB,
};