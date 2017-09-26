/* Module dependencies */
const errors = require('restify-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Model dependencies */
const Client = require('../models/client');	
	
	/* Get all clients */
	exports.getAll =  function(req, res, next){
	 	Client.apiQuery(req.params, function(err, docs){
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

	/* Register a new client */
	exports.register = function (req, res, next){
		if(!req.is('application/json')){
			return next(
				new errors.InvalidContentError("Expects 'application/json'"),
				);
		}
		let data = req.body || {};
		let client = new Client(data);
		client.password = bcrypt.hashSync(req.body.password, 10);
		client.save(function(err){
			if(err){
				console.error(err);
				return next(new errors.InternalError(err.message));
				next();
			}else{
				client.password = undefined;
				return res.json(client);
			}
			res.send(201, {result: 'created'});
			next();
		});
	}

	/* Sign in a client and retrieve a token */	
	exports.signIn = function (req, res, next){
		if(!req.is('application/json')){
		return next(
			new errors.InvalidContentError("Expects 'application/json'"),
			);
		}
		let data = req.body || {};
		Client.findOne({email: data.email}, function(err, doc){
			if(err){
				console.error(err);
				return next(
					new errors.InvalidContentError(err.errors.name.message),
					);
			}else if (!doc) {
				return next(
					new errors.ResourceNotFoundError(
						'Authentication failed. Client not found',
					),
				);
			}else{
				if(!doc.comparePassword(data.password)){
					return next(
					new errors.ResourceNotFoundError(
						'Authentication failed. Wrong password',
						),
					);
				}
			}
			res.status(200);
			res.json({token: jwt.sign({
				_id: doc._id,
				email: doc.email
				}, 'secret', { expiresIn: '1h' })
			});
			next();
		});
	}
