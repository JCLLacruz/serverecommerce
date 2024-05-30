const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const OrderController = {
	async create(req, res) {
		try {
			const order = await Order.create({ ...req.body, UserId: req.user._id });
			await User.findByIdAndUpdate(req.user._id, { $push: { OrderIds: order._id} });
			req.body.ProductIds.forEach(async (ProductId) => {
				await Product.findByIdAndUpdate(ProductId, { $push: { OrderIds: order._id } });
			});
			res.status(201).send({ msg: 'Order created', order });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem creating the order' });
		}
	},
	async update(req, res) {
		try {
			const order = await Order.findByIdAndUpdate(req.params._id, req.body, { new: true });
			res.send({ msg: 'Order succesfully updated', comment });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem updating the order' });
		}
	},
	async delete(req, res) {
		try {
			const order = await Order.findByIdAndDelete(req.params._id);
			order.ProductId.forEach(async (ProductId) => {
				await Product.findByIdAndUpdate(ProductId, { $pull: { OrderIds: order._id } });
			});
			await User.findByIdAndUpdate(req.user._id, { $pull: { OrderIds: order._id } });
			res.send({ msg: 'Comment delete ', order });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem trying to remove the order' });
		}
	},
	async getAll(req, res) {
		try {
			const orders = await Order.find().populate('ProductIds');
			res.send({ msg: 'All orders', orders});
		} catch (error) {
			console.error(error);
		}
	},
};

module.exports = OrderController;
