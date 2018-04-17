const item = require('../libs/itemLibs');
const { isAuthentication } = require('../libs/authentication');

module.exports = (app) => {
/* Create item
 * @header: Content-Type: application/x-www-form-urlencoded, Authorization: user token
 * @body: x-www-form-urlencoded: {title: 'test title', price: 123.12}
 * @example: http://localhost:3000/api/items
*/
	app.post('/api/items', isAuthentication, (req, res) => {
		item.createItem(req, res);
	});

/* Search items
 * @header: Content-Type: application/x-www-form-urlencoded, Authorization: user token
 * @example: http://localhost:3000/api/item?title=1 title&userId=1&order_by=price&order_type=asc
*/
	app.get('/api/item?', isAuthentication, (req, res) => {
		item.searchItems(req, res);
	});

/* Get item by ID
 * @header: Content-Type: application/x-www-form-urlencoded, Authorization: user token
 * @example: http://localhost:3000/api/item/1
*/
	app.get('/api/item/:id', isAuthentication, (req, res) => {
		item.getItemById(req, res);
	});

/* Update item
* @header: Content-Type: application/x-www-form-urlencoded, Authorization: user token
* @body - x-www-form-urlencoded: {title: <newTitle>, price: <newPrice>, ... etc}
* @example: http://localhost:3000/api/item/1
*/
	app.patch('/api/item/:id', isAuthentication, (req, res) => {
		item.updateItem(req, res);
	});

/* Delete item
 * @header: Content-Type: application/x-www-form-urlencoded, Authorization: user token
 * @example: http://localhost:3000/api/item/1
*/
	app.delete('/api/item/:id', isAuthentication, (req, res) => {
		item.deleteItem(req, res);
	});

/* Upload image
 * @header: Authorization - user token
 * @body: form-data: {image: Choose Files}
 * @example: http://localhost:3000/api/item/1/image
*/
	app.put('/api/item/:id/image', isAuthentication, (req, res) => {
		item.uploadImg(req, res);
	});

/* Remove image
 * @header: Content-Type: application/x-www-form-urlencoded, Authorization: user token
 * @example: http://localhost:3000/api/item/1/image
*/
	app.delete('/api/item/:id/image', isAuthentication, (req, res) => {
		item.removeImg(req, res);
	});
};
