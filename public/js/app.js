/**
*  Module
*
* Description
*/
var amn = angular.module('amnOffers', ['ngAnimate', 'ngRoute', 'ngMaterial', 'ngMessages', 'ngAria', 'LocalStorageModule', 'ngMap', 'angularLoad', 'ngDesktopNotification', 'ngSanitize'])

.factory('socket', function ($rootScope, localStorageService) {
    var socket = io.connect('', {
        'query' : 'token=' + localStorageService.get('token')
    });
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
})


.directive('siteHeader', function () {
    return {
        restrict: 'E',
        template: `
            <md-button class="md-icon-button" aria-label="Back" >
                <md-tooltip>Click to go Back</md-tooltip>
                <md-icon class="material-icon">keyboard_arrow_left</md-icon>
            </md-button>
            <md-button class="md-icon-button" aria-label="Back" >
                <md-tooltip>Click to go Forward</md-tooltip>
                <md-icon class="material-icon">keyboard_arrow_right</md-icon>
            </md-button>
            `,
        scope: {
            back: '@back',
            forward: '@forward',
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });
            $(element[1]).on('click', function() {
                history.forward();
                scope.$apply();
            });
        }
    };
})


.directive('pagination', function() {
    return {
        restrict: 'E',
        template: `
                <md-card-actions ng-show="pager.totalItems > 10">
                    <md-card-icon-actions layout="row" layout-align="center center" ng-if="pager.pages.length">
                    <md-button class="md-fab md-mini" ng-disabled="pager.currentPage === 1" ng-click="setPage(1)" aria-label="First"> «« </md-button>
                    <md-button class="md-fab md-mini" ng-disabled="pager.currentPage === 1" ng-click="setPage(pager.currentPage - 1)" aria-label="Previous"> « </md-button>
                    <md-button class="md-fab md-mini" ng-repeat="page in pager.pages" ng-class="pager.currentPage === page ? 'md-primary' : 'md-accent'" ng-click="setPage(page)">{{page}}</md-button>
                    <md-button class="md-fab md-mini" ng-disabled="pager.currentPage == pager.totalPages" ng-click="setPage(pager.currentPage + 1)" aria-label="Next"> » </md-button>
                    <md-button class="md-fab md-mini" ng-disabled="pager.currentPage == pager.totalPages" ng-click="setPage(pager.totalPages)" aria-label="Last"> »» </md-button>
                    </md-card-icon-actions>
                </md-card-actions>
            `,
            replace: true,
            transclude: true
    };
})

.run(['$rootScope','$templateCache', 'localStorageService', '$location', '$http', function($rootScope, $templateCache, localStorageService, $location, $http){
    // // clear template cache
    // $rootScope.$on('$viewContentLoaded', function() {
    //     $templateCache.removeAll();
    // });

    // // socket.emit('hi', 'This is a simple hi message', 'result');
    // socket.on('result', function (data) {
    //     console.log(data);
    // });

    // socket.on("error", function(error, callback) {
    //     console.log("Error", error);
    // });

    $http.defaults.headers.common['x-access-token'] = localStorageService.get('token');

}])


.config(['$httpProvider', 'localStorageServiceProvider', '$mdThemingProvider', function($httpProvider, localStorageServiceProvider, $mdThemingProvider) {

	$mdThemingProvider.theme('default')
	    .primaryPalette('pink')
	    .accentPalette('purple')
	    .warnPalette('red')
	    .backgroundPalette('grey', {
	    	'default' : '400'
	    });
	// $mdThemingProvider.theme('default').dark();

	$mdThemingProvider
		.enableBrowserColor();

	localStorageServiceProvider
        .setPrefix('Amn-All-Offers')
        .setStorageType('localStorage')
        .setNotify(true, true);

    $httpProvider.defaults.useXDomain = true;
    // $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest";
}])


.controller('IntroCtrl', ['$scope', '$rootScope', '$timeout', '$mdSidenav', '$log', '$animateCss', '$mdUtil', '$element', 'localStorageService', '$http', '$location', function ($scope, $rootScope, $timeout, $mdSidenav, $log, $animateCss, $mdUtil, $element, localStorageService, $http, $location) {

    $scope.login = {};

    $scope.OpenLeftSideMenu = function() {
		$mdSidenav('left')
			.toggle()
			.then(function () {
				$log.debug("toggle left is done");
			});
	};

    $scope.appLogout = function () {
        $rootScope.isAuth = {};
        localStorageService.clearAll();
        $location.path( '/login' );
    };

	var mainContentArea = document.querySelector("[role='main']");
    var scrollContentEl = mainContentArea.querySelector('md-content[md-scroll-y]');
    $scope.scrollTop = function(){
        $mdUtil.animateScrollTo(scrollContentEl, 0, 200);
    };
}])


.controller('AuthCtrl', ['$scope', '$http', 'localStorageService', '$location', function ($scope, $http, localStorageService, $location) {
    $scope.loginFormSubmit = function (form) {
        $http.post('/auth', $scope.login )
        .then(function (data, status, headers, config) {
            if (data.data.success) {
                localStorageService.set('token', data.data.token);
                localStorageService.set('name', data.data.userdata.name);
                localStorageService.set('usermode', data.data.userdata.usermode);
                $location.path("/");
            } else {
                console.log(data.data.msg);
            }
        });
    };

}])



/** Directive which applies a specified class to the element when being scrolled */
.directive('docsScrollClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var scrollParent = element.parent();
            var isScrolling = false;
            // Initial update of the state.
            updateState();
            // Register a scroll listener, which updates the state.
            scrollParent.on('scroll', updateState);
            function updateState() {
                var newState = scrollParent[0].scrollTop !== 0;
                if (newState !== isScrolling) {
                    element.toggleClass(attr.docsScrollClass, newState);
                }
                isScrolling = newState;
            }
        }
    };
})


;