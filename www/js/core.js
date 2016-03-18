var app = angular.module('hackerApp',['ngRoute','hackerAppClientManager']);

app.config(function($routeProvider,$locationProvider){

      console.debug("Routing the views....");
      $routeProvider
      .when('/',{
           
           templateUrl:'./views/game.html'
           ,controller:'GameController'
           
           }
      );
});


