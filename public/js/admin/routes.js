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




.controller('DashCtrl', ['$scope', '$timeout', '$log', '$mdToast', '$mdDialog', 'localStorageService', '$http', '$location', function ($scope, $timeout, $log, $mdToast, $mdDialog, localStorageService, $http, $location) {

    $scope.genSecretKeyFormSubmit = function (form) {
        console.log($scope.secretKey);
        $http.post('/secretKey', $scope.secretKey )
        .then(function (data, status, headers, config) {
            if (data.data.success) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(document.body)
                        .clickOutsideToClose(true)
                        .title('Toke Generated')
                        .textContent("TOKEN: "+data.data.token)
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Got it!')
                );
            } else {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('token could not be generated')
                        .position("top right")
                        .hideDelay(3000)
                );
            }
        });
    };
}])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'html/admin/dashboard.html',
            controller: 'DashCtrl'
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