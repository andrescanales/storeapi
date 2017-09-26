/* Module dependencies */
const errors = require('restify-errors');
const jwt = require('jsonwebtoken');
/* Model dependencies */
const Purchase = require('../models/purchase');
const Product = require('../models/product');
const PurchaseItem = require('../models/purchaseItem');

	/* Get all purchases */
	exports.getAll = function(req, res, next) {
		if(req.headers && req.headers.authorization) {
			jwt.verify(req.headers.authorization, 'secret', function(err, decode){
				if(err) {
					res.send(401, {message: 'Unauthorize user!'});

				}else{
					req.user = decode;
					if(req.user.admin){
						// List of purchases:
						Purchase.apiQuery(req.params, function(err, docs) {
							if (err) {
								console.error(err);
								return next(
									new errors.InvalidContentError(err.errors.name.message),
								);
							}
							res.send(docs);
							next();
						});
						// List of purchases.
					}else{
						res.send(401, {message: 'Not allowed to perform this action!'});
					}
					
				}
			});
		}else{
			res.send(401, {message: 'Unauthorize user!'});	
		}
	}
/*
	exports.purchase = function(req, res, next) {
		// Revisar como vamos a pasar los params del user a traves del token
		//Recibo un post con 1 o varios json con products + quantities
		//Creo 1 purchase
		//Creo 1 o + purchases items
		if(!req.is('application/json')){
			return next(
				new errors.InvalidContentError("Expects 'application/json'"),
				);
		}

		if(req.headers && req.headers.authorization) {
			jwt.verify(req.headers.authorization, 'secret', function(err, decode){
				if(err) {
					res.send(401, {message: 'Unauthorize user!'});
				}else{
					req.user = decode;
					let data = req.body || {};
					let purchase = new Purchase();
					purchase.save()		
				}
			});
		}else{
			res.send(401, {message: 'Unauthorize user!'});	
		}
	}

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
			res.send(201, {result: 'created'});
			next();
		});
	}
*/