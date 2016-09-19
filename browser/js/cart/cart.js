 'use strict';
app.controller('CartCtrl', function($scope, ProductFactory, $sessionStorage, products) {

    $scope.products = products;

    $scope.Range = function(start, end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.getQuantity = function(id){
    for (let i = 0; i < $sessionStorage.cart.length; i++) {
            if ($sessionStorage.cart[i].id === id) return $sessionStorage.cart[i].quantity;
        }
    };

    $scope.total = function() {
      let total = 0;

      for (let i = 0; i < $scope.products.length; i++) {
        total += $scope.products[i].totalCost;
      }

      return total;
    };

});


app.config(function($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl',
        resolve: {
            products: function($sessionStorage, ProductFactory) {
                let products = [];
                if ($sessionStorage.cart) {
                    for (var i = 0; i < $sessionStorage.cart.length; i++) {
                        ProductFactory.getProduct($sessionStorage.cart[i].id)
                            .then(function(product) {
                                for (var i = 0; i < products.length; i++) {
                                    if (products[i].id === product.id) {
                                        var inCart = true;
                                    }
                                }
                                if (!inCart) {
                                    products.push(product);
                                }
                            });
                    }
                }
                return products;
            }
        }
    });
});
