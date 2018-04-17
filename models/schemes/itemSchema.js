const Sequelize = require('sequelize');
const { titleValid } = require('../validation');

const itemSchema = {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			is: {
				args: titleValid,
				msg: 'Title is not correct',
			},
		},
	},
	price: {
		type: Sequelize.INTEGER,
		allowNull: false,
		validate: {
			notEmpty: true,
			isDecimal: { msg: 'Price is not correct' },
		},
	},
	image: {
		type: Sequelize.STRING,
		allowNull: true,
		unique: true,
		validate: {
			notEmpty: true,
		},
	},
	userId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		validate: {
			notEmpty: true,
			isNumeric: { msg: 'User ID is not correct' },
		},
	},
};

module.exports = {
	itemSchema,
};