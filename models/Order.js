const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const OrderSchema = new mongoose.Schema({
    ProductId: [{
        type: ObjectId,
        ref: 'Product'
    }],
    UserId: {
        type: ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;