app.controller('ProductsCtrl', function($scope, $state,  Products){
    let products;
    $scope.title = 'All Products';
    $scope.main = true;

    Products.fetchAll()
    .then(function(response){
        $scope.products = response;
        products = response;
    });

    Products.getAllCategories()
    .then(function(response){
        $scope.categories = response;
    });

    $scope.displayAll = function(){
        $scope.products = products;
        $scope.title = 'All Products';
        $scope.main = true;
    }

    $scope.productsByCategory = function(id, category){
        Products.fetchByCategory(id)
        .then(function(response){
            $scope.products = response;
            $scope.title = category;
            $scope.main = false;
        });
    }
});
