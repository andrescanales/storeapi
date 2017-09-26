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

	exports.createNew = function(req, res, next) {
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
					let purchaseItem = new PurchaseItem();

					Product.findOne({_id: data.product}, function(err, prod){
						if (err) {
							console.error(err);
							return next(
								new errors.InvalidContentError(err.errors.name.message),
							);
						} else if (!prod) {
							return next(
								new errors.ResourceNotFoundError('The product you requested could not be found.'),
							);
						} else if (prod.stock < data.quantity){
							return next(
								new errors.ResourceNotFoundError('The product you requested is not available.'),
							);
						}

						// In a more advanced scneario, we'll need to connecto to a payment gatway platform
						purchase.client = req.user._id;
						purchase.save(function(err, doc){
							if (err){
								console.error(err);
								return next(new errors.InternalError(err.message));
							}else if(doc){
								purchaseItem.purchase = doc._id;
								purchaseItem.product = data.product;
								purchaseItem.quantity = data.quantity;
								purchaseItem.save(function(err){
									if (err){
										console.error(err);
										return next(new errors.InternalError(err.message));
									}
								});
							}
						});
						newStock = (prod.stock - data.quantity);
						console.error(prod._id);
						console.error(newStock);
						Product.update({_id: prod._id}, { $set: { stock: newStock }}, function(err){
							if (err) {
								console.error(err);
								return next(
									new errors.InvalidContentError(err.errors.name.message),
								);
							}

							res.send(200, {message: "Purchase succesfully"});
							next();
						});

					});
				}
			});
		}else{
			res.send(401, {message: 'Unauthorize user!'});	
		}
	}