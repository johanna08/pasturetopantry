'use strict';

app.controller('ProductCtrl', function($scope, ProductFactory, $log, product, Session, $sessionStorage) {
    $scope.product = product;

    $scope.Range = function(start, end) {
        var result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    //move this logic to backwards
    if (!$sessionStorage.cart) {
        Session.resetSessionCart();
    }

    $scope.addToCart = ProductFactory.addToCart;
});
