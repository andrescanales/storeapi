const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const ProductLogSchema = new mongoose.Schema(
	{
		product: { 
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'Product',
		},
		price: {
			type: Number,
			required: true,
			default: 0,
		},
	},
);

ProductLogSchema.plugin(timestamps);
ProductLogSchema.plugin(mongooseStringQuery);
const ProductLog = mongoose.model('ProductLog', ProductLogSchema);
module.exports = ProductLog;