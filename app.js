require('dotenv').config();
const express = require('express');
const path = require ('path');

const app = express();

const mongoose = require ('mongoose');

const Book=require('./Models/book');
const bookRoutes = require('./Routes/book');
const userRoutes = require ('./Routes/user');
const { config } = require('dotenv');


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use('/api/books', bookRoutes);
app.use ('/api/auth', userRoutes);
app.use ('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;