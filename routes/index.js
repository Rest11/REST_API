const userRoutes = require('./user');
const itemRoutes = require('./item');

module.exports = (app) => {
	userRoutes(app);
	itemRoutes(app);

	app.use((req, res) => {
		res.sendStatus(404);
	});
};
