 var  modules = modules || [];
(function () {
    'use strict';
    modules.push('Trip');

    angular.module('Trip',['ngRoute'])
    .controller('Trip_list', ['$scope', '$http', function($scope, $http){

        $http.get('/Api/Trip/')
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Trip_details', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

        $http.get('/Api/Trip/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Trip_create', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $scope.data = {};
                $http.get('/Api/User/')
        .then(function(response){$scope.UserId_options = response.data;});
        
        $scope.save = function(){
            $http.post('/Api/Trip/', $scope.data)
            .then(function(response){ $location.path("Trip"); });
        }

    }])
    .controller('Trip_edit', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Trip/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

                $http.get('/Api/User/')
        .then(function(response){$scope.UserId_options = response.data;});
        
        $scope.save = function(){
            $http.put('/Api/Trip/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Trip"); });
        }

    }])
    .controller('Trip_delete', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Trip/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});
        $scope.save = function(){
            $http.delete('/Api/Trip/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Trip"); });
        }

    }])

    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/Trip', {
                title: 'Trip - List',
                templateUrl: '/Static/Trip_List',
                controller: 'Trip_list'
            })
            .when('/Trip/Create', {
                title: 'Trip - Create',
                templateUrl: '/Static/Trip_Edit',
                controller: 'Trip_create'
            })
            .when('/Trip/Edit/:id', {
                title: 'Trip - Edit',
                templateUrl: '/Static/Trip_Edit',
                controller: 'Trip_edit'
            })
            .when('/Trip/Delete/:id', {
                title: 'Trip - Delete',
                templateUrl: '/Static/Trip_Delete',
                controller: 'Trip_delete'
            })
            .when('/Trip/:id', {
                title: 'Trip - Details',
                templateUrl: '/Static/Trip_Details',
                controller: 'Trip_details'
            })
    }])
;

})();
