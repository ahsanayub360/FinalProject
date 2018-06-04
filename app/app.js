var app = angular.module('myApp', ['ngRoute'])
.config(function($routeProvider) { 
	$routeProvider
	.when("/form",{
		templateUrl:"form.html"
	//	controller="MainController"  *optional
	
})
	.when("/red", {
        templateUrl : "red.html"
    })

	
});
