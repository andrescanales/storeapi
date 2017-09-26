/* Module dependencies */
const errors = require('restify-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Model dependencies */
const Admin = require('../models/admin');	
	
	/* Get all admins */
	exports.getAll =  function(req, res, next){
		Admin.apiQuery(req.params, function(err, data){
			if(err){
				console.error(err);
				return next(new errors.InvalidContentError(err.errors.name.message),);
			}
			res.send(data);
			next();
		});
	}

	exports.createNew = function(req, res, next){
		if(!req.is('application/json')){
			return next(new errors.InvalidContentError("Expects 'application/json'"),);
		}
		if(!req.body){
			return next(new errors.InvalidContentError("Error: No data received"));
		}
		let data = req.body || {};
		let admin = new Admin(data);
		admin.password = bcrypt.hashSync(data.password, 10);
		admin.save(function(err){
			if(err){
				return next(new errors.InternalError(err.message));
			}else{
				admin.password = 'undefined';
				return res.json(data); 
			}
			res.send(201, {result: 'created'});
			next();
		});
	}

	exports.signIn = function(req, res, next){
		if(!req.is('application/json')){
			return next(new errors.InvalidContentError("Expects 'application/json'"),);
		}
		if(!req.body){
			return next(new errors.InvalidContentError("Error: No data received"));
		}
		let body = req.body || {};
		Admin.findOne({email: body.email}, function(err, data){
			if(err){
				return next(new errors.InvalidContentError(err.errors.name.message));
			}else if(!data){
				return next(new errors.ResourceNotFoundError('Authentication failed. Admin not found'));
			}else{
				if(!data.comparePassword(body.password)){
					return next(
					new errors.ResourceNotFoundError('Authentication failed. Wrong password'),
					);
				}
			}
			res.status(200);
			res.json({token: jwt.sign({
				_id: data._id,
				admin: data.email
				}, 'secret', { expiresIn: '1h' })
			});
			next();
		});
	}