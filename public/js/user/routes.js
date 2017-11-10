amn


.run(['$rootScope', 'localStorageService', '$location', function($rootScope, localStorageService, $location){

    $rootScope.$on('$routeChangeStart', function(event) {
        console.log($location.path());
        if( !localStorageService.get('usermode') ){
            $location.path( '/login' );
        }else{
            if( localStorageService.get('usermode') != "user" ){
                window.location.href = '/' + localStorageService.get('usermode') ;
            }else{
                $location.path();
            }
        }
        console.time('digest');
    });

}])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'html/guest/home.html'
        })

        .when('/about', {
            templateUrl: 'html/guest/about.html'
        })

        .when('/career', {
            templateUrl: 'html/login.html'
        })

        .when('/contact', {
            templateUrl: 'html/guest/contact.html'
        })

        .when('/login', {
            templateUrl: 'html/login.html'
        })

        ;

    $routeProvider.otherwise('/');
}])

;