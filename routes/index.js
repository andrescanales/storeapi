/**
 * Module Dependencies
 */
const errors = require('restify-errors');

/**
 * Model Schema
 */
const Product = require('../models/product');

module.exports = function(server){

	/**
	 * List all products
	 */
	server.get('/products', (req, res, next) => {
		Product.apiQuery(req.params, function(err, docs) {
			if (err) {
				console.error(err);
				return next(
					new errors.InvalidContentError(err.errors.name.message),
				);
			}

			res.send(docs);
			next();
		});
	});
};