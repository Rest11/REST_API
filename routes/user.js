const user = require('../libs/userLibs');
const { isAuthentication } = require('../libs/authentication');

module.exports = (app) => {
/* Login user
 * @header: Content-Type: application/x-www-form-urlencoded
 * @body - x-www-form-urlencoded: {email: 1user@test.com, password: pass}
 * @example: http://localhost:3000/api/login
*/
	app.post('/api/login', (req, res) => {
		user.login(req, res);
	});

/* Get user
 * @header: Content-Type: application/x-www-form-urlencoded, Authorization: user token
 * @example: http://localhost:3000/api/me
*/
	app.get('/api/me', isAuthentication, (req, res) => {
		user.getUser(req, res);
	});

/* Update current user
 * @header: Content-Type: application/x-www-form-urlencoded, Authorization: user token
 * @body - x-www-form-urlencoded: {name: <newName>, email: <newEmail>, phone: <newPhone> ... etc}
 * @example: http://localhost:3000/api/me
*/
	app.patch('/api/me', isAuthentication, (req, res) => {
		user.updateCurrentUser(req, res);
	});

/* Get user by ID
 * @header: Content-Type: application/x-www-form-urlencoded, Authorization: user token
 * @example: http://localhost:3000/api/user/1
*/
	app.get('/api/user/:id', isAuthentication, (req, res) => {
		user.getUserById(req, res);
	});
};
