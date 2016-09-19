const chalk = require('chalk');
const db = require('./server/db');
const User = db.model('user');
const Products = db.model('product');
const Categories = db.model('category');
const Orders = db.model('order');
const Items = db.model('item');
const Promise = require('sequelize').Promise;

const randOrder = function(){
    return Math.ceil(Math.random() * 4);
}

const randProduct = function(){
    return Math.ceil(Math.random() * 26);
}

const seedUsers = function () {
    const users = [
        {
            email: 'hermione@hogwarts.com',
            password: '123'
        },
        {
            email: 'harry@hogwarts.com',
            password: '123'
        },
        {
            email: 'ron@hogwarts.com',
            password: '123'
        }
    ];

    const creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};

const seedProducts = function () {

    const products = [
        //fruits
        {
            name: 'Honeycrisp Apples',
            price: 350,
            quantity: 80,
            source: "Galen's Farm",
            description: 'Delicious, fresh-picked Honeycrisp apples from, sold by the bag.',
            imageUrl: '/img/apples.jpg'
        },
        {
            name: 'Pears',
            price: 395,
            quantity: 45,
            source: "Ingrid's Farm",
            description: 'Sweet, juicy pairs plucked fresh from the orchard.',
            imageUrl: '/img/pears.jpg'
        },
        {
            name: 'Raspberries',
            price: 655,
            quantity: 100,
            source: "Ingrid's Farm",
            description: 'Stock up on raspberries, they are objectively the yummiest berry.',
            imageUrl: '/img/raspberries.jpg'
        },
        {
            name: 'Strawberries',
            price: 645,
            quantity: 108,
            source: "Brook's Farm",
            description: 'Red, ripe, ready for dipping in chocolate.',
            imageUrl: '/img/strawberries.jpg'
        },
        {
            name: 'Tomatoes',
            price: 195,
            quantity: 88,
            source: "Brook's Farm",
            description: 'The juciest tomatoes in the world, according to Forbes Best Tomatoes rankings.',
            imageUrl: '/img/tomatoes.jpg'
        },
        //vegetables
        {
            name: 'Arugula',
            price: 235,
            quantity: 76,
            source: "Galen's Farm",
            description: 'Rich, flavorful, organic arugala packed with nutrients.',
            imageUrl: '/img/arugula.jpg'
        },
        {
            name: 'Cabbage',
            price: 160,
            quantity: 125,
            source: "Galen's Farm",
            description: 'Home-grown cabbage, perfect for stews, slaws and salads.',
            imageUrl: '/img/cabbage.jpg'
        },
        {
            name: 'Eggplants',
            price: 320,
            quantity: 99,
            source: "Jo's Farm",
            description: 'Ooey, gooey eggplant fresh off the vine.',
            imageUrl: '/img/eggplants-in-basket.jpg'
        },
        {
            name: 'Green Bell Pepper',
            price: 305,
            quantity: 157,
            source: "Jo's Farm",
            description: 'Our green peppers are bursting with flavor. Try them with hummus!',
            imageUrl: '/img/green-bell-pepper.jpg'
        },
        {
            name: 'Kale',
            price: 220,
            quantity: 157,
            source: "Johanna's Farm",
            description: 'If the color green had a taste, it would be the taste of our fresh-picked, organic kale.',
            imageUrl: '/img/kale-bundle.jpg'
        },
        {
            name: 'Rainbow Chard',
            price: 455,
            quantity: 68,
            source: "Ingrid's Farm",
            description: 'Tired of spinach? Impress your friends with rainbow chard.',
            imageUrl: '/img/rainbow-chard.jpg'
        },
        {
            name: 'Red Bell Peppers',
            price: 295,
            quantity: 88,
            source: "Ingrid's Farm",
            description: 'At our farm, we only grow red bell peppers, because they are the best bell peppers.',
            imageUrl: '/img/red-bell-pepper.jpg'
        },
        {
            name: 'Romaine Lettuce',
            price: 375,
            quantity: 708,
            source: "Ingrid's Farm",
            description: 'Make the best salad of your life with our organic, fresh romaine lettuce.',
            imageUrl: '/img/romaine-lettuce.jpg'
        },
        {
            name: 'Spinach',
            price: 234,
            quantity: 678,
            source: "Brook's Farm",
            description: 'Packed with nutrients and organically grown -- what more could you want?',
            imageUrl: '/img/pork-chops.jpg'
        },
        {
            name: 'Zucchini',
            price: 245,
            quantity: 38,
            source: "Brook's Farm",
            description: 'As yummy a a zucchini can be. Maybe make a disappointing muffin out of it.',
            imageUrl: '/img/zucchini.jpg'
        },
        //meats
        {
            name: 'Chicken Breasts',
            price: 850,
            quantity: 55,
            source: "Jo's Farm",
            description: 'Boneless, skinless, made from chickens so happy you can taste it.',
            imageUrl: '/img/chicken-breasts.jpg'
        },
        {
            name: 'Ground Beef',
            price: 520,
            quantity: 185,
            source: "Johanna's Farm",
            description: 'Get ready for the best burgers of your life with this hearty, all-natural ground beef.',
            imageUrl: '/img/ground-beef.jpg'
        },
        {
            name: 'Italian Sausage',
            price: 679,
            quantity: 19,
            source: "Johanna's Farm",
            description: 'Our original recipe made from fresh, organic pork and our secret spice blend.',
            imageUrl: '/img/italian-sausage.jpg'
        },
        {
            name: 'Pork Chops',
            price: 1095,
            quantity: 88,
            source: "Johanna's Farm",
            description: 'Savory, rich pork chops made from our organically-fed pigs.',
            imageUrl: '/img/pork-chops.jpg'
        },
        {
            name: 'Lamb Chops',
            price: 1295,
            quantity: 58,
            source: "Johanna's Farm",
            description: 'Savory, rich lamb chops made from our organically-fed lamb.',
            imageUrl: '/img/lamb-chops.jpg'
        },
        {
            name: 'Pork Bones',
            price: 15,
            quantity: 2000,
            source: "Ingrid's Farm",
            description: 'Make your soups the hard way with our marrowy bones. Waste-not, want not.',
            imageUrl: '/img/round-soup-bones.jpg'
        },
        {
            name: 'Steak',
            price: 1245,
            quantity: 78,
            source: "Brook's Farm",
            description: 'So fresh you can almost hear it mooing. A true grill master goes for our steaks.',
            imageUrl: '/img/steak.jpg'
        },
        {
            name: 'Whole Chicken',
            price: 840,
            quantity: 70,
            source: "Brook's Farm",
            description: 'The most cost-effective way to chicken.',
            imageUrl: '/img/whole-chicken.jpg'
        },
        //dairy
        {
            name: 'Greek Yogurt',
            price: 425,
            quantity: 705,
            source: "Jo's Farm",
            description: 'Rich and creamy yogurt from  our very own grass-fed cows.',
            imageUrl: '/img/greek-yogurt.jpg'
        },
        {
            name: 'Maasdam Cheese',
            price: 895,
            quantity: 79,
            source: "Ingrid's Farm",
            description: 'Get lost in the holes of our dry-aged Maasdam cheese.',
            imageUrl: '/img/maasdam-cheese.jpg'
        },
        {
            name: 'Whole Milk',
            price: 205,
            quantity: 808,
            source: "Ingrid's Farm",
            description: 'Rich, creamy milk from our grass-fed cows.',
            imageUrl: '/img/milk-jar.jpg'
        }

    ];

    const creatingProducts = products.map(function (productObj) {
        return Products.create(productObj);
    });

    return Promise.all(creatingProducts);

};

