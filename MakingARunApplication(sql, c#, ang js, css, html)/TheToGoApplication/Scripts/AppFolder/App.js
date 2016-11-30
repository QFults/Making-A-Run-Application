var app = angular.module('app', ['ui.router']);
app.factory('UserSelect', function () {
    var UserSelect = {};

    UserSelect.loggedInUser = {}

    UserSelect.getLoggedInUser = function () {
        return UserSelect.loggedInUser;
    }

    UserSelect.setLoggedInUser = function (user) {
        UserSelect.loggedInUser = user;
    }
    UserSelect.LoggedIn = false;

    return UserSelect;
})

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('Home', {
            url: '/Home',
            templateUrl: '/Static/Home',
            controller: 'Home'
        })
        .state('Home.userList', {
          url: '/User',
          templateUrl: '/Static/User_List',
          controller: 'User_list'
      })
      .state('userCreate', {
          url: '/User/Create',
          templateUrl: '/Static/User_Edit',
          controller: 'User_create'
      })
      .state('userLogin', {
          url: '/User/Login',
          templateUrl: '/Static/User_Login',
          controller: 'User_login'
      })
      .state('userEdit', {
          url: '/User/Edit/:id',
          templateUrl: '/Static/User_Edit',
          controller: 'User_edit'
      })
      .state('userDelete', {
          url: '/User/Delete/:id',
          templateUrl: '/Static/User_Delete',
          controller: 'User_delete'
      })
      .state('userVerify', {
          url: '/User/Verify',
          templateUrl: '/Static/User_Verify',
          controller: 'User_verify'
      })
      .state('userDetails', {
          url: '/User/:id',
          templateUrl: '/Static/User_Details',
          controller: 'User_details'
      })
      .state('Home.tripList', {
          url: '/Trip',
          templateUrl: '/Static/Trip_List',
          controller: 'Trip_list',
      })
      .state('Home.myOrders', {
          url: '/Order',
          templateUrl: '/Static/Order_List',
          controller: 'My_Orders',
      })
      .state('Home.tripCreate', {
          url: '/Create',
          templateUrl: '/Static/Trip_Edit',
          controller: 'Trip_create'
      })
      .state('Home.tripEdit', {
          url: '/Edit/:id',
          templateUrl: '/Static/Trip_Edit',
          controller: 'Trip_edit'
      })
      .state('Home.tripDelete', {
          url: '/Delete/:id',
          templateUrl: '/Static/Trip_Delete',
          controller: 'Trip_delete'
      })
      .state('Home.tripDetails', {
          url: '/Trip/:id',
          templateUrl: '/Static/Trip_Details',
          controller: 'Trip_details'
      })
      .state('orderList', {
          url: '/Order',
          templateUrl: '/Static/Order_List',
          controller: 'Order_list'
      })
      .state('Home.orderCreate', {
          url: '/Order/Create',
          templateUrl: '/Static/Order_Edit',
          controller: 'Order_create'
      })
      .state('Home.orderEdit', {
          url: '/Order/Edit/:id',
          templateUrl: '/Static/Order_Edit',
          controller: 'Order_edit'
      })
      .state('Home.orderDelete', {
          url: '/Order/Delete/:id',
          templateUrl: '/Static/Order_Delete',
          controller: 'Order_delete'
      })
      .state('Home.orderDetails', {
          url: '/Order/:id',
          templateUrl: '/Static/Order_Details',
          controller: 'Order_details'
      })
      .state('Home.locationList', {
          url: '/Location',
          templateUrl: '/Static/Location_List',
          controller: 'Location_list'
      })
      .state('Home.locationCreate', {
          url: '/Location/Create',
          templateUrl: '/Static/Location_Edit',
          controller: 'Location_create'
      })
      .state('locationEdit', {
          url: '/Location/Edit/:id',
          templateUrl: '/Static/Location_Edit',
          controller: 'Location_edit'
      })
      .state('Home.locationDelete', {
          url: '/Location/Delete/:id',
          templateUrl: '/Static/Location_Delete',
          controller: 'Location_delete'
      })
      .state('Home.locationDetails', {
          url: '/Location/:id',
          templateUrl: '/Static/Location_Details',
          controller: 'Location_details'
      })

    $urlRouterProvider.otherwise('/User/Login')

});