angular.module('mainCtrl', [])

.controller('MainController', function($rootScope, $location, Auth) {

    var vm = this;
    vm.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function(){
        vm.loggedIn = Auth.isLoggedIn();
        if(Auth.isLoggedIn()){
            Auth.getUser()
            .then(function(data){
                console.log(data.user);
                vm.user = data.data;
            });
        }
    });

    vm.doLogin = function(){     

        vm.processing = true;
        vm.error = '';

        Auth.login(vm.logindata.username, vm.logindata.password)
            .success(function(data) {
                vm.processiong = false;
                Auth.getUser()
                    .then(function(data){
                        vm.user = data.data;
                    });

                if(data.success){
                    $location.path('/');
                }else{
                    vm.error = data.message
                }
            });
    };

    vm.doLogout = function(){
        Auth.logout();
        $location.path('/logout');
    };
    
});