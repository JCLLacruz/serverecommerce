require('dotenv').config();
const {MONGO_URI} = process.env;
const mongoose = require('mongoose');
const faker = require('faker');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Product = require('../models/Product');
const { dbConnection } = require('../config/config');

const MONGODB_URI = 'your_mongodb_uri_here';

dbConnection();

const seedUsers = async () => {
    const users = [];
    for (let i = 0; i < 20; i++) {
        const password = await bcrypt.hash('holahola', 10);
        const user = new User({
            username: `SecondUser${i + 1}`,
            email: faker.internet.email(),
            emailConfirmed: false,
            password: password,
            birthday: faker.date.past(30, new Date('2000-01-01')),
            role: 'user',
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            online: faker.datatype.boolean(),
            image_path: `${faker.datatype.number({min: 1000000000, max: 9999999999})}.png`,
            CommentIds: [],
            TagIds: [],
            OrderIds: [],
            FollowerIds: [],
            FollowIds: []
        });

        const savedUser = await user.save();
        users.push(savedUser);
    }
    console.log('Users seeded successfully!');
    return users;
};

const getPokemon = async (id) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching Pokémon with ID ${id}:`, error);
        return null;
    }
};

const getHighQualityImage = (id) => {
    const formattedId = String(id).padStart(3, '0');
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formattedId}.png`;
};

const seedProducts = async () => {
    const products = [];
    for (let i = 1; i <= 100; i++) {
        const pokemon = await getPokemon(i);
        if (pokemon) {
            const product = new Product({
                productName: pokemon.name,
                description: `Height: ${pokemon.height}, Weight: ${pokemon.weight}, Base Experience: ${pokemon.base_experience}`,
                image_path: getHighQualityImage(pokemon.id),
                price: pokemon.id * 0.8,
                status: 'available',
                TagIds: [],
                LikeIds: [],
                CommentIds: [],
                OrderIds: [],
            });
            const savedProduct = await product.save();
            products.push(savedProduct);
        }
    }
    console.log('Products seeded successfully!');
    return products;
};

const seedComments = async (users, products) => {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const product = products[Math.floor(Math.random() * products.length)];
        const comment = new Comment({
            body: faker.lorem.sentences(2),
            ProductId: product._id,
            UserId: user._id,
            LikeIds: [],
        });
        const savedComment = await comment.save();

        user.CommentIds.push(savedComment._id);
        await user.save();

        product.CommentIds.push(savedComment._id);
        await product.save();
    }
    console.log('Comments seeded successfully!');
};

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        const users = await seedUsers();
        const products = await seedProducts();
        await seedComments(users, products);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

seedDatabase();
