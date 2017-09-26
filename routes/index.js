/**
 * Controllers dependencies:
 */

const product = require('../controllers/productController');
const client = require('../controllers/clientController');
const purchase = require('../controllers/purchaseController');
const admin = require('../controllers/adminController');

/**
 * Routes:
 */
module.exports = function(server){

	server.get('/products', product.getAll);
	server.get('/products/available', product.getAllAvailable);
	server.post('/products', product.createNew);
	server.del('/products/:product_id', product.deleteOne);
	server.put('/products/:product_id', product.updateOne);
	server.put('/products/likes/:product_id', product.likeOne);

	server.get('/clients', client.getAll);
	server.post('/clients', client.register);
	server.post('/clients/sign_in', client.signIn);

	server.get('/purchases', purchase.getAll);

	server.get('/admins', admin.getAll);
	server.post('/admins', admin.createNew);
	server.post('/admins/sign_in', admin.signIn);
};