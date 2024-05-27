const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;
const transporter = require('../config/nodemailer.js');

const UserController = {
	async register(req, res) {
		try {
			console.log(req.body);
			if (req.file) req.body.profileImg = req.file.filename;
			if (
				req.body.username == '' ||
				req.body.email == '' ||
				req.body.password == '' ||
				req.body.birthday == '' ||
				req.body.firstname == '' ||
				req.body.lastname == ''
			) {
				return res.send({ msg: 'Please fill out all required fields.' });
			}
			const password = await bcrypt.hash(req.body.password, 10);
			const user = await User.create({
				...req.body,
				password,
				role: 'user',
				emailConfirmed: false,
				online: false,
				image_path: req.file.filename,
			});
			const emailToken = jwt.sign({ email: req.body.email }, JWT_SECRET, { expiresIn: '48h' });
			const url = 'http://localhost:3001/users/confirm/' + emailToken;
			await transporter.sendMail({
				to: req.body.email,
				subject: 'Please confirm your email.',
				html: `<h3> Welcome to NeverBoringNetwork, only one step more to enjoy!</h3>
				<a href=${url}>Click to confirm your email</a>`,
			});
			res.status(201).send({ msg: `The user's email must be confirmed.`, user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error.', error });
		}
	},
	async confirmUser(req, res) {
		try {
			const emailToken = req.params.emailToken;
			const payload = jwt.verify(emailToken, JWT_SECRET);
			await User.updateOne({ email: payload.email }, { $set: { emailConfirmed: true } });
			res.status(201).send({ msg: 'User email was confirmed. User created.' });
		} catch (error) {
			console.error(error);
			res.status(500).send(error);
		}
	},
	async login(req, res) {
		try {
			const user = await User.findOne({
				email: req.body.email,
			});
			if (!user) {
				return res.status(400).send({ msg: 'Email or password are wrong.' });
			}
			const isMatch = await bcrypt.compare(req.body.password, user.password);
			if (!isMatch) {
				return res.status(400).send({ msg: 'Email or password are wrong.' });
			}
			const token = jwt.sign({ _id: user._id }, JWT_SECRET);
			if (user.tokens.length > 4) user.tokens.shift();
			user.tokens.push(token);
			await user.save();
			res.send({ msg: `Welcome ${user.firstname}.`, user, token });
		} catch (error) {
			console.error(error);
			res.status(500).send(error);
		}
	},
	async allOnlineUsers(req, res) {
		try {
			const users = await User.find({ online: true });
			res.send({ msg: 'Online users', users });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error.', error });
		}
	},
	async findUserById(req, res) {
		try {
			const user = await User.findOne({ _id: req.params._id });
			res.send({ msg: `User with id: ${req.params._id} was found.`, user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `The user with id: ${error.value} does not exist in the database.`, error });
		}
	},
	async findUserByName(req, res) {
		try {
			const user = await User.findOne({
				$text: { $search: req.params.username },
			});
			res.send({ msg: `User with username: ${user.username} was found.`, user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `The user with name: ${req.params.username} does not exist in the database.`, error });
		}
	},
	async logout(req, res) {
		try {
			const user = await User.findByIdAndUpdate(
				{ _id: req.params._id },
				{ $pull: { tokens: { token: req.headers.authorization } }, $set: { online: false } },
				{ new: true }
			);
			res.send({ msg: 'User logged out', user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `User not logged out properly.`, error });
		}
	},
	async getOnline(req, res) {
		try {
			const user = await User.findOne({ _id: req.params._id });
			if (!user.online) {
				user.online = true;
				await user.save();
				return res.send({ msg: `User with Id: ${req.params._id} ist online`, user });
			} else {
				user.online = false;
				await user.save();
				return res.send({ msg: `User with Id: ${req.params._id} ist offline`, user });
			}
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `User status not changed.`, error });
		}
	},
	async follow(req, res) {
		try {
			const user = await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $push: { FollowIds: { FollowId: req.params._id } } },
				{ new: true }
			).populate('FollowIds');
			const follower = await User.findByIdAndUpdate({ _id: req.params._id }, { $push: { FollowerIds: { FollowId: user._id } } });
			res.send({ msg: `You follow now ${follower.username}`, user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `User didn't follow.`, error });
		}
	},
	async unfollow(req, res) {
		try {
			const user = await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $pull: { FollowIds: { FollowId: req.params._id } } },
				{ new: true }
			).populate('FollowIds');
			const follower = await User.findByIdAndUpdate({ _id: req.params._id }, { $pull: { FollowerIds: { FollowId: user._id } } });
			res.send({ msg: `You unfollow now ${follower.username}`, user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `User didn't unfollow.`, error });
		}
	},
	async userInfo(req, res) {
		const user = await User.findById(req.user._id).populate({
			path: 'productIds',
			populate: {
				path: 'commentIds',
			},
			path: 'TagIds',
			path: 'FollowerIds',
			path: 'FollowIds',
		});
		res.send({ msg: 'User info:', user });
	},
	async recoverPassword(req, res) {
		try {
			const recoverToken = jwt.sign({ email: req.params.email }, JWT_SECRET, {
				expiresIn: '48h',
			});
			const url = 'http://localhost:3001/users/resetPassword/' + recoverToken;
			await transporter.sendMail({
				to: req.params.email,
				subject: 'Recover password',
				html: `<h3> Recover password </h3>
	  <a href="${url}">Recover password</a>
	  You have only 48 hours to change the password with these email.
	  `,
			});
			res.send({
				msg: 'A recover email was sended to your email',
			});
		} catch (error) {
			console.error(error);
		}
	},
	async resetPassword(req, res) {
		try {
			const recoverToken = req.params.recoverToken;
			const payload = jwt.verify(recoverToken,JWT_SECRET);
			await User.findOneAndUpdate({ email: payload.email }, { password: req.body.password });
			res.send({ msg: 'Password was changed' });
		} catch (error) {
			console.error(error);
		}
	},
};

module.exports = UserController;
