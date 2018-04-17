const Sequelize = require('sequelize');
const { nameValid, passwordValid, phoneValid } = require('../validation');

const userSchema = {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: true,
		validate: {
			notEmpty: true,
			is: {
				args: nameValid,
				msg: 'Name is not correct',
			},
		},
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		validate: {
			notEmpty: true,
			isEmail: { msg: 'Email should be like this "example@test.com"' },
		}
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			is: {
				args: passwordValid,
				msg: 'Password is not correct',
			},
		},
	},
	phone: {
		type: Sequelize.STRING,
		allowNull: true,
		validate: {
			notEmpty: true,
			is: {
				args: phoneValid,
				msg: 'Phone should be like this "+38050123456789"',
			},
		},
	},
};

module.exports = {
	userSchema,
};