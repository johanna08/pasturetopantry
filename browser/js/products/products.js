app.config(function ($stateProvider) {
    $stateProvider.state('products', {
        url: '/',
        templateUrl: 'js/products/products.html',
        controller: function($scope, Products){
            Products.fetchAll()
            .then(function(response){
                $scope.products = response;
            });
            console.log('Products: ', $scope.products);
        }
    });
});

app.factory('Products', function($http, $log){
    return {
        fetchAll: function(){
            return $http.get('/api/products/')
            .then(function(response){
                // console.log('Response:', response.data)
                return response.data;
            })
            .catch($log.error)
        }
    }
});
