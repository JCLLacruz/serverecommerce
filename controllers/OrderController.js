const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const OrderController = {
	async create(req, res) {
		try {
			const order = await Order.create(req.body);
			await Order.findByIdAndUpdate(req.body.ProductId, { $push: { CommentIds: comment._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { CommentIds: comment._id } });
			res.status(201).send({msg: 'Order created',order});
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem creating the order' });
		}
	},
	async update(req, res) {
		try {
			const comment = await Comment.findByIdAndUpdate(req.params._id, req.body, { new: true });
			res.send({ msg: 'Comment succesfully updated', comment });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem updating the order' });
		}
	},
	async delete(req, res) {
		try {
			const order = await Order.findByIdAndDelete(req.params._id);
			await Product.findByIdAndUpdate(order.ProductId, { $pull: { OrderIds: order._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { OrderIds: order._id } });
			res.send({ msg: 'Comment delete ', order });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem trying to remove the order' });
		}
	},
	async getAll(req, res) {
		try {
			const { page = 1, limit = 10 } = req.query;
			const orders = await Order.find()
				.populate('LikeIds.UserId')
				.limit(limit)
				.skip((page - 1) * limit);
			res.send(orders);
		} catch (error) {
			console.error(error);
		}
	},
};

module.exports = OrderController;
