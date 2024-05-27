const mongoose = require('mongoose');
const faker = require('faker');
const User = require('../models/User.js');
const Comment = require('../models/Comment.js');
const bcrypt = require('bcryptjs');
const { dbConnection } = require('../config/config.js');
const { default: axios } = require('axios');
const Product = require('../models/Product.js');


dbConnection();

const seedUsers = async () => {
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

        await user.save();

        const comment = new Comment({
            
        })
    }
    const seedProducts = async () => {
        const pokemons = await axios.get('https://pokeapi.co/api/v2/pokemon/');
        
        for (let i = 0; i < 20; i++) {
            const password = await bcrypt.hash('holahola', 10);
            const product = new Product({
                
            });
    
            await user.save();
    
            const comment = new Comment({
                
            })
        }

    mongoose.connection.close();
    console.log("Database seeded!");
};

seedUsers().catch(err => console.log(err));