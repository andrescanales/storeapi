const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const PurchaseLogSchema = new mongoose.Schema(
	{
		client: { 
			type: mongoose.Schema.Types.ObjectId, ref: 'Client' 
		},
		purchase: { 
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'Purchase',
		},
		product: { 
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'Product',
		},
		quantity: {
			type: Number,
			required: true,
			default: 0,
		},
	},
);

PurchaseLogSchema.plugin(timestamps);
PurchaseLogSchema.plugin(mongooseStringQuery);
const PurchaseLog = mongoose.model('PurchaseLog', PurchaseLogSchema);
module.exports = PurchaseLog;