angular.module('mainCtrl', [])

.controller('MainController', function($rootScope, $location, Auth) {

    var vm = this;
    vm.loggedIn = Auth.isLogged();
    $rootScope.$on('$routeChangeStart', function(){
        vm.loggedIn = Auth.isLoggedIn();
        Auth.getUser()
            .then(function(data){
                vm.user = data.data;
            });
    });

    vm.doLogin = function(){

        vm.processing = true;
        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
            .success(function(data) {
                vm.processiong = false;
                Auth.getUser()
                    .then(function(data){
                        vm.user = data.data;
                    });

                $(data.success){
                    $location.path('/')
                }
            });
    }

    vm.doLogout = function(){
        Auth.logout();
        $location.path('/logout');
    }
    
})