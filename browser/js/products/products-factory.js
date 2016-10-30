app.factory('Products', function($http, $log){
    return {
        fetchAll: function(){
            return $http.get('/api/products/')
            .then(function(response){
                return response.data;
            })
        },

        getAllCategories: function(){
            return $http.get('/api/categories/')
            .then(function(response){
                return response.data;
            })
        },

        fetchByCategory: function(id){
            return $http.get('/api/categories/' + id)
            .then(function(response){
                return response.data;
            })
        }
    }
});
