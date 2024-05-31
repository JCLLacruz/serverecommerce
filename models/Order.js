const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const OrderSchema = new mongoose.Schema({
    ProductIds: [{
        type: ObjectId,
        ref: 'Product'
    }],
    UserId: {
        type: ObjectId,
        ref: 'User'
    },
    status: {type: String},
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;