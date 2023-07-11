const app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'login.html',
        controller: 'loginController'
    }).when('/home', {
        templateUrl: 'home.html',
        controller: 'homeController'
    }).when('/login', {
        templateUrl: 'login.html',
        controller: 'loginController'
    }).when('/signup', {
        templateUrl: 'signup.html',
        controller: 'signupController'
    }).when('/products', {
        templateUrl: 'products.html',
        controller: 'productsController'
    }).when('/products/:id', {
        templateUrl: 'product.html',
        controller: 'productController'
    }).when('/fav', {
        templateUrl: 'fav.html',
        controller: 'favController'
    }).when('/profile', {
        templateUrl: 'profile.html',
        controller: 'profileController'
    }).when('/logout', {
        redirectTo: '/'
    }).otherwise({
        redirectTo: '/' 
    });
});

app.run(['$rootScope', 'favService', '$location', '$window', function ($rootScope, favService, $location, $window) {
    $rootScope.registered_users = [];
    $rootScope.all_products = [];
    $rootScope.auth = true;
    $rootScope.favProducts = [];
    $rootScope.user;
    $rootScope.curr_product;
    $rootScope.isAuthorized = $window.localStorage.getItem('user') != null ? true : false;
    $rootScope.sendSingleProduct = function (x) {
        $rootScope.curr_product = x;
        $location.path('/products/' + x.id);
    };
    $rootScope.addToFav = function (product) {
        favService.addFav(product);
    };
    $rootScope.removeFromFav = function (product) {
        favService.removeFromFav(product);
    };

    favService.getAllFavs(function (data) {
        $rootScope.favProducts = data;
    });

    $rootScope.isThereInFav = function (product) {
        console.log('hererer', $rootScope.favProducts);
        for(let x of $rootScope.favProducts){
            console.log(x);
            if(x.id==product.id) return true;
        }
        return false;
        // return $rootScope.favProducts.includes(product);
    };
}]);

app.controller('loginController', ['$scope', '$location', '$rootScope', '$window', 'userService', function ($scope, $location, $rootScope, $window, userService) {
    $window.localStorage.removeItem('user');
    $rootScope.isAuthorized = false;
    $rootScope.auth = true;
    $rootScope.dashboard = false;
    $scope.login_email;
    $scope.login_password;
    $scope.failure_text = "";
    userService.getAllUsers(function (data) {
        $rootScope.registered_users = data;
    });
    $scope.login = function () {
        let isgood = false;
        $rootScope.registered_users.forEach(user => {
            if (user.email == $scope.login_email && user.password == $scope.login_password) {
                $rootScope.user = user;
                isgood = true;
            }
        });
        if (!isgood) {
            $scope.failure_text = "Invalid Credentials";
            $scope.login_email = null;
            $scope.login_password = null;
        } else {
            $window.localStorage.setItem('user', JSON.stringify($rootScope.user));
            $rootScope.isAuthorized = true;
            $location.path('/home')
        }
    }
}]);


app.controller('signupController', ['$scope', 'userService', '$location', function ($scope, userService, $location) {
    $scope.reg_name;
    $scope.reg_email;
    $scope.reg_password;

    var registered_users = [];

    $scope.register = function () {
        const user = {
            name: $scope.reg_name,
            email: $scope.reg_email,
            password: $scope.reg_password
        }
        userService.addData(user);
    }
}]);

app.controller('productsController', ['$scope', '$rootScope', 'dataService', '$location', function ($scope, $rootScope, dataService, $location) {
    if(!$rootScope.isAuthorized)$location.path('/login');
    $scope.name = "dashboard";
    $rootScope.auth = false;
    $scope.category = 'all';
    dataService.getAllProducts(function (data) {
        $rootScope.all_products = data;
        $scope.dashboard_all_products = $rootScope.all_products;
    });
    $scope.sortPriceInc = function () {
        $scope.dashboard_all_products.sort(function (a, b) {
            return a.price - b.price;
        });
    }
    $scope.sortPriceDec = function () {
        $scope.dashboard_all_products.sort(function (a, b) {
            return b.price - a.price;
        });
    }
    $scope.sortRatingInc = function () {
        $scope.dashboard_all_products.sort(function (a, b) {
            return a.rating.rate - b.rating.rate;
        });
    };

    $scope.sortRatingDec = function () {
        $scope.dashboard_all_products.sort(function (a, b) {
            return b.rating.rate - a.rating.rate;
        });
    };

    $scope.findByCategory = function (category) {
        if (category == 'all') {
            $scope.dashboard_all_products = $rootScope.all_products;
        } else {
            console.log('xxx', category);
            dataService.getAllProductsByCategory(category, function (data) {
                $scope.dashboard_all_products = data;
            });
        }
    };
}]);

app.controller('homeController', ['$scope', '$rootScope', 'dataService', '$window', '$location', function ($scope, $rootScope, dataService, $window, $location) {
    if(!$rootScope.isAuthorized)$location.path('/login');
    $scope.profile_user = "";
    if($window.localStorage.getItem('user') != null){
        $scope.profile_user = JSON.parse($window.localStorage.getItem('user'));
    }
}]);


app.controller('favController', ['$scope', '$rootScope', 'favService', function ($scope, $rootScope, favService) {
    // $scope.favProducts = [];
    // favService.getAllFavs(function (data) {
    //     $scope.favProducts = data;
    // });


    // sortings
    $scope.sortPriceInc = function () {
        $rootScope.favProducts.sort(function (a, b) {
            return a.price - b.price;
        });
    }
    $scope.sortPriceDec = function () {
        $rootScope.favProducts.sort(function (a, b) {
            return b.price - a.price;
        });
    }
    $scope.sortRatingInc = function () {
        $rootScope.favProducts.sort(function (a, b) {
            return a.rating.rate - b.rating.rate;
        });
    };
    $scope.sortRatingDec = function () {
        $rootScope.favProducts.sort(function (a, b) {
            return b.rating.rate - a.rating.rate;
        });
    };
}]);

app.controller('productController', ['$scope', '$rootScope', '$routeParams', function ($scope, $rootScope, $routeParams) {
}]);


app.controller('profileController', ['$scope', '$rootScope', 'userService', '$location', '$window', function ($scope, $rootScope, userService, $location, $window) {
    if(!$rootScope.isAuthorized){
        $location.path('/login');
    }
    $scope.profile_user = JSON.parse($window.localStorage.getItem('user'));
    $scope.update_profile_user = function (user) {
        userService.updateUser(user);
    }
    if ($scope.profile_user != null) {
        userService.getUserById($scope.profile_user.id, function (data) {
            console.log('data', data);
            $window.localStorage.setItem('user', JSON.stringify(data));
            $scope.profile_user = JSON.parse($window.localStorage.getItem('user'));
        });
    }
}]);
