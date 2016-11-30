 var  modules = modules || [];
(function () {
    'use strict';
    modules.push('Order');

    angular.module('Order',['ngRoute'])
    .controller('Order_list', ['$scope', '$http', function($scope, $http){

        $http.get('/Api/Order/')
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Order_details', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

        $http.get('/Api/Order/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

    }])
    .controller('Order_create', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $scope.data = {};
                $http.get('/Api/User/')
        .then(function(response){$scope.UserId_options = response.data;});
                $http.get('/Api/Trip/')
        .then(function(response){$scope.TripId_options = response.data;});
        
        $scope.save = function(){
            $http.post('/Api/Order/', $scope.data)
            .then(function(response){ $location.path("Order"); });
        }

    }])
    .controller('Order_edit', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Order/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});

                $http.get('/Api/User/')
        .then(function(response){$scope.UserId_options = response.data;});
                $http.get('/Api/Trip/')
        .then(function(response){$scope.TripId_options = response.data;});
        
        $scope.save = function(){
            $http.put('/Api/Order/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Order"); });
        }

    }])
    .controller('Order_delete', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

        $http.get('/Api/Order/' + $routeParams.id)
        .then(function(response){$scope.data = response.data;});
        $scope.save = function(){
            $http.delete('/Api/Order/' + $routeParams.id, $scope.data)
            .then(function(response){ $location.path("Order"); });
        }

    }])

    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/Order', {
                title: 'Order - List',
                templateUrl: '/Static/Order_List',
                controller: 'Order_list'
            })
            .when('/Order/Create', {
                title: 'Order - Create',
                templateUrl: '/Static/Order_Edit',
                controller: 'Order_create'
            })
            .when('/Order/Edit/:id', {
                title: 'Order - Edit',
                templateUrl: '/Static/Order_Edit',
                controller: 'Order_edit'
            })
            .when('/Order/Delete/:id', {
                title: 'Order - Delete',
                templateUrl: '/Static/Order_Delete',
                controller: 'Order_delete'
            })
            .when('/Order/:id', {
                title: 'Order - Details',
                templateUrl: '/Static/Order_Details',
                controller: 'Order_details'
            })
    }])
;

})();
