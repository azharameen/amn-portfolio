amn


.run(['$rootScope', 'localStorageService', '$location', '$http', function($rootScope, localStorageService, $location, $http){
    $rootScope.isAuth = {};
    $rootScope.isAuth.auth = false;

    $http.post('/auth-check')
    .then(function (data, status, headers, config) {
        if(data.data.status == "success"){
            $rootScope.isAuth.auth = true;
            $rootScope.isAuth.user = data.data.data;
        }else{}
    });

    $rootScope.$on('$routeChangeSuccess', function(event) {
        console.log('route success');
    });

    $rootScope.$on('$routeChangeStart', function(event) {
        console.log('route start');
        /*if( !localStorageService.get('usermode') ){
            $rootScope.isAuth.auth = false;
            $location.path( '/login' );
        }else{
            if( localStorageService.get('usermode') != "guest" ){
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
        }*/
    });

}])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'html/guest/home.html'
        })

        .when('/portfolio', {
            templateUrl: 'html/guest/portfolio.html'
        })

        .when('/contact', {
            templateUrl: 'html/guest/contact.html',
        })

        .when('/career', {
            templateUrl: 'html/guest/home.html',
        })

        ;

    $routeProvider.otherwise('/');
}])

;