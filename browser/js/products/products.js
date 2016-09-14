app.config(function ($stateProvider) {
    $stateProvider.state('products', {
        url: '/',
        templateUrl: 'js/products/products.html',
        controller: function($scope, Products){
            Products.fetchAll()
            .then(function(response){
                $scope.products = response;
            });

            Products.getAllCategories()
            .then(function(response){
                $scope.categories = response;
            });

            $scope.productsByCategory = function(id){
                Products.fetchByCategory(id)
                .then(function(response){
                    $scope.products = response;
                })
            }
        }
    });
});

app.factory('Products', function($http, $log){
    return {
        fetchAll: function(){
            return $http.get('/api/products/')
            .then(function(response){
                return response.data;
            })
            .catch($log.error)
        },

        getAllCategories: function(){
            return $http.get('/api/products/allcategories')
            .then(function(response){
                return response.data;
            })
            .catch($log.error)
        },

        fetchByCategory: function(id){
            return $http.get('/api/products/categories/' + id)
            .then(function(response){
                return response.data;
            })
            .catch($log.error)
        }
    }
});
