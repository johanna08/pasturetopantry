 'use strict';
app.controller('CartCtrl', function($scope, ProductFactory, $sessionStorage, products, Session, CartFactory, $state) {

    $scope.products = products;
    var sessionUser = CartFactory.getSessionUser();

    $scope.Range = function(start, end) {
        var result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.getQuantity = function(id){
    for (let item of $sessionStorage.cart) {
            if (item.id === id) return item.quantity;
        }
    };

    $scope.clearCart = function() {
        Session.resetSessionCart();

        if (sessionUser) CartFactory.deleteAll(sessionUser)
        //I set this up in fsa file in Session service, just resets cart to empty array
    }

    $scope.total = function() {
      var total = 0;

      for (var i = 0; i < $scope.products.length; i++) {
        total += $scope.products[i].totalCost;
      }

      return total;
    };

    $scope.deleteOne = function(productId) {
        let ItemIdxInSession = $sessionStorage.cart.map(items => items.id).indexOf(productId)
        $sessionStorage.cart.splice(ItemIdxInSession, 1);

        if (sessionUser) {
            CartFactory.deleteOne(sessionUser, productId)
            .then(function(){
                $state.go('cart');
            })
        }
    };

    //run sync&merge from cart factory
    //check quantities from form and update before running syncSession
    $scope.updateCart = function() {
        console.log($scope.quantity);
        if (sessionUser) CartFactory.syncSessionCartToDb();
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
                //an array of promises that both gets a product from the db and pushes it to products array
                let sessionCartProducts = $sessionStorage.cart.map(function(cartItem) {
                    return ProductFactory.getProduct(cartItem.id)
                    .then(function(product){
                        let productsIds = products.map(item => item.id);
                        if (!productsIds.includes(product.id)) products.push(product);
                    });
                });
                //make sure the above promises are all resolved before returning the products array
                //avoids returning products before everything inside sessionCartProducts has been completed asynchcroniously (spelled wrong)
                Promise.all(sessionCartProducts);
                return products;
            }
        }
    });
});
