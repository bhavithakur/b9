angular.module('behave.auth.controllers', []).controller('WelcomeCtrl', function($scope, $state, $ionicModal) {
    $scope.bgs = ["img/welcome-bg.jpg"];
    $scope.facebookSignIn = function() {
        console.log("doing facebook sign in");
        $state.go('app.feed');
    };
    $ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacy_policy_modal = modal;
    });
    $ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.terms_of_service_modal = modal;
    });
    $scope.showPrivacyPolicy = function() {
        $scope.privacy_policy_modal.show();
    };
    $scope.showTerms = function() {
        $scope.terms_of_service_modal.show();
    };
}).controller('CreateAccountCtrl', function($scope, $state,AuthService,$rootScope) {
    $scope.user={
        name:"",
        username:"",
        password:"",
        email:""
    };
    $scope.doSignUp = function() {
        AuthService.createUser($scope.user,function(response){
            if(response.data.status=="success")
            {
                        AuthService.getLoggedUser($scope.user, function(response) {
            if (response) {
                $rootScope.loggedUser = response;
                $state.go('app.feed');
                console.log($rootScope.loggedUser);
            } else alert("Wrong username");
        });
            }
            else{
                alert("User Exists");
            }
        },function(error){
            alert("Error happened");
        });
    };
}).controller('WelcomeBackCtrl', function($scope, $state, $ionicModal, AuthService, $rootScope) {
    $scope.loginData = {
        username: "",
        password: ""
    };
    $scope.doLogIn = function() {
        console.log("doing log in");
        AuthService.getLoggedUser($scope.loginData, function(response) {
            if (response) {
                $rootScope.loggedUser = response;
                $state.go('app.feed');
                console.log($rootScope.loggedUser);
            } else alert("Wrong username");
        });
        console.log($rootScope.loggedUser);
    };
    $ionicModal.fromTemplateUrl('views/auth/forgot-password.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.forgot_password_modal = modal;
    });
    $scope.showForgotPassword = function() {
        $scope.forgot_password_modal.show();
    };
    $scope.requestNewPassword = function() {
        console.log("requesting new password");
    };
    // //Cleanup the modal when we're done with it!
    // $scope.$on('$destroy', function() {
    //   $scope.modal.remove();
    // });
    // // Execute action on hide modal
    // $scope.$on('modal.hidden', function() {
    //   // Execute action
    // });
    // // Execute action on remove modal
    // $scope.$on('modal.removed', function() {
    //   // Execute action
    // });
}).controller('ForgotPasswordCtrl', function($scope) {});