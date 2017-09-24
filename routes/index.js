/**
 * Controllers dependencies:
 */

const product = require('../controllers/productController');
const client = require('../controllers/clientController');

/**
 * Routes:
 */
module.exports = function(server){

	server.get('/products', product.getAll);
	server.post('/products', product.createNew);

	server.get('/clients', client.getAll);
	server.post('/clients', client.register);
	server.post('/clients/sign_in', client.signIn);
};