const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const ProductSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: false,
		},
		price: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ minimize: false },
);

ProductSchema.plugin(timestamps);
ProductSchema.plugin(mongooseStringQuery);
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;