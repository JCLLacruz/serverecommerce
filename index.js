const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const { dbConnection } = require('./config/config.js');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
require('./crons/cleanupUsers.js');

dbConnection();

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Headers', 'authorization');
	next();
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/users', require('./routes/users.js'));
app.use('/products', require('./routes/products.js'));
app.use('/tags', require('./routes/tags.js'));
app.use('/comments', require('./routes/comments.js'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
