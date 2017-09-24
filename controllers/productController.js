/* Module dependencies */
const errors = require('restify-errors');
/* Model dependencies */
const Product = require('../models/product');

	/* Get all products */
	exports.getAll = function(req, res, next) {
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
	}

	/* Create new product */
	exports.createNew = function (req, res, next) {
		if(!req.is('application/json')){
			return next(
				new errors.InvalidContentError("Expects 'application/json'"),
				);
		}

		let data = req.body || {};
		let product = new Product(data);
		product.save(function(err){
			if (err){
				console.error(err);
				return next(new errors.InternalError(
					err.message
					));
				next();
			}
			res.send(201);
			next();
		});
	}
