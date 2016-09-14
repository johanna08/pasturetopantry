// Instantiate all models
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');

describe('Products Route', function () {

    var app, Products, Categories;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        Products = db.model('product');
        Categories = db.model('category');
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

        beforeEach('Create categories', function (done) {
        var cat1 = {
            type_name: 'meat'
        };

        var cat2 = {
            type_name: 'vegetables'
        };

        var cat3 = {
            type_name: 'fruit'
        };

            return Categories.bulkCreate([cat1, cat2, cat3]).then(function (products) {
                done();
            }).catch(done);
        });

    describe('Get all products', function () {

        var guestAgent;

        beforeEach('Create guest agent', function () {
            guestAgent = supertest.agent(app);
        });

        it('should get a 200 response', function (done) {
            guestAgent.get('/api/products/')
                .expect(200)
                .end(done);
        });

        it('returned all of the products', function (done) {
            guestAgent.get('/api/products/').end(function (err, response) {
                if (err) return done(err);
                expect(response.body).to.be.an('array');
                expect(response.body).to.have.length(3);
                done();
            });
        });
    });

    describe('Get one product', function () {

        var guestAgent;

        beforeEach('Create guest agent', function () {
            guestAgent = supertest.agent(app);
        });

        it('should get with 200 response and with an object as the body', function (done) {
            guestAgent.get('/api/products/item/1').expect(200).end(function (err, response) {
                if (err) return done(err);
                expect(response.body).to.be.an('object');
                expect(response.body.name).to.be.equal('beef');
                done();
            });
        });

    });

    describe('Get all categories', function () {

        var guestAgent;

        beforeEach('Create guest agent', function () {
            guestAgent = supertest.agent(app);
        });

        it('should get with 200 response and with an array as the body', function (done) {
            guestAgent.get('/api/products/allcategories').expect(200).end(function (err, response) {
                if (err) return done(err);
                expect(response.body).to.be.an('array');
                expect(response.body).to.have.length(3);
                done();
            });
        });

    });

});
