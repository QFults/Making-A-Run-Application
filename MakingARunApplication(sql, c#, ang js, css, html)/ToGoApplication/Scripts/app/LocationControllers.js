 var  modules = modules || [];
(function () {
    'use strict';
    modules.push('Location');

    angular.module('Location',['ngRoute'])
    .controller('Location_list', ['$scope', '$http', function($scope, $http){

        $http.get('/Api/Location/')
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Location_details', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

        $http.get('/Api/Location/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Location_create', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $scope.data = {};
        
        $scope.save = function(){
            $http.post('/Api/Location/', $scope.data)
            .then(function(response){ $location.path("Location"); });
        }

    }])
    .controller('Location_edit', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Location/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

        
        $scope.save = function(){
            $http.put('/Api/Location/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Location"); });
        }

    }])
    .controller('Location_delete', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Location/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});
        $scope.save = function(){
            $http.delete('/Api/Location/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Location"); });
        }

    }])

    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/Location', {
                title: 'Location - List',
                templateUrl: '/Static/Location_List',
                controller: 'Location_list'
            })
            .when('/Location/Create', {
                title: 'Location - Create',
                templateUrl: '/Static/Location_Edit',
                controller: 'Location_create'
            })
            .when('/Location/Edit/:id', {
                title: 'Location - Edit',
                templateUrl: '/Static/Location_Edit',
                controller: 'Location_edit'
            })
            .when('/Location/Delete/:id', {
                title: 'Location - Delete',
                templateUrl: '/Static/Location_Delete',
                controller: 'Location_delete'
            })
            .when('/Location/:id', {
                title: 'Location - Details',
                templateUrl: '/Static/Location_Details',
                controller: 'Location_details'
            })
    }])
;

})();
