const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const PurchaseSchema = new mongoose.Schema(
	{
		client: { type: Schema.Types.ObjectId, ref: 'Client' },
	},
);

PurchaseSchema.plugin(timestamps);
PurchaseSchema.plugin(mongooseStringQuery);
const Purchase = mongoose.model('Purchase', PurchaseSchema);
module.exports = Purchase;
