const Product = require('../models/Product');
const User = require('../models/User');

const ProductController = {
	async create(req, res) {
		try {
			const product = await Product.create({ ...req.body});
			res.status(201).send({msg: 'Product is created',product});
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem creating the Product' });
		}
	},
	async update(req, res) {
		try {
			const product = await Product.findByIdAndUpdate(req.params._id, req.body, { new: true });
			res.send({ msg: 'Product succesfully updated', product });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem updating the Product' });
		}
	},
	async delete(req, res) {
		try {
			const product = await Product.findByIdAndDelete(req.params._id);
			res.send({ msg: 'Product deleted', product });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem trying to remove the Product' });
		}
	},
	async getAll(req, res) {
		try {
			const { page = 1, limit = 10 } = req.query;
			const products = await Product.find()
			.populate('LikeIds.UserId','CommentIds')
			.limit(limit)
			.skip((page - 1) * limit);
			res.send({msg: 'All Products', products});
		} catch (error) {
			console.error(error);
		}
	},
	async getProductsByTitle(req, res) {
		try {
			const products = await Product.find({
				$text: {
					$search: req.params.title,
				},
			});
			res.send({msg: 'Product by title found',products});
		} catch (error) {
			console.error(error);
		}
	},
	async getById(req, res) {
		try {
			const product = await Product.findById(req.params._id).populate('LikeIds.UserId');
			res.send({msg: 'Product by id found',product});
		} catch (error) {
			console.error(error);
		}
	},
	async like(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params._id,
                { $push: { LikeIds: { UserId: req.user._id }}},
                { new: true }
            );
            res.send({msg: 'Product liked',product});
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: "There was a problem with your like"});
        }
    },
    async dislike(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params._id,
                { $pull: { LikeIds: { UserId: req.user._id }}},
				{new: true}
            );
            res.send({ msg: "Like deleted", Product });
        } catch (error) {
            console.error(error)
            res.status(500).send({ msg: "There was a problem trying to remove the like"})
        }
    }  
};

module.exports = ProductController;
