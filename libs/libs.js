const multer = require('multer');
const util = require('util');
const fs = require('fs');

const pathFile = './uploadedFiles/';
const uploadWithCallback = multer({
	dest: pathFile,
	limits: {
		fileSize: 5000000, // until 5MB
		fieldNameSize : 5 // size of the file name (bytes)
	},
}).any();

//replace callback to promise
const upload = util.promisify(uploadWithCallback);

const errMessage = (err) => {
	if (Array.isArray(err.errors)) {
		return err.errors.map((err) => {
			return {
				field: err.path,
				message: err.message,
			};
		})
	}
	return { message: err };
};

const showAttr = (attr, from) => {
	const data = {};
	for (let item of attr) {
		data[item] = from[item];
	}
	return data;
};

const includeData = (currentDB, joinDB, index) => {
	joinDB.hasOne(currentDB, { foreignKey: index });
	currentDB.belongsTo(joinDB);
};

const getOrCreate  = async (db, params) => {
	try {
		await db.sync({force: false});
		return await db.findOrCreate({
			where: params.find,
			defaults: params.forCreate,
		});
	} catch (err) {
		if (err.errors && err.errors[0].type === 'unique violation') return { err: errMessage('Wrong password') };
		return { err: errMessage(err) };
	}
};

const updateItem = async (db, query, newParams) => {
	try {
		const data = await db.update(
			newParams,
			{
				where: query,
				individualHooks: true,
			}
		);
		return data[1][0];
	} catch (err) {
		return { err: errMessage(err) };
	}
};

const getItemByID = async (db, params) => {
	try {
		let isInclude = false;

		if (params.hasOwnProperty('includeDB')) {
			isInclude = true;
			await includeData(db, params.includeDB.db, params.includeDB.index);
		}

		return await db.findOne({
			include: isInclude ? params.includeDB.fields : '',
			where: params.query,
		});
	} catch (err) {
		return { err: errMessage(err) };
	}
};

const searchItem = async (db, params, query) => {
	try {
		let isInclude = false;
		let isOrder = false;

		if(!Object.keys(query).length) return [];

		if (params.hasOwnProperty('includeDB')) {
			isInclude = true;
			await includeData(db, params.includeDB.db, params.includeDB.index);
		}
		if (params.hasOwnProperty('order')) isOrder = true;

		return await db.findAll({
			include: isInclude ? params.includeDB.fields : '',
			order: isOrder ? [[ params.order.orderBy, params.order.orderType ]] : '',
			where: query,
		});
	} catch (err) {
		return { err: errMessage(err) };
	}
};

const deleteItem = async (db, query) => {
	try {
		return await db.destroy({
			where: query,
		});
	} catch (err) {
		return { err: errMessage(err) };
	}
};

const uploadFile = async (req, res) => {
	try {
		const timestamp = new Date().getTime();
		
		await upload(req, res);
		if (!req.files) return { err: errMessage('File is not found') };

		const fileName = `${timestamp}-${req.files[0].originalname}`;
		const urlImg = `${req.headers.host}${req.path}/${fileName}`;
		const fullPath = `${pathFile}${req.files[0].filename}`;

		const src = fs.createReadStream(req.files[0].path);
		const dest = fs.createWriteStream(`${pathFile}${fileName}`);

		src.pipe(dest);
		fs.unlinkSync(fullPath);

		return urlImg;
	} catch (err) {
		return { err: errMessage(err) };
	}
};

const removeFile = async (fileName) => {
	try {
		const fullPath = `${pathFile}${fileName}`;
		fs.unlinkSync(fullPath);
	} catch (err) {
		return { err: errMessage(err) };
	}
};

module.exports = {
	showAttr,
	getOrCreate,
	updateItem,
	getItemByID,
	searchItem,
	deleteItem,
	uploadFile,
	removeFile,
};