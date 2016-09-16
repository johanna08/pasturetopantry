'use strict';

app.controller('ProductCtrl', function($scope, ProductFactory, $log, $sessionStorage, product) {
    $scope.product = product;

    $scope.Range = function(start, end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    if (!$sessionStorage.cart) {
        $sessionStorage.cart = [];
    }

    $scope.addToCart = function(id, quantity) {
        for (var i = 0; i < $sessionStorage.cart.length; i++) {
            if ($sessionStorage.cart[i].id === id) {
                var inCart = true;
                $sessionStorage.cart[i].quantity += quantity;
            }
        }

        if (!inCart) {
            console.log('FROM CONTROLLER', $sessionStorage.cart);
            $sessionStorage.cart.push({ id: id, quantity: quantity });
        }

        console.log($sessionStorage.cart);
    };
});
