
const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema(
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
	},
);

AdminSchema.plugin(timestamps);
AdminSchema.plugin(mongooseStringQuery);
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;