const seedCategories = function () {

    const categories = [
        {
            type_name: 'fruit',
        },
        {
            type_name: 'dairy',
        },
        {
            type_name: 'vegetables',
        },
        {
            type_name: 'meat',
        }

    ];

    const creatingCategories = categories.map(function (categoryObj) {
        return Categories.create(categoryObj);
    });

    return Promise.all(creatingCategories);

};


const seedOrders = function () {

    const orders = [
        {
            status: 'Active',
        },
        {
            status: 'Active',
        },
        {
            status: 'Active',
        },
        {
            status: 'Complete',
        }

    ];

    const creatingOrders = orders.map(function (orderObj) {
        return Orders.create(orderObj);
    });

    return Promise.all(creatingOrders);

};

const seedItems = function () {

    const items = [
        {
            quantity: 2,
        },
        {
            quantity: 1,
        },
        {
            quantity: 3,
        },
        {
            quantity: 5,
        },
        {
            quantity: 7,
        },
        {
            quantity: 2,
        },
        {
            quantity: 9,
        },
        {
            quantity: 4,
        },
        {
            quantity: 6,
        },
        {
            quantity: 1,
        },
        {
            quantity: 8,
        },
        {
            quantity: 7,
        }

    ];

    const creatingItems = items.map(function (itemObj) {
        return Items.create(itemObj);
    });

    return Promise.all(creatingItems);

};

db.sync({ force: true })
    .then(function () {
        return seedUsers();
    })
    .then(function(){
        return seedProducts();
    })
    .then(function(){
        return seedCategories();
    })
    .then(function(){
        return seedOrders();
    })
    .then(function(){
        return seedItems();
    })
    .then(function(){
        return Products.findAll();
    })
    .then(function(products){
        return products.map(function(product, idx){
            if (idx < 5) return product.setCategories([1]);
            else if (idx < 17) return product.setCategories([3]);
            else if (idx < 23) return product.setCategories([4]);
            return  product.setCategories([2]);
        })
    })
    .then(function(promises){
        return Promise.all(promises);
    })
    //
    .then(function(){
        return User.findAll();
    })
    .then(function(users){
        return users.map(function(user){
            if (user.id == 1) return user.setOrders([1]);
            else if (user.id == 2) return user.setOrders([2]);
            else return  user.setOrders([3, 4]);
        })
    })
    .then(function(promises){
        return Promise.all(promises);
    })
    .then(function(){
        return Items.findAll();
    })
    .then(function(items){
        return items.map(function(item){
            return  Promise.all([item.setOrder(randOrder()), item.setProduct(randProduct())]);
        });
    })
    .then(function(promises){
        return Promise.all(promises);
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
