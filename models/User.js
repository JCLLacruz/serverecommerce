const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: [true, 'Username are required'], unique: true },
		email: { type: String, required: [true, 'Username are required'], unique: true },
		emailConfirmed: Boolean,
		password: { type: String, required: true },
		birthday: { type: Date, required: true },
		role: String,
		firstname: { type: String, required: [true, 'Firstname are required'] },
		lastname: { type: String, required: [true, 'Lastname are required'] },
		location: String,
		role: String,
		online: Boolean,
		image_path: String,
		OrderIds: [
			{
				OrderId: { type: ObjectId, ref: 'Order' },
			},
		],
		FollowerIds: [{ FollowerId: { type: ObjectId, ref: 'User' } }],
		FollowIds: [{ FollowId: { type: ObjectId, ref: 'User' } }],
		CommentIds: [{
		type: ObjectId,
		ref: 'Comment'
		}],
		tokens: [],
	},
	{ timestamps: true }
);

UserSchema.index({username: 'text'});

UserSchema.methods.toJSON = function () {
	const user = this._doc;
	delete user.tokens;
	delete user.password;
	delete user.__v;
	return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
