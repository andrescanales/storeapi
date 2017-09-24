const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const PurchaseItemSchema = new mongoose.Schema(
	{
		purchase: { 
			type: Schema.Types.ObjectId, 
			ref: 'Purchase',
		},
		product: { 
			type: Schema.Types:ObjectId, 
			ref: 'Product',
		},
		quantity: {
			type: Number,
			required: true,
			default: 0,
		},
	},
);

PurchaseItemSchema.plugin(timestamps);
PurchaseItemSchema.plugin(mongooseStringQuery);
const PurchaseItem = mongoose.model('PurchaseItem', PurchaseItemSchema);
module.exports = PurchaseItem;