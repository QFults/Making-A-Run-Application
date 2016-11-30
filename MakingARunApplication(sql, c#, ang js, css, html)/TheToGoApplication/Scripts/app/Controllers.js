
(function () {
    'use strict';

    app.controller('Trip_list', ['$scope', '$http', 'UserSelect', '$state', '$timeout', function ($scope, $http, UserSelect, $state, $timeout) {
        if (UserSelect.LoggedIn == false)
        {
            $state.go("userLogin")
        }
        else {
            $scope.selectedTrip = {};
            $scope.data = {};
            $scope.formatlocaldate = function() {
              var now = new Date(),
                      tzo = -now.getTimezoneOffset(),
                      dif = tzo >= 0 ? '+' : '-',
                      pad = function (num) {
                            var norm = Math.abs(Math.floor(num));
                            return (norm < 10 ? '0' : '') + norm;
                                 };
              return now.getFullYear()
                      + '-' + pad(now.getMonth() + 1)
                      + '-' + pad(now.getDate())
                      + 'T' + pad(now.getHours())
                      + ':' + pad(now.getMinutes())
                      + ':' + pad(now.getSeconds())
                }
            //$scope.current = Date.parse($scope.formatlocaldate());
            $http.get('/Api/Trip/')
            .then(function (response) {
                $scope.data = response.data;

                $scope.timeoutFunction = function (item) {
                    setTimeout(function () {
                        item.isActive = false
                    },
                     Date.parse(item.EndTime) - Date.parse($scope.formatlocaldate())
                  )
                };

                for (var i = 0; i < $scope.data.length; i++) {
                    if(Date.parse($scope.data[i].EndTime) > Date.parse($scope.formatlocaldate())) { 
                        $scope.data[i].isActive = true;
                        $scope.timeoutFunction($scope.data[i]);
                    }
                    else {
                        $scope.data[i].isActive = false;
                    }
                };

                $scope.selectTrip = function (item) {
                    if (UserSelect.getLoggedInUser().Id != item.UserId) {
                        alert("Cannot modify trips you did not create.")
                        $scope.selectedTrip = item;
                    }
                    else {
                        $scope.selectedTrip = item;
                  
                        $scope.getTimeRemaining = function (item) {
                            function formatLocalDate() {
                                var now = new Date(),
                                    tzo = -now.getTimezoneOffset(),
                                    dif = tzo >= 0 ? '+' : '-',
                                    pad = function (num) {
                                        var norm = Math.abs(Math.floor(num));
                                        return (norm < 10 ? '0' : '') + norm;
                                    };
                                return now.getFullYear()
                                    + '-' + pad(now.getMonth() + 1)
                                    + '-' + pad(now.getDate())
                                    + 'T' + pad(now.getHours())
                                    + ':' + pad(now.getMinutes())
                                    + ':' + pad(now.getSeconds())

                            }
                            var current = Date.parse(formatLocalDate());
                            $scope.t = Date.parse(item.EndTime) - current;
                            $scope.seconds = Math.floor(($scope.t / 1000) % 60);
                            $scope.minutes = Math.floor(($scope.t / 1000 / 60) % 60);
                            $scope.hours = Math.floor(($scope.t / (1000 * 60 * 60)) % 24);
                            $scope.days = Math.floor($scope.t / (1000 * 60 * 60 * 24));
                            return {
                                'total': $scope.t,
                                'days': $scope.days,
                                'hours': $scope.hours,
                                'minutes': $scope.minutes,
                                'seconds': $scope.seconds
                            };
                        }

                        $scope.initializeClock = function(id, item) {
                            $scope.clock = document.getElementById(id);
                            $scope.daysSpan = $scope.clock.querySelector('.days');
                            $scope.hoursSpan = $scope.clock.querySelector('.hours');
                            $scope.minutesSpan = $scope.clock.querySelector('.minutes');
                            $scope.secondsSpan = $scope.clock.querySelector('.seconds');

                            $scope.updateClock = function() {
                                $scope.t = $scope.getTimeRemaining($scope.selectedTrip);

                                $scope.daysSpan.innerHTML = $scope.t.days;
                                $scope.hoursSpan.innerHTML = ('0' + $scope.t.hours).slice(-2);
                                $scope.minutesSpan.innerHTML = ('0' + $scope.t.minutes).slice(-2);
                                $scope.secondsSpan.innerHTML = ('0' + $scope.t.seconds).slice(-2);

                                if ($scope.t.total <= 0) {
                                    clearInterval($scope.timeinterval);
                                }
                            }

                            $scope.updateClock();
                            $scope.timeinterval = setInterval($scope.updateClock, 1000);
                        }
                    

                        $scope.deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
                        $scope.initializeClock('clockdiv', $scope.deadline);
                    }
                
                }
                $scope.isDisabled = function()
                {
                    if (UserSelect.getLoggedInUser().Id != $scope.selectedTrip.UserId)
                    {
                        return true
                    }
                    else {
                        return false
                    }
            
                }
                $scope.EditTrip = function()
                {
                    $state.go("Home.tripEdit", { id: $scope.selectedTrip.Id });
                }
                $scope.ViewTrip = function()
                {
                    $state.go("Home.tripDetails", { id: $scope.selectedTrip.Id })
                }
                $scope.DeleteTrip = function()
                {
                    $state.go("Home.tripDelete", { id: $scope.selectedTrip.Id })
                }


            });

        }
    }])

    .controller('Trip_details', ['$scope', '$http', '$stateParams', 'UserSelect', function($scope, $http, $stateParams, UserSelect){
        
            function getJsonNetObject(obj, parentObj) {
                // check if obj has $id key.
                var objId = obj["$id"];
                if (typeof (objId) !== "undefined" && objId != null) {
                    // $id key exists, so you have the actual object... return it
                    return obj;
                }
                // $id did not exist, so check if $ref key exists.
                objId = obj["$ref"];
                if (typeof (objId) !== "undefined" && objId != null) {
                    // $ref exists, we need to get the actual object by searching the parent object for $id
                    return getJsonNetObjectById(parentObj, objId);
                }
                // $id and $ref did not exist... return null
                return null;
            }

            // function to return a JSON object by $id
            // parentObj: the top level object containing all child objects as serialized by JSON.NET.
            // id: the $id value of interest
            function getJsonNetObjectById(parentObj, id) {
                // check if $id key exists.
                var objId = parentObj["$id"];
                if (typeof (objId) !== "undefined" && objId != null && objId == id) {
                    // $id key exists, and the id matches the id of interest, so you have the object... return it
                    return parentObj;
                }
                for (var i in parentObj) {
                    if (typeof (parentObj[i]) == "object" && parentObj[i] != null) {
                        //going one step down in the object tree
                        var result = getJsonNetObjectById(parentObj[i], id);
                        if (result != null) {
                            // return found object
                            return result;
                        }
                    }
                }
                return null;
            }
            $http.get('/Api/Trip/' + $stateParams.id)
            .then(function (response) {
                $scope.data = response.data;
                $scope.fullOrders = [];
                for (var i = 0; i < $scope.data.Orders.length; i++) {
                    $scope.fullOrders.push(getJsonNetObject($scope.data.Orders[i], $scope.data));
                }
                console.log($scope.fullOrders);
                $scope.isHidden = function (item) {
                    if (UserSelect.getLoggedInUser().Id != item.UserId) {
                        return true
                    }
                    else {
                        return false
                    }
                }
            });
    }])
    .controller('Trip_create', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {
        if (UserSelect.LoggedIn == false) {
            $state.go('userLogin')
        }
        else {

            $scope.data = {};
            $http.get('/Api/Location/')
    .then(function (response) { $scope.LocationId_options = response.data; });
            console.log(UserSelect);
            $scope.save = function () {
                $scope.data.UserId = UserSelect.getLoggedInUser().Id;
                $scope.data.User_Username = UserSelect.Username;
                $http.post('/Api/Trip/', $scope.data)
                .then(function (response) { $state.go("Home"); });
            }
        }
    }])
    .controller('Trip_edit', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {
        if (UserSelect.LoggedIn == false) {
            $state.go("userLogin")
        }
        else {

            $http.get('/Api/Trip/' + $stateParams.id)
            .then(function (response) { $scope.data = response.data; });
            $http.get('/Api/Location/')
    .then(function (response) { $scope.LocationId_options = response.data; });

            $scope.save = function () {
                console.log($scope.data);
                $http.put('/Api/Trip/' + $stateParams.id, $scope.data)
                .then(function (response) { $state.go("Home"); });
            }
        }
    }])
    .controller('Trip_delete', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function($scope, $http, $stateParams, $state, UserSelect){
        if (UserSelect.LoggedIn == false) {
            $state.go('userLogin')
        }
        else {
            $http.get('/Api/Trip/' + $stateParams.id)
            .then(function (response) { $scope.data = response.data; });
            $scope.save = function () {
                $http.delete('/Api/Trip/' + $stateParams.id, $scope.data)
                .then(function (response) { $state.go("Home"); });
            }
        }
    }])
   .controller('User_list', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {
       $http.get('/Api/User/')
       .then(function (response) {
           $scope.data = response.data;
       });
   }])
    .controller('User_login', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', '$timeout', function ($scope, $http, $stateParams, $state, UserSelect, $timeout) {
        $scope.logintrys = 0;
        $scope.pleasewait = false;
        $scope.timeoutTime = 60000;
        $scope.login = function (Username, Password) {
            $http.get('/Api/User/?username=' + Username + '&password=' + Password)
            .error(function (response) {
                alert("Invalid Username or Password")
                $scope.logintrys++;
                if ($scope.logintrys == 5) {
                    $scope.pleasewait = true;
                            $timeout(function () { $scope.logintrys = 0; $scope.pleasewait = false }, $scope.timeoutTime);
                        }
            })
            .then(function (response) {
                UserSelect.setLoggedInUser(response.data);
                UserSelect.LoggedIn = true;
                console.log(UserSelect)
                $state.go("Home")
            })
        }
    }])
    .controller('User_verify', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {

        $scope.data = "";

        $scope.verify = function () {
            $http.get('/Api/User/?email=' + $scope.data)
            .then(function (response) {
                console.log(response.data);
                $state.go("userLogin");
            });
        }
    }])
    .controller('User_details', ['$scope', '$http', '$stateParams', 'UserSelect', function ($scope, $http, $stateParams, UserSelect) {

        $http.get('/Api/User/' + $stateParams.id)
        .then(function (response) { $scope.data = response.data; });
    }])
    .controller('User_create', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {

        $scope.data = {};

        $scope.save = function () {
            $http.post('/Api/User/', $scope.data)
            .then(function (response) { $state.go("Home"); });
        }
    }])
    .controller('User_edit', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {
        $scope.data = {};
        $http.get('/Api/User/' + $stateParams.id)
        .then(function (response) {
            if (UserSelect.getLoggedInUser() == null) {
                $state.go('userLogin')
            }
            else if (UserSelect.getLoggedInUser().Username == response.data.Username && UserSelect.getLoggedInUser().Password == response.data.Password || UserSelect.getLoggedInUser().Username == "mySecretAdminUsername") {
                $scope.data = response.data;
            }
            else {
                $state.go("Home")
            }
        });
        $scope.save = function () {
            $http.put('/Api/User/' + $stateParams.id, $scope.data)
            .then(function (response) { $state.go("Home"); });
        }
    }])
    .controller('User_delete', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {

        $http.get('/Api/User/' + $stateParams.id)
        .then(function (response) { $scope.data = response.data; });
        $scope.save = function () {
            $http.delete('/Api/User/' + $stateParams.id, $scope.data)
            .then(function (response) { $state.go("Home"); });
        }
    }])
     .controller('Location_list', ['$scope', '$http', function ($scope, $http) {

         $http.get('/Api/Location/')
         .then(function (response) { $scope.data = response.data; });
     }])
    .controller('Location_details', ['$scope', '$http', '$stateParams', '$state', function ($scope, $http, $stateParams, $state) {

        if ($stateParams.id != null) {
            $http.get('/Api/Location/' + $stateParams.id)
            .then(function (response) { $scope.data = response.data; });
        }
        else {
            $state.go("Home");
        };
    }])
    .controller('Location_create', ['$scope', '$http', '$stateParams', '$state', function ($scope, $http, $stateParams, $state) {

        $scope.data = {};

        $scope.save = function () {
            $http.post('/Api/Location/', $scope.data)
            .then(function (response) { $state.go("Home"); });
        }

    }])
    .controller('Location_edit', ['$scope', '$http', '$stateParams', '$state', function ($scope, $http, $stateParams, $state) {

        $http.get('/Api/Location/' + $stateParams.id)
        .then(function (response) { $scope.data = response.data; });
        

        $scope.save = function () {
            $http.put('/Api/Location/' + $stateParams.id, $scope.data)
            .then(function (response) { $state.go("Home"); });
        }
    }])
    .controller('Location_delete', ['$scope', '$http', '$stateParams', '$state', function ($scope, $http, $stateParams, $state) {

        $http.get('/Api/Location/' + $stateParams.id)
        .then(function (response) { $scope.data = response.data; });
        $scope.save = function () {
            $http.delete('/Api/Location/' + $stateParams.id, $scope.data)
            .then(function (response) { $state.go("Home"); });
        }

    }])
     .controller('Order_list', ['$scope', '$http', function ($scope, $http) {

         $http.get('/Api/Order/')
         .then(function (response) { $scope.data = response.data; });

     }])
    .controller('Order_details', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {

        $http.get('/Api/Order/' + $stateParams.id)
        .then(function (response) { $scope.data = response.data; });

    }])
    .controller('Order_create', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {

        $scope.data = {};
        $scope.selectedTrip = {};
        $scope.finalData = {};
        $scope.selectedTripUser = {};
        $scope.GoingOnATrip = function(){
            $http.get('/Api/Trip/' + $scope.data.TripId)
            .then(function(response) {
                $scope.selectedTrip = response.data;
            $http.get('/Api/User/' + $scope.selectedTrip.UserId)
            .then(function(response) {
                $scope.selectedTripUser = response.data;
            })
            });
        }
        $http.get('/Api/Trip/')
.then(function (response) {
    $scope.TripId_options = response.data;
});

        $scope.save = function () {
            $scope.data.UserId = UserSelect.getLoggedInUser().Id;
            $scope.data.User_Username = UserSelect.getLoggedInUser().Username;
        $scope.finalData = {
            'NewlyMadeOrder': $scope.data,
            'EmailForTripCreator': $scope.selectedTripUser.Email,
            'EmailForOrderCreator': UserSelect.getLoggedInUser().Email,
            'OrderCreatorName': UserSelect.getLoggedInUser().Name,
        }
            $http.post('/Api/Order/', $scope.finalData)
            .then(function (response) {
                //$http.SendEmail('/Api/User/', $scope.selectedTripUser.Email, UserSelect.getLoggedInUser().Email, UserSelect.getLoggedInUser().Name, $scope.data.Food)
                //.then(function() {
                    console.log("You Did It!");
                    $state.go("Home");                   
                //})
            });
        }
    }])
    .controller('Order_edit', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {

        $http.get('/Api/Order/' + $stateParams.id)
        .then(function (response) { $scope.data = response.data; });

        $http.get('/Api/Trip/')
  .then(function (response) { $scope.TripId_options = response.data; });

        $scope.save = function () {
            $scope.data.UserId = UserSelect.getLoggedInUser().Id;
            $scope.data.User_Username = UserSelect.getLoggedInUser().Username;
            $http.put('/Api/Order/' + $stateParams.id, $scope.data)
    .then(function (response) { $state.go("Home"); });
        }
    }])
    .controller('Order_delete', ['$scope', '$http', '$stateParams', '$state', function ($scope, $http, $stateParams, $state) {

        $http.get('/Api/Order/' + $stateParams.id)
        .then(function (response) { $scope.data = response.data; });
        $scope.save = function () {
            $http.delete('/Api/Order/' + $stateParams.id, $scope.data)
            .then(function (response) { $state.go("Home"); });
        }
    }])
    .controller('My_Orders', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {
        $scope.orderData = {};
        $scope.selectedItem = {};
        $http.get('/Api/Order/?UserId=' + UserSelect.getLoggedInUser().Id)
        .then(function (response) {
            $scope.orderData = response.data;
            $scope.selectItem = function (item) {
                $scope.selectedItem = item
            }
            $scope.isSelected = function () {
                if ($scope.selectedItem.Id == null) {
                    return true
                }
                else {
                    return false
                }
            }
            $scope.AddOrder = function () {

                $state.go('Home.orderCreate')
            }
            $scope.ViewOrder = function () {
                $state.go("Home.orderDetails", { id: $scope.selectedItem.Id })
                
            }

            $scope.EditOrder = function () {
                    $state.go("Home.orderEdit", { id: $scope.selectedItem.Id })
                
                }

            $scope.DeleteOrder = function () {
                    $state.go("Home.orderDelete", { id: $scope.selectedItem.Id })
                
                }
        });
    }])

     .controller('Home', ['$scope', '$http', '$stateParams', '$state', 'UserSelect', function ($scope, $http, $stateParams, $state, UserSelect) {
         if (UserSelect.LoggedIn == false) {
             $state.go("userLogin")
         }
         else {
             $scope.theName = UserSelect.getLoggedInUser().Name;
             $scope.isHidden = function () {
                 if (UserSelect.getLoggedInUser().Id != 4) {
                     return true
                 }
                 else {
                     return false
                 }
             }
             $scope.isHiddenAdmin = function () {
                 if (UserSelect.getLoggedInUser().Id == 4) {
                     return true
                 }
                 else {
                     return false
                 }
             }
             
             /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
             $scope.openNav = function() {
                 document.getElementById("mySidenav").style.width = "250px";
                 document.getElementById("main").style.marginLeft = "250px";
                 //var div = document.createElement("div");
                 //div.classList.add("myClass");
                 //document.body.insertBefore(div, HTMLBodyElement);
             }

             /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
             $scope.closeNav = function() {
                 document.getElementById("mySidenav").style.width = "0";
                 document.getElementById("main").style.marginLeft = "0";
             }


         }
     }])
})();
