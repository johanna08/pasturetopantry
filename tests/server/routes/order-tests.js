var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');

var Promise = require('sequelize').Promise;

describe('Order Route', function () {

    var app, Orders, Items, Products;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        Orders = db.model('order');
        Items = db.model('items');
        Products = db.model('products');
    });

    beforeEach('Create products', function (done) {
        var product1 = {
            name: 'beef',
            price: 15,
            description: 'delish',
            quantity: 1,
            source: "Jo's Farm"
        };

        var product2 = {
            name: 'carrots',
            price: 2,
            description: 'orange!',
            quantity: 100,
            source: "Jo's Farm"
        };

        var product3 = {
            name: 'apples',
            price: 8,
            description: 'yummm',
            quantity: 10,
            source: "Jo's Farm"
        };

            return Products.bulkCreate([product1, product2, product3]).then(function (products) {
                done();
            }).catch(done);
    });

    beforeEach('Create orders', function (done) {
        var order1 = {
            status: 'Active'
        };

        var order2 = {
            status: 'Active'
        };

        var order3 = {
            status: 'Active'
        };

        return Orders.bulkCreate([order1, order2, order3]).then(function (orders) {
            done();
        }).catch(done);
    });

    beforeEach('Create items', function (done) {
        var item1 = {
            quantity: 1
        };

        var item2 = {
            quantity: 2
        };

        var item3 = {
            quantity: 3
        };

        return Items.bulkCreate([item1, item2, item3]).then(function (items) {
            var num = 1;
            return items.map(function(item){
                return item.setOrder(num)
                .then(function(item){
                  return item.setProduct(num++);
                });
            });
        }).then(function(promises){
            return Promise.all(promises);
        }).then(function(){
            done();
        })
        .catch(done);
    });

    xdescribe('get all orders by userId', function () {

        var guestAgent;

        beforeEach('Create guest agent', function () {
            guestAgent = supertest.agent(app);
        });

        it('should get a 200 response', function (done) {
            guestAgent.get('/api/order/1')
                .expect(200)
                .end(done);
        });

    });


});

