 'use strict';
app.controller('CartCtrl', function($scope, ProductFactory, $sessionStorage, $rootScope) {

    $rootScope.$on('cartClick', function(event, data) {
        console.log("hello");
        $scope.products = data;
        console.log('PRODUCTS',$scope.products[0].name);
    });

});


app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl'
        });
});
