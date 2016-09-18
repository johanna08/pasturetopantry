 'use strict';
app.controller('CartCtrl', function($scope, ProductFactory, $sessionStorage, products, CartFactory, $rootScope, AuthService, $log) {

    $scope.products = products;

    $scope.Range = function(start, end) {
        var result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.getQuantity = function(id){
    for (let i = 0; i < $sessionStorage.cart.length; i++) {
            if ($sessionStorage.cart[i].id === id) return $sessionStorage.cart[i].quantity;
        }
    }
});


app.config(function($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl',
        resolve: {
            products: function($sessionStorage, ProductFactory) {
                let products = [];
                //sets up an array of promises that gets each item's product info on $sessionStorage.cart from db
                //then we add each item to products array, which will be accessed on the scope to build cart
                //
                let sessionCartProducts = $sessionStorage.cart.map(function(cartItem) {
                    return ProductFactory.getProduct(cartItem.id)
                    .then(function(product){
                        let productsIds = products.map(item => item.id);
                        if (!productsIds.includes(product.id)) products.push(product);
                    });
                });

                Promise.all(sessionCartProducts);
                return products;

                // let products = [];
                // if ($sessionStorage.cart) {
                //     console.log('what is this session storage before cart resolve: ', $sessionStorage.cart);
                //     for (let item of $sessionStorage.cart) {
                //         ProductFactory.getProduct(item.id)
                //             .then(function(product) {
                //                 for (let addedItem of products) {
                //                     if (addedItem.id === product.id) {
                //                         var inCart = true;
                //                     }
                //                     var inCart = false;
                //                 }
                //                 if (!inCart) {
                //                     products.push(product);
                //                 }
                //             });
                //     }
                // }
                // console.log('after resolve, what is products?', products);
                // console.log('after resolve, what is session storage: ', $sessionStorage.cart);
                // return products;
            }
        }
    });
});

