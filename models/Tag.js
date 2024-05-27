const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const TagSchema = new mongoose.Schema({
    tag: {type: String, required: [true, 'Name for tag is necessary'], unique: [true, 'The tag already exists']},
    UserIds: [
        {
            UserId: { type: ObjectId, ref: 'User' },
        },
    ],
    ProductIds: [
        {
            ProductId: { type: ObjectId, ref: 'Product' },
        },
    ],
},{timestamps: true});

TagSchema.methods.toJSON = function() {
    const tag = this._doc;
    delete tag.__v;
    return tag;
}


const Tag = mongoose.model('Tag',TagSchema);

module.exports = Tag;