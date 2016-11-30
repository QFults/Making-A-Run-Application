 var  modules = modules || [];
(function () {
    'use strict';
    modules.push('User');

    angular.module('User',['ngRoute'])
    .controller('User_list', ['$scope', '$http', function($scope, $http){

        $http.get('/Api/User/')
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('User_details', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

        $http.get('/Api/User/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('User_create', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $scope.data = {};
        
        $scope.save = function(){
            $http.post('/Api/User/', $scope.data)
            .then(function(response){ $location.path("User"); });
        }

    }])
    .controller('User_edit', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/User/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

        
        $scope.save = function(){
            $http.put('/Api/User/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("User"); });
        }

    }])
    .controller('User_delete', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/User/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});
        $scope.save = function(){
            $http.delete('/Api/User/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("User"); });
        }

    }])

    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/User', {
                title: 'User - List',
                templateUrl: '/Static/User_List',
                controller: 'User_list'
            })
            .when('/User/Create', {
                title: 'User - Create',
                templateUrl: '/Static/User_Edit',
                controller: 'User_create'
            })
            .when('/User/Edit/:id', {
                title: 'User - Edit',
                templateUrl: '/Static/User_Edit',
                controller: 'User_edit'
            })
            .when('/User/Delete/:id', {
                title: 'User - Delete',
                templateUrl: '/Static/User_Delete',
                controller: 'User_delete'
            })
            .when('/User/:id', {
                title: 'User - Details',
                templateUrl: '/Static/User_Details',
                controller: 'User_details'
            })
    }])
;

})();
