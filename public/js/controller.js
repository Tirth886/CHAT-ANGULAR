"use strict";

const app = angular.module("myApp",['ngSanitize','ngRoute']);

/*
	Routing Page with its controller
*/
app.config(function($routeProvider) {
	$routeProvider.when('/',{
		templateUrl: '../view/home.html',
		controller: 'hmeCtrl'
	}).when('/login', {
		resolve: {
			check: function ($location, user){
				if(user.isUserLoggedIn()){
					$location.path("/dashboard");
				}else{}
			},
		},
		templateUrl: '../view/login.html',
		controller: 'loginCtrl'
	}).when('/register', {
		templateUrl: '../view/register.html',
		controller: 'registerCtrl'
	}).when('/dashboard', {
		resolve: {
			check: function ($location, user){
				if(!user.isUserLoggedIn()){
					$location.path("/login");
				}else{}
			},
		},
		templateUrl: '../view/dashboard.html',
		controller: 'dashbordCtrl'
	}).when("/logout", {
		resolve: {
			deadResolve: function($http, $location, user){
				$http({
					url: 'http://localhost/project/controller/server.php',
					method: 'POST',
					data: 'action='+'logout',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(response){
					console.log(response);
					if(response.data.logoutStatus){
						user.clearData();
						$location.path("/");
					}else{
						console.log("Check....!");
					}
				});
			},
		},
	}).otherwise({
		template: '404'
	});

});
	
/*
	App Services setting up Value or getting up value
*/

app.service('user', function() {
	var username;
	var id;
	var email;
	var password;
	var loggedIn = false;
	this.getId = function(){
		return id;
	};
	this.getname = function() {
		return username;
	};
	this.getemail = function(){
		return email;
	};
	this.isUserLoggedIn = function() {
		if(localStorage.getItem('login')){
			// console.log(localStorage.getItem('login'));	
			loggedIn = true;
			var data = JSON.parse(localStorage.getItem('login'));
			// console.log(data);
			id = data.id;
			username = data.username;
			email = data.email;
		}
		return loggedIn;
	};

	this.saveData = function (data) {
		id = data.id;
		username = data.user;
		email = data.email;
		password = data.password;
		loggedIn = true;

		/*
			Saving Data to Local Storage
		*/

		localStorage.setItem('login', JSON.stringify({
			id: id,
			username: username,
			email: email,
			password: password 
		}));
	};

	this.clearData = function () {
		localStorage.removeItem('login');
		username = "";
		id = "";
		email = "";
		password = "";
		loggedIn = false;
	};
});

/*
	Controller 
*/

app.controller('hmeCtrl', function($scope, $location){
	$scope.userlogin = function() {
		$location.path('/login');
	}
	$scope.userregister = function() {
		$location.path('/register');
	}
});

app.controller('loginCtrl', function($scope, $location, $http, user){
	$scope.login = function() {
		var email = $scope.email;
		var password = $scope.password;
		
		var data = 'email='+email+'&password='+password+'&action='+'login';
		console.log(data);

		$http({
			url: 'http://localhost/project/controller/server.php',
			method: 'POST',
			data: data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(response){
			// console.log(response.data.user);
			if(response.data.err){
				$scope.eerr = response.data.err.eerr;
				console.log($scope.eerr);
				$scope.perr = response.data.err.perr;
			}else if(response.data.value == true){
				// user.userLoggedIn();
				// user.setname(response.data.user);
				user.saveData(response.data);
				$location.path("/dashboard");
			}else{
				$scope.invalid = response.data.invalid;
			}
		})
	}
});

app.controller('registerCtrl', function($scope, $location, $http){

	$scope.blackVlaue = () =>{
		$scope.username = "";
		$scope.email 	= "";
		$scope.password = "";
	}
	$scope.register = function(){
		// console.log("helo");
		var username = $scope.username;
		var email = $scope.email;
		var password = $scope.password;

		var data = 'username='+username+'&email='+email+'&password='+password+'&action='+'register';
		console.log(data);

		$http({
			url: 'http://localhost/project/controller/server.php',
			method: 'POST',
			data: data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(response){
			console.log(response.data);
			if(response.data.err){
				// console.log(response.data.err);
				$scope.nerr = response.data.err.nerr;
				console.log($scope.nerr);
				$scope.eerr = response.data.err.eerr;
				$scope.perr = response.data.err.perr;
			}
			else if(response.data.value==true){
				console.log(response.data.status);
				$scope.status = response.data.status;
				$scope.blackVlaue();
			}else{
				console.log(response.data.failure);
				console.log(response.data.isExist);
				$scope.failure = response.data.failure;
				$scope.isExist = response.data.isExist;
			}
		})
	}
});

app.controller('dashbordCtrl', function($scope, $location, user, $http, $interval){
	$scope.id   = user.getId();
	$scope.user = "Wellcome, "+user.getname();
	$scope.email = "(' "+user.getemail()+" ')";
	$scope.messageno = "No Friend yet";

	$interval(function(){
		$scope.getFriends($scope.id);
	},1000)

	$scope.getFriends = function(userId){

		var data = "userId="+userId+"&action="+"friendlist";
		// console.log(data);
		$http({
			url: 'http://localhost/project/controller/server.php',
			method: 'POST',
			data: data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}	
		}).then(function(response){
			console.log(response.data);
			if(response.data.response){
				// console.log("Dost areha ha");
				$scope.myFriends = response.data.myFriends;
				$scope.totalFriends = "<h1>Friend's (' "+response.data.totalfrend+" ')</h1>";
				$scope.err = false;	
			}else{
				$scope.err = true;
				$scope.message = response.data.message;
			}
		});
	}
	// getting the value from outside the ng-repeat block
	$scope.change  = function(fid, fname){
		$scope.saveinfo = fid+"_"+fname;
		// $scope.receivemsginfo(fid);
		$scope.sendmsginfo(fid);
	} 
	//inserting message
	$scope.sendmsg = function (information){
		var fromid = $scope.id;
		var fid   = information.split("_")[0];
		var fname = information.split("_")[1].split(" ")[2]; 
		var message = $scope.message;
		var data = "fromid="+fromid+"&fid="+fid+"&fname="+fname+"&message="+message+"&action="+"send";
		console.log(data);
		$http({
			url: 'http://localhost/project/controller/server.php',
			method: 'POST',
			data: data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(response){
			if(response.data.status){
				$scope.sendmsginfo(fid);
				// $scope.receivemsginfo(fid);
				$scope.message = "";
			}else{
				// console.log(response.data);
			}
		});
	}

	$scope.sendmsginfo = function (toid){
		// console.log(fromid+"+"+toid);
		var fromid = $scope.id;
		var toid = toid;
		var data = "fromid="+fromid+"&toid="+toid+"&action="+"sendmsg";

		$http({
			url: 'http://localhost/project/controller/server.php',
			method: 'POST',
			data: data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(response){
			console.log(response.data);
			if(response.data.isSucess){
				$scope.mymessage = response.data.mymessage;
				console.log($scope.mymessage);
				$scope.isStatus = true;
				// console.log($scope.imessage);
			}else{
				$scope.status   = response.data.status;
				$scope.isStatus = false;
			}
		});
	
	}
});