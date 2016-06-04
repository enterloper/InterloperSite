(function() {

  var site = angular.module('site', []);

  var MainController = function($scope, $http) {

    var onUserComplete = function(response) {
      $scope.user = response.data;
    };

    var onError = function(error) {
      $scope.error = "Could not fetch the user!"
    };

    $http.get("https://api.github.com/users/richardjboothe")
      .then(onUserComplete);


    $scope.message = "Hello, Angular!";

  };

  site.controller("MainController", ["$scope", "$http", MainController]);

}());