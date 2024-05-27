const Comment = require('../models/Comment');
const Product = require('../models/Product');
const User = require('../models/User');

const CommentController = {
	async create(req, res) {
		try {
			const comment = await Comment.create(req.body);
			await Product.findByIdAndUpdate(req.body.ProductId, { $push: { CommentIds: comment._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { CommentIds: comment._id } });
			res.status(201).send(comment);
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem creating the comment' });
		}
	},
	async update(req, res) {
		try {
			const comment = await Comment.findByIdAndUpdate(req.params._id, req.body, { new: true });
			res.send({ msg: 'Comment succesfully updated', comment });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem updating the comment' });
		}
	},
	async delete(req, res) {
		try {
			const comment = await Comment.findByIdAndDelete(req.params._id);
			await Product.findByIdAndUpdate(comment.ProductId, { $pull: { CommentIds: comment._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { CommentIds: comment._id } });
			res.send({ msg: 'Comment delete ', comment });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem trying to remove the comment' });
		}
	},
	async getAll(req, res) {
		try {
			const { page = 1, limit = 10 } = req.query;
			const comments = await Comment.find()
				.populate('LikeIds.UserId')
				.limit(limit)
				.skip((page - 1) * limit);
			res.send(comments);
		} catch (error) {
			console.error(error);
		}
	},
	async like(req, res) {
		try {
			const comment = await Comment.findByIdAndUpdate(req.params._id, { $push: { LikeIds: { UserId: req.user._id } } }, { new: true });
			res.send(comment);
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem with your like' });
		}
	},
	async dislike(req, res) {
		try {
			const comment = await Comment.findByIdAndUpdate(req.params._id, { $pull: { LikeIds: { UserId: req.user._id } } });
			res.send({ msg: 'Like delete ', comment });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'There was a problem trying to dislike' });
		}
	},
};

module.exports = CommentController;
