(function () {
    var Bytebazaar = angular.module("Bytebazaar", ['ngResource', 'ngTable', 'ngCookies', 'ngSanitize'])

    Bytebazaar.controller("PaymentController",
        [
            "$scope", "$http", "$resource", "NgTableParams", "$window", "$sce",
            function ($scope, $http, $resource, NgTableParams, $window, $sce) {
                $scope.loading = false;

                // error fields
                $scope.showErrorResponseMessage = false;
                $scope.showSuccessResponseMessage = false;
                $scope.errorResponseMessage = "";
                $scope.DisableButton = false;
                $scope.PhoneNumber = "";
                $scope.Amount = "";

                $scope.MakeMpesaPayment = function () {

                    $scope.loading = true;
                    $scope.DisableButton = true;

                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";

                    if ($scope.PhoneNumber === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide your PhoneNumber.";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }

                    if ($scope.Amount === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please enter the amount";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }

                    var args = {}

                    args = {
                        PhoneNumber: $scope.PhoneNumber,
                        Amount: $scope.Amount
                    }

                    $http(
                        {
                            method: 'POST',
                            url: 'Bytebazaar.asmx/OnlineFeePayment',
                            dataType: 'json',
                            responseType: 'json',
                            data: JSON.stringify(args),
                            headers: { "Content-Type": "application/json" }
                        }).then(function (response) {
                            if (response.status.toString() === "200") {
                                // check for error messages
                                $http.post("Bytebazaar.asmx/CheckForErrorMessages")
                                    .then(function success(response) {

                                        var errorMessage = response.data.Message;
                                        if (errorMessage !== "") {
                                            $scope.showErrorResponseMessage = true;
                                            $scope.showSuccessResponseMessage = false;
                                            $scope.errorResponseMessage =
                                                "Error making payment Details Error: '" + errorMessage + "'";
                                            $scope.DisableButton = false;

                                        } else {

                                            $scope.showErrorResponseMessage = false;
                                            $scope.showSuccessResponseMessage = true;
                                            $scope.errorResponseMessage = "";

                                            $scope.PhoneNumber = "",
                                            $scope.Amount = ""

                                            $window.location.href = 'Processing.aspx';

                                        }

                                        $scope.loading = false;
                                    },
                                        function error(response) {
                                            console.log(response);
                                        });
                            }
                        });
                }


            }
        ]);

    Bytebazaar.controller("ProductsCtrl",
        [
            "$scope", "$http", "$resource", "NgTableParams", "$window", "$sce", '$cookies', '$interval',
            function ($scope, $http, $resource, NgTableParams, $window, $sce, $cookies, $interval) {
                $scope.loading = true;

                $scope.cart = [];
                $scope.DeliveryLocation = "0";
                $scope.DeliveryAmount = 0.0;
                $scope.total = 0.0;
                $scope.MakeDescription = ""
                $scope.DeliveryDetails = ""
                $scope.Name = ""
                $scope.PhoneNumber = 254
                $scope.Email = ""
                $scope.showDelivery = false
                $scope.DeliveryMethods = "0"

                //$("#Notification").modal();

                $http.post('Bytebazaar.asmx/ResetCart')
                    .then(function (response) {
                        if (String(response.data) === 'true') {
                            $cookies.remove('cart');
                            $cookies.remove('total');
                            $scope.total = 0.0;
                            $scope.cart = [];
                        } else {
                            if (!angular.isUndefined($cookies.get('cart'))) {
                                $scope.cart = $cookies.getObject('cart');
                            }

                            if (!angular.isUndefined($cookies.get('total'))) {
                                $scope.total = parseFloat($cookies.get('total'));
                                if (isNaN($scope.total)) {
                                    $scope.total = 0.0;
                                    if ($scope.cart.length > 0) {
                                        _.map($scope.cart,
                                            function (item) {
                                                $scope.total += parseFloat(item.Amount * item.count);
                                            });
                                    } else {
                                        $scope.total = 0.0;
                                    }
                                }
                            }

                        }
                    }).finally(function () {
                        $scope.loading = false;
                    });

                loadMenu();


                function loadMenu() {

                    $http.post('Bytebazaar.asmx/GetProducts')
                        .then(function (response) {
                            $scope.Menus = response.data;

                        }).finally(function () {
                            $scope.loading = false;
                        });
                }

                $scope.ViewMenuItem = function (Menu) {
                    $scope.Menu = Menu
                    $scope.Category = Menu.Category
                    $scope.ID = Menu.ID
                    $scope.Title = Menu.Title
                    $scope.Description = Menu.Description
                    $scope.Amount = Menu.Amount
                    $scope.PhotoUrl = Menu.PhotoUrl
                    $scope.IsMake = Menu.IsMake

                    $scope.IsSpecialty = Menu.IsSpecialty

                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.DisableButton = true;

                }
                $scope.DeliverylocationAmount = function () {

                    $scope.total -= $scope.DeliveryAmount

                    if ($scope.DeliveryLocation === "0") {
                        $scope.DeliveryAmount = 0
                        $scope.total += $scope.DeliveryAmount
                    } else if ($scope.DeliveryLocation === "1") {

                        $scope.DeliveryAmount = 150
                        $scope.total += $scope.DeliveryAmount
                    } else if ($scope.DeliveryLocation === "2") {

                        $scope.DeliveryAmount = 250
                        $scope.total += $scope.DeliveryAmount
                    } else if ($scope.DeliveryLocation === "3") {

                        $scope.DeliveryAmount = 300
                        $scope.total += $scope.DeliveryAmount
                    } else if ($scope.DeliveryLocation === "4") {

                        $scope.DeliveryAmount = 0
                        $scope.total += 0
                    } else if ($scope.DeliveryLocation === "5") {

                        $scope.DeliveryAmount = 0
                        $scope.total += $scope.DeliveryAmount
                    }


                }

                $scope.addItemToCart = function (product) {

                    if ($scope.cart.length === 0) {
                        product.count = 1;
                        $scope.cart.push(product);
                    } else {
                        var repeat = false;
                        for (var i = 0; i < $scope.cart.length; i++) {
                            if ($scope.cart[i].ID === product.ID) {
                                repeat = true;
                                $scope.cart[i].count += 1;
                            }
                        }

                        if (!repeat) {
                            product.count = 1;
                            $scope.cart.push(product);
                        }
                    }

                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 1);
                    $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
                    $scope.cart = $cookies.getObject('cart');
                    $scope.total += parseFloat(product.Amount);
                    $cookies.put('total', $scope.total, { 'expires': expireDate });


                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = true;
                    $scope.DisableButton = true;
                }
                $scope.addItemToCartTopping = function (product) {

                    if ($scope.cart.length === 0) {
                        product.count = 1;
                        $scope.cart.push(product);
                    } else {
                        var repeat = false;
                        for (var i = 0; i < $scope.cart.length; i++) {
                            if ($scope.cart[i].ID === product.ID) {
                                repeat = true;
                                $scope.cart[i].count += 1;
                            }
                        }

                        if (!repeat) {
                            product.count = 1;
                            $scope.cart.push(product);
                        }
                    }

                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 1);
                    $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
                    $scope.cart = $cookies.getObject('cart');
                    $scope.total += parseFloat(product.Amount);
                    $cookies.put('total', $scope.total, { 'expires': expireDate });


                    $scope.showErrorResponseMessage1 = false;
                    $scope.showSuccessResponseMessage1 = true;
                    $scope.DisableButton = true;
                }

                $scope.removeItemCart = function (product) {
                    var expireDate = new Date();
                    if (product.count > 1) {
                        product.count -= 1;
                        expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                        $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
                        $scope.cart = $cookies.getObject('cart');
                    } else if (product.count === 1) {
                        var index = $scope.cart.indexOf(product);
                        $scope.cart.splice(index, 1);
                        expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                        $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
                        $scope.cart = $cookies.getObject('cart');

                    }

                    $scope.total -= parseFloat(product.Amount);
                    $cookies.put('total', $scope.total, { 'expires': expireDate });

                };

                function clearCart() {
                    $cookies.remove('cart');
                    $cookies.remove('total');
                    $scope.total = 0.0;
                    $scope.cart = [];
                }

                if (!angular.isUndefined($cookies.get('cart'))) {
                    $scope.cart = $cookies.getObject('cart');
                }

                if (!angular.isUndefined($cookies.get('total'))) {
                    $scope.total = parseFloat($cookies.get('total'));
                    if (isNaN($scope.total)) {
                        $scope.total = 0.0;
                        if ($scope.cart.length > 0) {
                            _.map($scope.cart,
                                function (item) {
                                    $scope.total += parseFloat(item.Amount * item.count);
                                });
                        } else {
                            $scope.total = 0.0;
                        }
                    }
                }

                $scope.increaseItems = function (product) {
                    if ($scope.cart.length === 0) {
                        product.count = 1;
                        $scope.cart.push(product);
                    } else {
                        var repeat = false;
                        for (var i = 0; i < $scope.cart.length; i++) {
                            if ($scope.cart[i].ID === product.ID) {
                                repeat = true;
                                $scope.cart[i].count += 1;
                            }
                        }

                        if (!repeat) {
                            product.count = 1;
                            $scope.cart.push(product);
                        }
                    }

                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 1);
                    $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
                    $scope.cart = $cookies.getObject('cart');
                    $scope.total += parseFloat(product.Amount);
                    $cookies.put('total', $scope.total, { 'expires': expireDate });
                }

                $scope.reduceItems = function (product) {
                    var expireDate = new Date();
                    if (product.count > 1) {
                        product.count -= 1;
                        expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                        $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
                        $scope.cart = $cookies.getObject('cart');
                    } else if (product.count === 1) {
                        var index = $scope.cart.indexOf(product);
                        $scope.cart.splice(index, 1);
                        expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                        $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
                        $scope.cart = $cookies.getObject('cart');

                    }

                    $scope.total -= parseFloat(product.Amount);


                    $cookies.put('total', $scope.total, { 'expires': expireDate });

                };

                $scope.Redirect = function () {
                    $window.location.href = "/ProcessingOrder.aspx";
                }



                $scope.DeliveryMethod = function () {
                    if ($scope.DeliveryMethods === "1") {
                        $scope.showDelivery = false
                        $scope.DeliveryLocation = "5"
                        $scope.DeliveryDetails = "Pick Up"

                    }
                    if ($scope.DeliveryMethods === "0") {
                        $scope.showDelivery = false
                        $scope.DeliveryLocation = "5"
                        $scope.DeliveryDetails = "Pick Up"
                    }
                    if ($scope.DeliveryMethods === "2") {
                        $scope.showDelivery = true
                        $scope.DeliveryDetails = ""
                        $scope.DeliveryLocation = "0"
                    }
                }

                function CheckPaymentUpdate() {
                    $scope.checkCount = 0

                    var timer = $interval(function () {
                        if ($scope.checkCount < 8) {
                            $http.get("Mathree.asmx/CheckPaymentUpdate")
                                .then(function mySuccess(response) {
                                    if (response.data[0].Status === "True") {
                                        $scope.loading = false;
                                        clearCart();
                                        $scope.Redirect();
                                    }
                                    else {
                                        $scope.loading = true;
                                    }
                                }, function myError(response) {
                                    $scope.loading = false;
                                    $scope.showErrorResponseMessage = true;
                                    $scope.showSuccessResponseMessage = false;
                                    $scope.errorResponseMessage = "Check your phone in order to pay for your order.";
                                    $scope.DisableButton = false;
                                    $scope.loading = false;
                                });

                            $scope.checkCount += 1
                        } else {
                            $scope.loading = false;
                            $scope.showErrorResponseMessage = true;
                            $scope.showSuccessResponseMessage = false;
                            $scope.errorResponseMessage = "Check your phone in order to pay for your order.";
                            $scope.DisableButton = false;
                            $scope.loading = false;
                        }
                    }, 5000);

                }

                $scope.Checkout = function () {

                    $scope.loading = true;
                    if ($scope.Name === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please enter your name";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }
                    if ($scope.PhoneNumber === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please enter your Phone Number";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }
                    if ($scope.Email === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please enter your Email";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }
                    if ($scope.DeliveryDetails === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please enter  Delivery Details";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }

                    if ($scope.DeliveryLocation === "0") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please select the Delivery Location";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }

                    var args = {
                        MyList: $scope.cart,
                        MakeDescription: $scope.MakeDescription,
                        Name: $scope.Name,
                        PhoneNumber: $scope.PhoneNumber,
                        Email: $scope.Email,
                        DeliveryDetails: $scope.DeliveryDetails,
                        DeliveryLocation: $scope.DeliveryLocation,
                        DeliveryAmount: $scope.DeliveryAmount


                    }


                    $http({
                        method: "POST",
                        url: "Mathree.asmx/SaveCart",
                        dataType: 'json',
                        data: JSON.stringify(args),
                        headers: { "Content-Type": "application/json" }
                    }).then(function (response) {

                        if (response.status.toString() === "200") {
                            console.log(response)
                            $http.post("Mathree.asmx/CheckForErrorMessages")
                                .then(function success(response) {

                                    var errorMessage = response.data.Message;
                                    if (errorMessage !== "") {
                                        $scope.showErrorResponseMessage = true;
                                        $scope.showSuccessResponseMessage = false;
                                        $scope.errorResponseMessage =
                                            "" + errorMessage + "'";
                                        $scope.DisableButton = false;
                                        $scope.loading = false;

                                    } else {

                                        $scope.showErrorResponseMessage = false;
                                        $scope.showSuccessResponseMessage = true;
                                        $scope.errorResponseMessage = "";

                                        CheckPaymentUpdate();

                                    }

                                },
                                    function error(response) {
                                    });
                        }
                    });
                }

            }
        ]);



    //Bytebazaar controller the rest is Mathree

    Mathree.controller("ProcessOnlineFeePaymentCtrl", [
        '$scope', '$http', '$window', '$interval',
        function ($scope, $http, $window, $interval) {
            $scope.loading = true
            $scope.checkCount = 0

            var timer = $interval(function () {
                if ($scope.checkCount < 8) {

                    $http.get("Mathree.asmx/CheckLNMpesaPaymentUpdate")
                        .then(function mySuccess(response) {
                            if (response.data.toString() === "true") {
                                $scope.loading = false;
                                $window.location.href = 'SuccessPayment.aspx';
                            }
                            else {
                                $scope.loading = true;
                            }
                        }, function myError(response) {
                            $scope.loading = false;
                            $window.location.href = 'FailedPayment.aspx';
                        });

                    $scope.checkCount += 1
                } else {
                    $scope.loading = false;
                    $window.location.href = 'FailedPayment.aspx';
                }
            }, 5000);

        }])
    Mathree.controller("SuccessFullPaymentCtrl",
        function ($scope, $http) {
            $scope.loading = true;
            $http.post('Mathree.asmx/GetSuccessfullPayment')
                .then(function (response) {
                    $scope.success = response.data;
                }).finally(function () {
                    $scope.loading = false;
                })
        });

    Mathree.controller("AllBusCtrl",
        [
            "$scope", "$http", "$resource", "NgTableParams", "$window", "$sce",
            function ($scope, $http, $resource, NgTableParams, $window, $sce) {
                $scope.loading = true;
                $scope.loadingAddBus = false;
                $scope.BussID = "0";
                $scope.BusID = "0";
                $scope.BusbusID = "0";
                $scope.searchNumberPlate = "";
                $scope.AddOrEdit = 1;

                $scope.loadingBusPayments = false;

                // error fields
                $scope.showErrorResponseMessage = false;
                $scope.showSuccessResponseMessage = false;
                $scope.errorResponseMessage = "";
                $scope.DisableButton = false;

                getAllbuses();

                //getAllbuses()
                function getAllbuses() {

                    var Api = $resource("Mathree.asmx/GetAllBuses");
                    $scope.tableParams1 = new NgTableParams({},
                        {
                            getData: function (params) {
                                return Api.query(params.url()).$promise.then(function (data) {
                                    params.total(data.length); // recal. page nav 

                                    $scope.loading = false;
                                    $scope.AllBuses = data;

                                    if (Object.keys($scope.AllBuses).length > 0) {
                                        $scope.tableParams1 = new NgTableParams({}, { dataset: $scope.AllBuses });
                                    }
                                    return data;
                                });
                            }
                        });

                }

               
                // get Bus trips
                function BusTrips() {

                    var Api = $resource("Mathree.asmx/GetBusTrips");
                    $scope.tableParams3 = new NgTableParams({},
                        {
                            getData: function (params) {
                                return Api.query(params.url()).$promise.then(function (data) {
                                    params.total(data.length); // recal. page nav 

                                    $scope.loading = false;
                                    $scope.BusTrips = data;

                                    if (Object.keys($scope.BusTrips).length > 0) {
                                        $scope.tableParams3 = new NgTableParams({}, { dataset: $scope.BusTrips });
                                    }
                                    return data;
                                });
                            }
                        });

                }
                // show add candidate modal
                $scope.showAddBusModal = function () {
                    $scope.loading = true;

                    $scope.loadingAddBus = false;
                    $scope.BussID = "0";
                    $scope.BusTripID = "0";
                    $scope.LocationIDFrom = "0";
                    $scope.LocationIDTo = "0";
                    $scope.DriverID = "0";
                    $scope.AssDriverID = "0";
                    $scope.Amount = "0";
                    $scope.BusStatusID = "0";
                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";
                    $scope.DisableButton = false;
                }

                // close Job modal
                $scope.closeModal = function () {
                    $scope.loading = false;
                    $scope.BusID = "0";
                    $scope.PhoneNumber = "";
                    $scope.NumberPlate = "";
                    $scope.Password = "";
                    $scope.ConfirmPassword = "";
                    $scope.AddOrEdit = 1;
                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";
                    $scope.DisableButton = false;
                }

                $scope.saveBus = function () {

                    $scope.DisableButton = true;
                    $scope.loadingAddBus = true;

                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";


                    if ($scope.NumberPlatebus === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide the number plate.";
                        $scope.DisableButton = false;
                        $scope.loadingAddBus = false;
                        return;
                    }

                    if ($scope.FleetNumberbus === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide the Fleet Number.";
                        $scope.DisableButton = false;
                        $scope.loadingAddBus = false;
                        return;
                    }

                    if ($scope.PhoneNumberbus === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide the phone number.";
                        $scope.DisableButton = false;
                        $scope.loadingAddBus = false;
                        return;
                    }

                  

                    var args = {}

                        args = {
                            BusID: $scope.BusbusID,
                            Name: $scope.NumberPlatebus,
                            FleetNumber: $scope.FleetNumberbus,
                            Phone: $scope.PhoneNumberbus,
                            Pass:"1234"
                        }

                    $http(
                        {
                            method: 'POST',
                            url: 'Mathree.asmx/SaveBusDetails',
                            dataType: 'json',
                            responseType: 'json',
                            data: JSON.stringify(args),
                            headers: { "Content-Type": "application/json" }
                        }).then(function (response) {
                            if (response.status.toString() === "200") {
                                // check for error messages
                                $http.post("Mathree.asmx/CheckForErrorMessages")
                                    .then(function success(response) {

                                        var errorMessage = response.data.Message;
                                        if (errorMessage !== "") {
                                            $scope.showErrorResponseMessage = true;
                                            $scope.showSuccessResponseMessage = false;
                                            $scope.errorResponseMessage =
                                                "Error saving Bus Details Error: '" + errorMessage + "'";
                                            $scope.DisableButton = false;
                                            $scope.loadingAddBus = false;

                                        } else {

                                            $scope.showErrorResponseMessage = false;
                                            $scope.showSuccessResponseMessage = true;
                                            $scope.errorResponseMessage = "";
                                            $scope.loadingAddBus = false;

                                            $scope.BusID = "0";
                                            $scope.PhoneNumber = "";
                                            $scope.NumberPlate = "";
                                            $scope.Password = "";
                                            $scope.ConfirmPassword = "";

                                            if ($scope.AddOrEdit === 0) {
                                                $scope.DisableButton = true;
                                            } else {
                                                $scope.DisableButton = false;
                                            }

                                            getAllbuses();

                                        }

                                        $scope.loading = false;
                                    },
                                        function error(response) {
                                        });
                            }
                        });
                }

                // get BusPayments
                function loadBusPayments() {

                    $scope.loadingBusPayments = true;

                    var Api = $resource("Mathree.asmx/GetBusPayments");
                    $scope.tableParams2 = new NgTableParams({},
                        {
                            getData: function (params) {
                                return Api.query(params.url()).$promise.then(function (data) {
                                    params.total(data.length); // recal. page nav 

                                    $scope.loadingBusPayments = false;
                                    $scope.BusPayments = data;

                                    if (Object.keys($scope.BusPayments).length > 0) {
                                        $scope.tableParams2 = new NgTableParams({}, { dataset: $scope.BusPayments });
                                    }
                                    return data;
                                });
                            }
                        });

                }



                // edit Bus
                $scope.showEditBusModal = function (Bus) {


                    $scope.BussID = Bus.BusID;
                    $scope.BusTripID = Bus.BusTripID;
                    $scope.LocationIDFrom = Bus.LocationIDFrom;
                    $scope.LocationIDTo = Bus.LocationIDTo;
                    $scope.DriverID = Bus.DriverID;
                    $scope.AssDriverID = Bus.AssDriverID;
                    $scope.Amount = Bus.Amount
                    $scope.BusStatusID = Bus.BusStatusID;

                    $scope.loadingAddBusTrip = false;
                    $scope.AddOrEdit = 0;

                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";
                    $scope.DisableButton = false;
                }
                $scope.showEditAllBusModal = function (Bus) {
                    console.log(Bus )

                    $scope.BusbusID = Bus.BusID;
                    $scope.NumberPlatebus = Bus.NumberPlate;
                    $scope.PhoneNumberbus = Bus.PhoneNumber;
                    $scope.FleetNumberbus = Bus.FleetNumber;

                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";
                    $scope.DisableButton = false;
                }


                // view Bus
                $scope.ViewBus = function () {

                    if ($scope.searchNumberPlate !== '') {

                        var args = {
                            NumberPlate: $scope.searchNumberPlate
                        }
                            //alert(JSON.stringify(passingArguments));
                            $http({
                                method: "POST",
                                url: "Mathree.asmx/SetNumberPlateIDSession",
                                dataType: 'json',
                                responseType: 'json',
                                data: JSON.stringify(args),
                                headers: { "Content-Type": "application/json" }
                            }).then(function (response) {
                                if (response.status.toString() === "200") {

                                    $window.location.href = 'BusProfile.aspx';
                                }

                            });
                    }
                   
                                        

                }

                $scope.ViewBusPayments = function (Bus) {

                    var args = {
                        BusID: Bus.BusID
                    }


                    //alert(JSON.stringify(passingArguments));
                    $http({
                        method: "POST",
                        url: "Mathree.asmx/SetBusIDSession",
                        dataType: 'json',
                        responseType: 'json',
                        data: JSON.stringify(args),
                        headers: { "Content-Type": "application/json" }
                    }).then(function (response) {
                        if (response.status.toString() === "200") {
                            loadBusPayments();
                        }

                    });
                }


                // view Bus
                $scope.ViewBusTrips = function (Bus) {

                    var args = {
                        BusID: Bus.BusID
                    }


                    //alert(JSON.stringify(passingArguments));
                    $http({
                        method: "POST",
                        url: "Mathree.asmx/SetBusIDSession",
                        dataType: 'json',
                        responseType: 'json',
                        data: JSON.stringify(args),
                        headers: { "Content-Type": "application/json" }
                    }).then(function (response) {
                        if (response.status.toString() === "200") {
                            BusTrips();
                        }

                    });
                }

                // show delete Bus modal
                $scope.showDeleteBusModal = function (Bus) {

                    console.log(Bus)
                    $scope.BussID = Bus.BusID;
                    $scope.loading = true;

                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";
                    $scope.DisableButton = false;
                }


                // delete Bus
                $scope.deleteBus = function () {

                    $scope.loading = true;
                    $scope.DisableButton = true;

                    if ($scope.BussID === "0") {
                        $scope.showErrorResponseMessage = false;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "";
                        $scope.DisableButton = false;
                        $scope.loadingRole = false;
                        return;
                    }

                    var args = {
                        BusID: $scope.BussID
                    }


                    $http({
                        method: 'POST',
                        url: 'Mathree.asmx/DeleteBus',
                        dataType: 'json',
                        responseType: 'json',
                        data: JSON.stringify(args),
                        headers: { "Content-Type": "application/json" }
                    }).then(function (response) {
                        if (response.status.toString() === "200") {
                            $http.post("Mathree.asmx/CheckForErrorMessages")
                                .then(function success(response) {

                                    var errorMessage = response.data.Message;
                                    if (errorMessage !== "") {
                                        $scope.showErrorResponseMessage = true;
                                        $scope.showSuccessResponseMessage = false;
                                        $scope.loading = false;
                                        $scope.errorResponseMessage =
                                            "Error deleting Bus. Error: '" + errorMessage + "'";
                                        $scope.DisableButton = false;
                                    } else {

                                        $scope.showErrorResponseMessage = false;
                                        $scope.showSuccessResponseMessage = true;
                                        $scope.successResponseMessage = "Bus deleted successfully";
                                        $scope.errorResponseMessage = "";

                                        $scope.DisableButton = true;
                                        $scope.BusID = "0"

                                        getAllbuses();

                                    }

                                    $scope.loading = false;
                                },
                                    function error(response) {
                                        console.log(response);
                                    });
                        }
                    });
                }

            }
        ]);


    Mathree.controller("MarshalBusCtrl",
        [
            "$scope", "$http", "$resource", "NgTableParams", "$window", "$sce",
            function ($scope, $http, $resource, NgTableParams, $window, $sce) {
                $scope.loading = true;
                $scope.loadingAddBusTrip = false;
                $scope.BusName = "";
                $scope.BusTripID = "0";
                $scope.BusID = "0";
                $scope.BusbusID = "0";
                $scope.BusTripID = "0";
                $scope.LocationIDFrom = "0";
                $scope.LocationIDTo = "1";
                $scope.Amount = "100";
                $scope.StationFee = "220";
                $scope.BusStatusID = "0";
                $scope.searchNumberPlate = "";


                // error fields
                $scope.showErrorResponseMessage = false;
                $scope.showSuccessResponseMessage = false;
                $scope.errorResponseMessage = "";
                $scope.DisableButton = false;

                loadBusTrips();
                getTripStatus();
                getUserBusStations();
                getBusStations();
                getUserBusStationsTo();

                // get Bus trips
                function loadBusTrips() {

                    var Api = $resource("Mathree.asmx/GetMarshalBuses");
                    $scope.tableParamstrips = new NgTableParams({},
                        {
                            getData: function (params) {
                                return Api.query(params.url()).$promise.then(function (data) {
                                    params.total(data.length); // recal. page nav 

                                    $scope.loading = false;
                                    $scope.BusTrips = data;

                                    if (Object.keys($scope.BusTrips).length > 0) {
                                        $scope.tableParamstrips = new NgTableParams({}, { dataset: $scope.BusTrips });
                                    }
                                    return data;
                                });
                            }
                        });

                }

                function getUserBusStations() {

                    $http.post('Mathree.asmx/GetUserBusStations')
                        .then(function (response) {
                            $scope.UserBusStations = response.data[0];
                            $scope.LocationIDFrom = $scope.UserBusStations.StationID;
                        }).finally(function () {

                        });
                }


                function getBusStations() {

                    $http.post('Mathree.asmx/GetBusStations')
                        .then(function (response) {
                            $scope.BusStations = response.data;

                        }).finally(function () {

                        });
                }
                function getUserBusStationsTo() {

                    $http.post('Mathree.asmx/GetUserBusStationsTo')
                        .then(function (response) {
                            $scope.BusStationsTo = response.data;

                        }).finally(function () {

                        });
                }
                function getTripStatus() {

                    $http.post('Mathree.asmx/GetTripStatus')
                        .then(function (response) {
                            $scope.BusTripStatus = response.data;

                        }).finally(function () {

                        });
                }


                // show add candidate modal
                $scope.showAddBusModal = function () {
                    $scope.loading = true;
                    getUserBusStations()

                    $scope.loadingAddBusTrip = false;
                    $scope.BusName = "";
                    $scope.BusTripID = "0";
                    $scope.LocationIDTo = "1";
                    $scope.Amount = "100";
                    $scope.BusStatusID = "3";
                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";
                    $scope.DisableButton = false;
                }

                // close Job modal
                $scope.closeModal = function () {
                    $scope.loading = false;
                    $scope.loadingAddBusTrip = false;
                    $scope.BusName = "0";
                    $scope.BusTripID = "0";
                    $scope.LocationIDFrom = "0";
                    $scope.LocationIDTo = "0";
                    $scope.Amount = "100";
                    $scope.BusStatusID = "3";
                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";
                    $scope.DisableButton = false;
                }


                $scope.saveBusTrip = function () {

                    $scope.DisableButton = true;
                    $scope.loadingAddBusTrip = true;


                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";


                    if ($scope.BusName === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide the number plate or Fleet Number.";
                        $scope.DisableButton = false;
                        $scope.loadingAddBusTrip = false;
                        return;
                    }

                    if ($scope.LocationIDFrom === "0") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide the station from.";
                        $scope.DisableButton = false;
                        $scope.loadingAddBusTrip = false;
                        return;
                    }

                    if ($scope.LocationIDTo === "0") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide the station to.";
                        $scope.DisableButton = false;
                        $scope.loadingAddBusTrip = false;
                        return;
                    }


                    var args = {}

                    args = {
                        BusTripID: $scope.BusTripID,
                        BusName: $scope.BusName,
                        LocationIDFrom: $scope.LocationIDFrom,
                        LocationIDTo: $scope.LocationIDTo,
                        Amount: $scope.Amount,
                        StationFee: $scope.StationFee,
                        BusStatusID: $scope.BusStatusID
                    }
                    $http(
                        {
                            method: 'POST',
                            url: 'Mathree.asmx/SaveBusTrip',
                            dataType: 'json',
                            responseType: 'json',
                            data: JSON.stringify(args),
                            headers: { "Content-Type": "application/json" }
                        }).then(function (response) {
                            if (response.status.toString() === "200") {
                                // check for error messages
                                $http.post("Mathree.asmx/CheckForErrorMessages")
                                    .then(function success(response) {

                                        var errorMessage = response.data.Message;
                                        if (errorMessage !== "") {
                                            $scope.showErrorResponseMessage = true;
                                            $scope.showSuccessResponseMessage = false;
                                            $scope.errorResponseMessage =
                                                "Error saving Bus trip Details Error: '" + errorMessage + "'";
                                            $scope.DisableButton = false;
                                            $scope.loadingAddBusTrip = false;

                                        } else {

                                            $scope.showErrorResponseMessage = false;
                                            $scope.showSuccessResponseMessage = true;
                                            $scope.errorResponseMessage = "";
                                            $scope.loadingAddBusTrip = false;



                                            loadBusTrips();

                                        }

                                        $scope.loadingAddBusTrip = false;
                                    },
                                        function error(response) {
                                        });
                            }
                        });
                }

                // edit Bus
                $scope.showEditBusModal = function (Bus) {
                    $scope.BusName = Bus.FleetNumber;
                    $scope.BusTripID = Bus.BusTripID;
                    $scope.LocationIDFrom = Bus.LocationIDFrom;
                    $scope.LocationIDTo = Bus.LocationIDTo;
                    $scope.Amount = Bus.Amount
                    $scope.StationFee = Bus.StationFee
                    $scope.BusStatusID = Bus.BusStatusID;

                    $scope.loadingAddBusTrip = false;
                    $scope.AddOrEdit = 0;

                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";
                    $scope.DisableButton = false;
                }


                // view Bus
                $scope.ViewBus = function () {

                    if ($scope.searchNumberPlate !== '') {

                        var args = {
                            NumberPlate: $scope.searchNumberPlate
                        }
                        //alert(JSON.stringify(passingArguments));
                        $http({
                            method: "POST",
                            url: "Mathree.asmx/SetNumberPlateIDSession",
                            dataType: 'json',
                            responseType: 'json',
                            data: JSON.stringify(args),
                            headers: { "Content-Type": "application/json" }
                        }).then(function (response) {
                            if (response.status.toString() === "200") {

                                $window.location.href = 'BusProfile.aspx';
                            }

                        });
                    }



                }

                $scope.ViewBusPayments = function (Bus) {

                    var args = {
                        BusID: Bus.BusID
                    }


                    //alert(JSON.stringify(passingArguments));
                    $http({
                        method: "POST",
                        url: "Mathree.asmx/SetBusIDSession",
                        dataType: 'json',
                        responseType: 'json',
                        data: JSON.stringify(args),
                        headers: { "Content-Type": "application/json" }
                    }).then(function (response) {
                        if (response.status.toString() === "200") {
                            loadBusPayments();
                        }

                    });
                }


                // view Bus
                $scope.ViewBusTrips = function (Bus) {

                    var args = {
                        BusID: Bus.BusID
                    }


                    //alert(JSON.stringify(passingArguments));
                    $http({
                        method: "POST",
                        url: "Mathree.asmx/SetBusIDSession",
                        dataType: 'json',
                        responseType: 'json',
                        data: JSON.stringify(args),
                        headers: { "Content-Type": "application/json" }
                    }).then(function (response) {
                        if (response.status.toString() === "200") {
                            BusTrips();
                        }

                    });
                }

               
            }
        ]);

                  
   

    Mathree.controller("UserCtrl",
        [
            "$scope", "$http", "$resource", "NgTableParams", "$window", "$sce",
            function ($scope, $http, $resource, NgTableParams, $window, $sce) {
                $scope.loading = true;

                loadUserPayments();

                // get BusPayments
                function loadUserPayments() {

                    var Api = $resource("Mathree.asmx/GetUserPayments");
                    $scope.tableParams = new NgTableParams({},
                        {
                            getData: function (params) {
                                return Api.query(params.url()).$promise.then(function (data) {
                                    params.total(data.length); // recal. page nav 

                                    $scope.loading = false;
                                    $scope.BusPayments = data;

                                    if (Object.keys($scope.BusPayments).length > 0) {
                                        $scope.tableParams = new NgTableParams({}, { dataset: $scope.BusPayments });
                                    }
                                    return data;
                                });
                            }
                        });

                }


            }
        ]);


    Mathree.controller("RegisterCtrl",
        [
            "$scope", "$http", "$resource", "NgTableParams", "$window", "$sce",
            function ($scope, $http, $resource, NgTableParams, $window, $sce) {
                $scope.loading = false;

                $scope.UserID = "0";
                $scope.FirstName = "";
                $scope.LastName = "";
                $scope.Email = "";
                $scope.PhoneNumber = "";
                $scope.Gender = "M";
                $scope.Address = "";
                $scope.Password = "";
                $scope.ConfirmPassword = "";


                // error fields
                $scope.showErrorResponseMessage = false;
                $scope.showSuccessResponseMessage = false;
                $scope.errorResponseMessage = "";
                $scope.DisableButton = false;


                $scope.Redirect = function () {
                    $window.location.href = "/Login.aspx";
                }

                $scope.signUp = function () {

                    $scope.DisableButton = true;
                    $scope.loading = true;

                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";


                    if ($scope.FirstName === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide your first name.";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }

                    if ($scope.LastName  === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide your last name.";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }

                    if ($scope.Email === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide your Email name.";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }

                    if ($scope.PhoneNumber === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide your Phone Number.";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }


                    if ($scope.PassWord === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please provide your password.";
                        $scope.DisableButton = false;
                        $scope.loadingAddBus = false;
                        return;
                    }
                    if ($scope.ConfirmPassword !== $scope.PassWord) {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "passwords do no match.";
                        $scope.DisableButton = false;
                        $scope.loadingAddBus = false;
                        return;
                    }



                    var args = {}

                        args = {

                            UserID: $scope.UserID,
                            FirstName: $scope.FirstName,
                            LastName: $scope.LastName,
                            Email: $scope.Email,
                            PhoneNumber: $scope.PhoneNumber,
                            Gender: $scope.Gender,
                            Address: $scope.Address,
                            PassWord: $scope.PassWord
                        }

                    $http(
                        {
                            method: 'POST',
                            url: 'Mathree.asmx/SaveDetails',
                            dataType: 'json',
                            responseType: 'json',
                            data: JSON.stringify(args),
                            headers: { "Content-Type": "application/json" }
                        }).then(function (response) {
                            if (response.status.toString() === "200") {
                                // check for error messages
                                $http.post("Mathree.asmx/CheckForErrorMessages")
                                    .then(function success(response) {

                                        var errorMessage = response.data.Message;
                                        if (errorMessage !== "") {
                                            $scope.showErrorResponseMessage = true;
                                            $scope.showSuccessResponseMessage = false;
                                            $scope.errorResponseMessage =
                                                "Error saving Details Error: '" + errorMessage + "'";
                                            $scope.DisableButton = false;
                                            $scope.loading = false;

                                        } else {

                                            $scope.showErrorResponseMessage = false;
                                            $scope.showSuccessResponseMessage = true;
                                            $scope.errorResponseMessage = "";
                                            $scope.loading = false;


                                            $scope.UserID = "0";
                                            $scope.FirstName = "";
                                            $scope.LastName = "";
                                            $scope.Email = "";
                                            $scope.PhoneNumber = "";
                                            $scope.Gender = "M";
                                            $scope.Address = "";
                                            $scope.Password = "";
                                            $scope.ConfirmPassword = "";

                                            $scope.Redirect();

                                        }

                                    },
                                        function error(response) {
                                                console.log(response)
                                        });
                            }
                        });
                }


            }
        ]);



   
    Mathree.controller("OrdersCtrl",
        [
            "$scope", "$http", "$resource", "NgTableParams", "$window", "$sce",
            function ($scope, $http, $resource, NgTableParams, $window, $sce) {
                $scope.loading = false;

                $scope.Refno = ""
                $scope.CustomerName = ""
                $scope.CustomerEmail = ""
                $scope.CustomerPhoneNumber = ""
                $scope.DeliveryDetails = ""
                $scope.DeliveryLocation = ""
                $scope.DeliveryAmount = ""
                $scope.Status = ""
                $scope.Paid = ""
                $scope.OrderStatusID = "0"

                loadOrders();

                function loadOrders() {

                    var Api = $resource("Mathree.asmx/GetOrders");
                    $scope.tableParams = new NgTableParams({},
                        {
                            getData: function (params) {
                                return Api.query(params.url()).$promise.then(function (data) {
                                    params.total(data.length); // recal. page nav 

                                    $scope.loading = false;
                                    $scope.Orders = data;

                                    if (Object.keys($scope.Orders).length > 0) {
                                        $scope.tableParams = new NgTableParams({}, { dataset: $scope.Orders });
                                    }
                                    return data;
                                });
                            }
                        });

                }

              


                $scope.ViewOrder = function (Order) {

                    var args = {
                        Refno: Order.Refno
                    }


                    //alert(JSON.stringify(passingArguments));
                    $http({
                        method: "POST",
                        url: "Mathree.asmx/SetRefnoSession",
                        dataType: 'json',
                        responseType: 'json',
                        data: JSON.stringify(args),
                        headers: { "Content-Type": "application/json" }
                    }).then(function (response) {
                        if (response.status.toString() === "200") {
                            loadDetailedOrders()
                            loadCustomerOrderDetails()
                        }

                    });
                }

                $scope.ChangeOrderStatus = function (Order) {
                    $scope.Refno = Order.Refno
                    $scope.OrderStatusID = Order.OrderStatusID

                }

                function loadDetailedOrders() {
                    $scope.loading = true;
                    var Api = $resource("Mathree.asmx/GetDetailedOrders");
                    $scope.tableParamsOrder = new NgTableParams({},
                        {
                            getData: function (params) {
                                return Api.query(params.url()).$promise.then(function (data) {
                                    params.total(data.length); // recal. page nav 

                                    $scope.loading = false;
                                    $scope.Orderdetails = data;

                                    if (Object.keys($scope.Orderdetails).length > 0) {
                                        $scope.tableParamsOrder = new NgTableParams({}, { dataset: $scope.Orderdetails });
                                    }
                                    return data;
                                });
                            }
                        });

                }

                function loadCustomerOrderDetails() {

                    $scope.loading = true;
                    $http.post('Mathree.asmx/GetCustomerOrderDetails')
                        .then(function (response) {
                            $scope.CustomerOrderDetails = response.data[0];

                            $scope.Refno = $scope.CustomerOrderDetails.Refno
                            $scope.CustomerName = $scope.CustomerOrderDetails.CustomerName
                            $scope.CustomerEmail = $scope.CustomerOrderDetails.CustomerEmail
                            $scope.CustomerPhoneNumber = $scope.CustomerOrderDetails.CustomerPhoneNumber
                            $scope.DeliveryDetails = $scope.CustomerOrderDetails.DeliveryDetails
                            $scope.DeliveryLocation = $scope.CustomerOrderDetails.DeliveryLocation
                            $scope.DeliveryAmount = $scope.CustomerOrderDetails.DeliveryAmount
                            $scope.Status = $scope.CustomerOrderDetails.Status
                            $scope.Statuscss = $scope.CustomerOrderDetails.Statuscss
                            $scope.Paid = $scope.CustomerOrderDetails.Paid
                            $scope.Paidcss = $scope.CustomerOrderDetails.Paidcss

                        }).finally(function () {
                            $scope.loading = false;
                        });
                }

                $scope.UpdateOrderStatus = function () {

                    $scope.DisableButton = true;
                    $scope.loading = true;
                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";


                    if ($scope.Refno === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please select a order.";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }
                    if ($scope.OrderStatusID === "0") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please select a  status.";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }
                    var args = {
                        Refno: $scope.Refno,
                        OrderStatusID: $scope.OrderStatusID

                    }

                    $http(
                        {
                            method: 'POST',
                            url: 'Mathree.asmx/UpdateOrderStatus',
                            dataType: 'json',
                            responseType: 'json',
                            data: JSON.stringify(args),
                            headers: { "Content-Type": "application/json" }
                        }).then(function (response) {
                            if (response.status.toString() === "200") {
                                // check for error messages
                                $http.post("Mathree.asmx/CheckForErrorMessages")
                                    .then(function success(response) {

                                        var errorMessage = response.data.Message;
                                        if (errorMessage !== "") {
                                            $scope.showErrorResponseMessage = true;
                                            $scope.showSuccessResponseMessage = false;
                                            $scope.errorResponseMessage =
                                                "" + errorMessage + "";
                                            $scope.DisableButton = false;
                                            $scope.loading = false;

                                        } else {

                                            $scope.showErrorResponseMessage = false;
                                            $scope.showSuccessResponseMessage = true;
                                            $scope.errorResponseMessage = "";
                                            $scope.loading = false;
                                            $scope.DisableButton = false;

                                            loadOrders();
                                            $scope.Refno = ""
                                        }

                                    },
                                        function error(response) {
                                        });
                            }
                        });
                }

            }
        ]);


    Mathree.controller("AllMenuCtrl",
        [
            "$scope", "$http", "$resource", "NgTableParams", "$window", "$sce",
            function ($scope, $http, $resource, NgTableParams, $window, $sce) {
                $scope.loading = false;


                loadMenu();

                function loadMenu() {

                    var Api = $resource("Mathree.asmx/GetMenu");
                    $scope.tableParams = new NgTableParams({},
                        {
                            getData: function (params) {
                                return Api.query(params.url()).$promise.then(function (data) {
                                    params.total(data.length); // recal. page nav 

                                    $scope.loading = false;
                                    $scope.Menu = data;

                                    if (Object.keys($scope.Menu).length > 0) {
                                        $scope.tableParams = new NgTableParams({}, { dataset: $scope.Menu });
                                    }
                                    return data;
                                });
                            }
                        });

                }




                $scope.showAddMenuModal = function () {

                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";
                    $scope.loading = false;

                    $scope.MenuID = "0"
                    $scope.Category = ""
                    $scope.Title = ""
                    $scope.Description = ""
                    $scope.Amount = ""
                    $scope.IsActive = ""
                }
                $scope.Close = function () {

                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";
                    $scope.loading = false;

                    $scope.MenuID = "0"
                    $scope.Category = ""
                    $scope.Title = ""
                    $scope.Description = ""
                    $scope.Amount = ""
                    $scope.IsActive = ""
                }


                $scope.showEditModal = function (Menu) {
                  
                    $scope.MenuID = Menu.ID
                    $scope.Category = Menu.Category
                    $scope.Title = Menu.Title
                    $scope.Description = Menu.Description
                    $scope.Amount = Menu.Amount
                    $scope.IsActive = Menu.IsActive


                }
                $scope.showDeleteModal = function (Menu) {
                    $scope.MenuID = Menu.ID
                }

                $scope.delete = function () {

                    $scope.DisableButton = true;
                    $scope.loading = true;
                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";


                    if ($scope.MenuID === "0") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please select a menu item.";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }

                    var args = {
                        MenuID: $scope.MenuID
                    }

                    $http(
                        {
                            method: 'POST',
                            url: 'Mathree.asmx/DeleteMenu',
                            dataType: 'json',
                            responseType: 'json',
                            data: JSON.stringify(args),
                            headers: { "Content-Type": "application/json" }
                        }).then(function (response) {
                            if (response.status.toString() === "200") {
                                // check for error messages
                                $http.post("Mathree.asmx/CheckForErrorMessages")
                                    .then(function success(response) {

                                        var errorMessage = response.data.Message;
                                        if (errorMessage !== "") {
                                            $scope.showErrorResponseMessage = true;
                                            $scope.showSuccessResponseMessage = false;
                                            $scope.errorResponseMessage =
                                                "" + errorMessage + "";
                                            $scope.DisableButton = false;
                                            $scope.loading = false;

                                        } else {

                                            $scope.showErrorResponseMessage = false;
                                            $scope.showSuccessResponseMessage = true;
                                            $scope.errorResponseMessage = "";
                                            $scope.loading = false;
                                            $scope.DisableButton = false;

                                            loadMenu();
                                            $scope.MenuID = "0"
                                        }

                                    },
                                        function error(response) {
                                        });
                            }
                        });
                }


                $scope.saveMenu = function () {

                    $scope.DisableButton = true;
                    $scope.loading = true;
                    $scope.showErrorResponseMessage = false;
                    $scope.showSuccessResponseMessage = false;
                    $scope.errorResponseMessage = "";


                    if ($scope.Category === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please select the category";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }
                    if ($scope.Title === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please enter the title.";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }
                    if ($scope.Amount === "") {
                        $scope.showErrorResponseMessage = true;
                        $scope.showSuccessResponseMessage = false;
                        $scope.errorResponseMessage = "Please enter the amount.";
                        $scope.DisableButton = false;
                        $scope.loading = false;
                        return;
                    }
                    var args = {
                        MenuID: $scope.MenuID,
                        Category: $scope.Category,
                        Title: $scope.Title,
                        Amount: $scope.Amount,
                        Description: $scope.Description,
                        IsActive: $scope.IsActive

                    }

                    $http(
                        {
                            method: 'POST',
                            url: 'Mathree.asmx/SaveMenu',
                            dataType: 'json',
                            responseType: 'json',
                            data: JSON.stringify(args),
                            headers: { "Content-Type": "application/json" }
                        }).then(function (response) {
                            if (response.status.toString() === "200") {
                                // check for error messages
                                $http.post("Mathree.asmx/CheckForErrorMessages")
                                    .then(function success(response) {

                                        var errorMessage = response.data.Message;
                                        if (errorMessage !== "") {
                                            $scope.showErrorResponseMessage = true;
                                            $scope.showSuccessResponseMessage = false;
                                            $scope.errorResponseMessage =
                                                "" + errorMessage + "";
                                            $scope.DisableButton = false;
                                            $scope.loading = false;

                                        } else {

                                            $scope.showErrorResponseMessage = false;
                                            $scope.showSuccessResponseMessage = true;
                                            $scope.errorResponseMessage = "";
                                            $scope.loading = false;
                                            $scope.DisableButton = false;

                                            loadMenu();
                                            $scope.MenuID = "0"
                                        }

                                    },
                                        function error(response) {
                                        });
                            }
                        });
                }

            }
        ]);
})();