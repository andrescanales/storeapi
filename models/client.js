
const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

const ClientSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		address: {
			type: String,
		},
	},
);

ClientSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

ClientSchema.plugin(timestamps);
ClientSchema.plugin(mongooseStringQuery);
const Client = mongoose.model('Client', ClientSchema);
module.exports = Client;
