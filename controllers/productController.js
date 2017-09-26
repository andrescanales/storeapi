/* Module dependencies */
const errors = require('restify-errors');
const jwt = require('jsonwebtoken');
/* Model dependencies */
const Product = require('../models/product');
const ProductLog = require('../models/productLog');

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

	exports.getAllAvailable = function(req, res, next) {
		Product.where('stock').gt(0).exec(function(err,data){
			if (err) {
				console.error(err);
				return next(
					new errors.InvalidContentError(err.errors.name.message),
				);
			}
			res.send(data);
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

		if(req.headers && req.headers.authorization) {
			jwt.verify(req.headers.authorization, 'secret', function(err, decode){
				if(err) {
					res.send(401, {message: 'Unauthorize user!'});

				}else{
					req.user = decode;
					console.error(req.user.admin);
					if(req.user.admin){
						// create product:
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
						// create product.	
					}else{
						res.send(401, {message: 'Not allowed to perform this action!'});
					}
					
				}
			});
		}else{
			res.send(401, {message: 'Unauthorize user!'});	
		}
	}

	/* Delete a product */
	exports.deleteOne = function (req, res, next) {
		if(req.headers && req.headers.authorization) {
			jwt.verify(req.headers.authorization, 'secret', function(err, decode){
				if(err) {
					res.send(401, {message: 'Unauthorize user!'});

				}else{
					req.user = decode;
					if(req.user.admin){
						// delete product:
						let data = req.params || {};
						Product.remove({_id: data.product_id}, function(err){
							if (err){
								console.error(err);
								return next(new errors.InvalidContentError(
										err.errors.name.message
										)
								);
							}
							res.send(202, {result: 'deleted'});
							next();
						});
						// delete product.	
					}else{
						res.send(401, {message: 'Not allowed to perform this action!'});
					}
					
				}
			});
		}else{
			res.send(401, {message: 'Unauthorize user!'});	
		}
	}

	/* Update a product */
	exports.updateOne = function (req, res, next){
		if (!req.is('application/json')) {
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
					if(req.user.admin){
						// update product:
						let data = req.body || {};
						if(!data._id){
							data = Object.assign({}, data, {_id: req.params.product_id});
						}

						Product.findOne({_id: req.params.product_id}, function(err, doc){
							if (err) {
								console.error(err);
								return next(
									new errors.InvalidContentError(err.errors.name.message),
								);
							} else if (!doc) {
								return next(
									new errors.ResourceNotFoundError(
										'The resource you requested could not be found.',
									),
								);
							}

							Product.update({_id: data._id}, data, function(err){
								if (err) {
									console.error(err);
									return next(
										new errors.InvalidContentError(err.errors.name.message),
									);
								}
								if (data.price) {
									let productLog = new ProductLog();
									productLog.product = data._id;
									productLog.price = doc.price;
									productLog.save(function(err){
										if (err){
											return next(new errors.InternalError(err.message));
										}
									});
								}

								res.send(200, data);
								next();
							});
						});
						// update product.	
					}else{
						res.send(401, {message: 'Not allowed to perform this action!'});
					}
					
				}
			});
		}else{
			res.send(401, {message: 'Unauthorize user!'});	
		}

	}


	/* Like a product(update) */
	exports.likeOne = function (req, res, next){
		if(req.headers && req.headers.authorization) {
			jwt.verify(req.headers.authorization, 'secret', function(err, decode){
				if(err) {
					res.send(401, {message: 'Unauthorize user!'});

				}else{
					req.user = decode;
					console.error(decode);
					// Like a product:
					Product.findOne({_id: req.params.product_id}, function(err, data){
						if (err) {
							console.error(err);
							return next(
								new errors.InvalidContentError(err.errors.name.message),
							);
						} else if (!data) {
							return next(
								new errors.ResourceNotFoundError(
									'The resource you requested could not be found.',
								),
							);
						} else {
							if(!data.likes){
								data.likes = 1;
							}else{
								data.likes = data.likes + 1;
							}
						}

						Product.update({_id: data._id}, data, function(err){
							if (err) {
								console.error(err);
								return next(
									new errors.InvalidContentError(err.errors.name.message),
								);
							}

							res.send(200, data);
							next();
						});
					});
					// Like a product.
				}
			});
		}else{
			res.send(401, {message: 'Unauthorize user!'});	
		}
	}

	exports.search = function (req, res, next){
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'"),
			);
		}
		let data = req.body || {};
		console.error(data.product);
		Product.find({$text: { $search: data.product }}, function(err,data){
			if (err) {
				console.error(err);
				return next(
					new errors.InvalidContentError(err.errors.name.message),
				);
			}else if (!data) {
				return next(
					new errors.ResourceNotFoundError(
						'The resource you requested could not be found.',
					),
				);
			}
			res.send(200, data);
			next();
		});
	}