app.service('userService', ['$http', function($http){
    this.getAllUsers = function(cb){
        $http({
            method:'GET',
            url:('http://localhost:3000/users')
        }).then(function(res){console.log(res.data); cb(res.data)},function(err){console.log(err);})
    }
    this.addData = function(user){
        console.log('here service', user);
        $http({
            method:'POST',
            url:('http://localhost:3000/users'),
            data:user
        }).then(function(res){console.log('hi service'); console.log('resss',res); cb(res)},function(err){console.log('errrrrrr',err);})
    }
}]);

app.service('dataService', ['$http', function($http){
    this.getAllProducts = function(cb){
        $http({
            method:'GET',
            url:('https://fakestoreapi.com/products')
        }).then(function(res){console.log(res.data); cb(res.data)},function(err){console.log(err);})
    }
    this.getAllProductsByCategory = function(category, cb){
        console.log(category);
        console.log(cb);
        $http({
            method:'GET',
            url:('https://fakestoreapi.com/products/category/'+category)
        }).then(function(res){console.log(res.data); cb(res.data)},function(err){console.log(err);})
    }
}]);

app.service('favService', ['$http', function($http){
    this.getAllFavs = function(cb){
        $http({
            method:'GET',
            url:(`http://localhost:3000/favs`)
        }).then(function(res){cb(res.data)},function(err){console.log(err);})
    }
    this.addFav = function(product){
        $http({
            method:'POST',
            url:(`http://localhost:3000/favs`),
            data:product
        }).then(function(res){console.log(res);},function(err){console.log('errrrrrr',err);})
    }
}]);

