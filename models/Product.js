const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Please enter a title'],
    },
    description: {
        type: String,
        required: [true, 'Please enter a body'],
    },
    image_path: String,
    OrderId: {
        type: ObjectId,
        ref: 'Order'
    },
    status: String,
    TagIds: [{
        TagId: {type: ObjectId, ref: 'Tag'}
    }],
    LikeIds: [{
        UserId: {type: ObjectId, ref: 'User'}
    }],
    CommentIds: [{
        type: ObjectId,
        ref: 'Comment'
    }],

}, { timestamps: true });

ProductSchema.index({
    title: 'text',
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
