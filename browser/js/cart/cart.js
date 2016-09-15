 'use strict';
app.controller('CartCtrl', function($scope, ProductFactory, $sessionStorage, $rootScope) {

    $rootScope.$on('cartClick', function(event, data) {
        $scope.products = data;
        console.log("PRODUCTS: ", $scope.products);
    });

    $scope.Range = function(start, end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.getQuantity = function(id){
    for (var i = 0; i < $sessionStorage.cart.length; i++) {
            if ($sessionStorage.cart[i].id === id) return $sessionStorage.cart[i].quantity;
        }
    }

});


app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl'
        });
});
