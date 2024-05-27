const Product = require('../models/Product.js');
const User = require('../models/User.js');
const Tag = require('../models/Tag.js');

const createTag = async (req) => {
	const regExpTag = new RegExp(req.body.tag, 'i');
	const match = await Tag.findOne({tag: regExpTag});
	if(!match) {
		const tag = await Tag.create(req.body);
		return tag;
	} else {
		const tag = match;
		return tag;
	}
};

const TagController = {
	async addTagToUser(req,res) {
        try {
			const tag = createTag(req);
            const user = await User.findByIdAndUpdate(req.user._id,{$push: {TagIds: {TagId: tag._id}}},{new: true});
            await Tag.findByIdAndUpdate(tag._id,{$push: {UserIds: {UserId: user._id}}},{new: true});
            res.send({msg:'Tag added', user, tag});
        } catch (error) {
            console.error(error);
			res.status(500).send({ msg: 'There was a problem add tag.' },error);
        }
    },
	async addTagToProduct(req,res) {
        try {
			const tag = await createTag(req);
            const product = await Product.findByIdAndUpdate(req.params.productId,{$push: {TagIds: {TagId: tag._id}}},{new: true});
            await Tag.findByIdAndUpdate(tag._id,{$push: {ProductIds: {ProductId: product._id}}},{new: true});
            res.send({msg:'Tag added', product, tag});
        } catch (error) {
            console.error(error);
			res.status(500).send({ msg: 'There was a problem add tag.' },error);
        }
    },
	async deleteTagToUser(req,res) {
        try {
            const user = await User.findByIdAndUpdate(req.user._id,{$pull: {TagIds: {TagId: req.body._id}}},{new: true});
            await Tag.findByIdAndUpdate(req.body.tagId,{$pull: {UserIds: {UserId: user._id}}},{new: true});
            res.send({msg:'Tag deleted', user});
        } catch (error) {
            console.error(error);
			res.status(500).send({ msg: 'There was a problem add tag.' },error);
        }
    },
	async deleteTagToProduct(req,res) {
        try {
            const product = await Product.findByIdAndUpdate(req.params.productId,{$pull: {TagIds: {TagId: req.body._id}}},{new: true});
            const tag = await Tag.findByIdAndUpdate(req.body.tag,{$pull: {ProductIds: {ProductId: product._id}}},{new: true});
            res.send({msg:'Tag deleted', product});
        } catch (error) {
            console.error(error);
			res.status(500).send({ msg: 'There was a problem add tag.' },error);
        }
    }
};

module.exports = TagController;
