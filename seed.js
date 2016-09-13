/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
const Products = db.model('product');
var Promise = require('sequelize').Promise;

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};

var seedProducts = function () {

    var products = [
        {
            name: 'blueberries',
            price: 100,
            quantity: 5,
            source: "Jo's Farm",
            description: 'Wild blueberries',
            imageUrl: 'http://pngimg.com/upload/banana_PNG835.png',
            category: 'fruit'
        },
        {
            name: 'bananas',
            price: 1,
            quantity: 1,
            source: "Jo's Farm",
            description: 'free-trade bananas',
            imageUrl: 'http://2vg3dte874793qqzcf8j9mn.wpengine.netdna-cdn.com/wp-content/uploads/handful-of-blueberries-1502-498x286.jpg',
            category: 'fruit'
        },
        {
            name: 'eggs',
            price: 5,
            quantity: 12,
            source: "Jo's Farm",
            description: 'free-range, grass-fed',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Egg_colours.jpg',
            category: 'dairy'
        }

    ];

    var creatingProducts = products.map(function (productObj) {
        return Products.create(productObj);
    });

    return Promise.all(creatingProducts);

};

db.sync({ force: true })
    .then(function () {
        return seedUsers();
    })
    .then(function(){
        return seedProducts();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
