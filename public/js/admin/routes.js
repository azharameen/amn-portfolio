amn


.run(['$rootScope', 'localStorageService', '$location', '$http', function($rootScope, localStorageService, $location, $http){
    $rootScope.isAuth = {};
    $rootScope.isAuth.auth = false;

    $http.post('/auth-check')
    .then(function (data, status, headers, config) {
        if(data.data.status == "success"){
            if(data.data.data.usermode == "admin"){
                $rootScope.isAuth.auth = true;
                $rootScope.isAuth.user = data.data.data;
            }else{
                $rootScope.isAuth.auth = false;
                $rootScope.isAuth.user = {};
                window.location.href = "./" + data.data.data.usermode ;
            }
        }else{
            localStorageService.clearAll();
            $location.path("/login");
        }
    });

    $rootScope.$on('$routeChangeSuccess', function(event) {
        console.log('route success');
    });

    $rootScope.$on('$routeChangeStart', function(event) {
        console.log('route start');
        if( !localStorageService.get('usermode') ){
            $rootScope.isAuth.auth = false;
            $location.path( '/login' );
        }else{
            if( localStorageService.get('usermode') != "admin" ){
                $rootScope.isAuth.auth = false;
                $location.path( '/login' );
            }else{
                $rootScope.isAuth.auth = true;
                if( $location.path() != "/login" ){
                    $location.path()
                }else{
                    $location.path("/");
                }
            }
        }
    });

}])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'html/admin/dashboard.html'
        })

        .when('/view-users', {
            templateUrl: 'html/admin/view-users.html'
        })

        .when('/add-users', {
            templateUrl: 'html/admin/add-users.html'
        })

        .when('/view-shops', {
            templateUrl: 'html/admin/view-shops.html'
        })

        .when('/add-shops', {
            templateUrl: 'html/admin/add-shops.html'
        })

        .when('/view-ads', {
            templateUrl: 'html/admin/view-ads.html'
        })

        .when('/add-ads', {
            templateUrl: 'html/admin/add-ads.html'
        })

        .when('/login', {
            templateUrl: 'html/login.html',
            controller: 'AuthCtrl'
        })

        ;

    $routeProvider.otherwise('/');
}])

;