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
            return $http.get('/api/categories/')
            .then(function(response){
                return response.data;
            })
            .catch($log.error)
        },

        fetchByCategory: function(id){
            return $http.get('/api/categories/' + id)
            .then(function(response){
                return response.data;
            })
            .catch($log.error)
        }
    }
});
