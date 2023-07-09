const app = angular.module('app',['ngRoute']);


app.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl:'login.html',
        controller: 'loginController'
    }).when('/home',{
        templateUrl:'home.html',
        controller: 'homeController'    
    }).when('/login',{
        templateUrl:'login.html',
        controller: 'loginController'
    }).when('/signup',{
        templateUrl:'signup.html',
        controller: 'signupController'
    }).when('/products',{
        templateUrl:'products.html',
        controller: 'productsController'
    }).when('/products/:id',{
        templateUrl:'product.html',
        controller: 'productController'
    }).when('/fav',{
        templateUrl:'fav.html',
        controller: 'favController'
    }).when('/logout',{
        redirectTo: '/'
    }).otherwise({
        redirectTo: '/'
    });
});


app.run(['$rootScope', 'favService', '$location', function($rootScope, favService, $location){
    $rootScope.registered_users=[];
    $rootScope.all_products=[];
    $rootScope.auth=true;
    $rootScope.favProducts=[];
    $rootScope.user;
    $rootScope.curr_product;
    $rootScope.sendSingleProduct = function(x){
        $rootScope.curr_product=x;
        $location.path('/products/'+x.id);
    };
    $rootScope.addToFav = function(product){
        console.log('handser', product);
        favService.addFav(product);
    };
}]);

app.controller('loginController', ['$scope', '$location', '$rootScope', 'userService', function($scope, $location, $rootScope, userService){
    $rootScope.auth=true;
    $rootScope.dashboard=false;
    $scope.login_email;
    $scope.login_password;
    $scope.failure_text="";
    userService.getAllUsers(function(data){
        $rootScope.registered_users=data;
        console.log('reggg', $rootScope.registered_users);
    });
    $scope.login = function(){
        // const email = $scope.login_email;
        // const pass = $scope.login_password;
        // console.log($scope.registered_users);
        console.log('email', $scope.login_email, $scope.login_password);
        let isgood = false;
        console.log('hey', $rootScope.registered_users);
        $rootScope.registered_users.forEach(user => {
            if(user.email ==  $scope.login_email && user.password == $scope.login_password){
                $rootScope.user = user;
                isgood=true;
            }
        });

        if(!isgood){
            // alert('failure');
            $scope.failure_text="Invalid Credentials";
            $scope.login_email=null;
            $scope.login_password=null;
        }else{
            $location.path('/home')
            // alert('success');
        }
    }
}]);

app.controller('signupController', ['$scope', 'userService', '$location', function($scope, userService, $location){
    $scope.reg_name;
    $scope.reg_email;
    $scope.reg_password;
    
    var registered_users = [];
    
    $scope.register = function(){
        // event.preventDefault();
        const user = {
            name: $scope.reg_name,
            email: $scope.reg_email,
            password: $scope.reg_password
        }
        console.log('hi', user);
        userService.addData(user);
        // console.log(registered_users);
        // $location.path('/login')
    }
}]);

app.controller('productsController', ['$scope', '$rootScope', 'dataService', '$location',function($scope, $rootScope, dataService, $location){
    $scope.name="dashboard";
    $rootScope.auth=false;
    $scope.category = 'all';
    dataService.getAllProducts(function(data){
        console.log('hiiiiiiiiii');
        $rootScope.all_products=data;
        $scope.dashboard_all_products = $rootScope.all_products;
    });
    $scope.sortPriceInc = function(){
        $scope.dashboard_all_products.sort(function(a,b){
            return a.price - b.price;
        });
    }
    $scope.sortPriceDec = function(){
        $scope.dashboard_all_products.sort(function(a,b){
            return b.price - a.price;
        });
    }
    $scope.sortRatingInc = function(){
        $scope.dashboard_all_products.sort(function(a,b){
            return a.rating.rate - b.rating.rate;
        });
    };
    $scope.sortRatingDec = function(){
        $scope.dashboard_all_products.sort(function(a,b){
            return b.rating.rate - a.rating.rate;
        });
    };
    $scope.findByCategory = function(category){
        if(category=='all'){
            $scope.dashboard_all_products = $rootScope.all_products;
        }else{
            console.log('xxx', category);
            dataService.getAllProductsByCategory(category, function(data){
                $scope.dashboard_all_products=data;
            });
        }
    };
}]);

app.controller('homeController', ['$scope', '$rootScope', 'dataService', function($scope, $rootScope, dataService){
    
}]);


app.controller('favController', ['$scope', '$rootScope', 'favService', function($scope, $rootScope, favService){
    $scope.favProducts = [];
    favService.getAllFavs(function(data){
        $scope.favProducts=data;
        console.log('datauta', data);
    });


    // sortings
    $scope.sortPriceInc = function(){
        $scope.favProducts.sort(function(a,b){
            return a.price - b.price;
        });
    }
    $scope.sortPriceDec = function(){
        $scope.favProducts.sort(function(a,b){
            return b.price - a.price;
        });
    }
    $scope.sortRatingInc = function(){
        $scope.favProducts.sort(function(a,b){
            return a.rating.rate - b.rating.rate;
        });
    };
    $scope.sortRatingDec = function(){
        $scope.favProducts.sort(function(a,b){
            return b.rating.rate - a.rating.rate;
        });
    };
}]);

app.controller('productController', ['$scope', '$rootScope', '$routeParams', function($scope, $rootScope, $routeParams){
    console.log('id', $routeParams.id);
}]);