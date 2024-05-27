const request = require('supertest');
const app = require('../index.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;
const User = require('../models/User.js');

describe('Endpoints testing', () => {
	afterAll(async () => {
		return await User.deleteMany();
	});

	const user = {
		username: 'testUser',
		email: '19lacruz88@gmail.com',
		password: 'holahola',
		birthday: '1988-06-15',
		firstname: 'FirstNameTest',
		lastname: 'LastNameTest',
	};
	let _id;
	let token = [];

	test('register', async () => {
		const res = await request(app)
			.post('/users/')
			.field('username', user.username)
			.field('email', user.email)
			.field('password', user.password)
			.field('birthday', user.birthday)
			.field('firstname', user.firstname)
			.field('lastname', user.lastname)
			.attach('profileImg', Buffer.from('profileImg'), 'avatar.png')
			.expect(201);
		const {
			_id,
			emailConfirmed,
			CommentIds,
			birthday,
			role,
			FollowIds,
			FollowerIds,
			TagIds,
			ProductIds,
			createdAt,
			online,
			updatedAt,
			image_path,
			__v,
		} = res.body.user;
		const { password, ...userWithoutPassword } = user;
		const testUser = {
			...userWithoutPassword,
			_id,
			emailConfirmed,
			CommentIds,
			birthday,
			role,
			online,
			TagIds,
			FollowIds,
			FollowerIds,
			ProductIds,
			createdAt,
			updatedAt,
			image_path,
		};
		emailToken = res._body.emailToken;
		const dataBaseUser = res.body.user;
		expect(dataBaseUser).toEqual(testUser);
	});
	test('confirmUser', async() => {
		const emailToken = jwt.sign({ email: user.email }, JWT_SECRET);
		const res = await request(app).get('/users/confirm/' + emailToken).expect(201);
		expect(res.body.msg).toBe('User email was confirmed. User created.');
	});
	test('login', async () => {
		const res = await request(app).post('/users/login').send({ email: user.email, password: user.password }).expect(200);
		token = res._body.token;
		_id = res._body.user._id;
		expect(res.body.msg).toBe(`Welcome ${user.firstname}.`);
	});
	test('allOnlineUsers', async () => {
		const res = await request(app).get('/users/onlineusers').expect(200);
		expect(res.body.msg).toBe('Online users');
	});
	test('userFindById', async () => {
		const res = await request(app).get(`/users/id/${_id}`).expect(200);
		expect(res.body.msg).toBe(`User with id: ${_id} was found.`);
	});
	test('getOnline', async () => {
		const res = await request(app).put(`/users/getonline/${_id}`).set({ Authorization: token }).expect(200);
		expect(res.body.msg).toBe(`User with Id: ${_id} ist online`);
	});
	test('findUserByName', async ()=> {
		const res = await request(app).get(`/users/name/${user.username}`).expect(200);
		expect(res.body.msg).toBe(`User with username: ${user.username} was found.`)
	});
	test('follow', async () => {
		const res = await request(app).put(`/users/follow/${_id}`).set({ Authorization: token }).expect(200);
		expect(res.body.msg).toBe(`You follow now ${user.username}`);
	});
	test('unfollow', async () => {
		const res = await request(app).put(`/users/unfollow/${_id}`).set({ Authorization: token }).expect(200);
		expect(res.body.msg).toBe(`You unfollow now ${user.username}`);
	});
	// test('userInfo', async () => {
	// 	const res = await request(app).get(`/users/userinfo`).set({ Authorization: token }).expect(200);
	// 	expect(res.body.msg).toBe('User info:');
	// });
	test('recoverPassword', async() => {
		
		
		const res = await request(app).get(`/users/recoverPassword/${user.email}`).expect(200);
		expect(res.body.msg).toBe('A recover email was sended to your email');
	});
	test('resetPassword', async() => {
		const recoverToken = jwt.sign({ email: user.email }, JWT_SECRET);
		const res = await request(app).put(`/users/resetPassword/${recoverToken}`)
		.expect(200);
		expect(res.body.msg).toBe('Password was changed');
	});
	test('logout', async () => {
		const res = await request(app).delete(`/users/logout/${_id}`).set({ Authorization: token }).expect(200);
		expect(res.body.msg).toBe('User logged out');
	});
});
