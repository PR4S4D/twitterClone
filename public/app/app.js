angular.module('MyApp',['mainCtrl','authService','appRoutes','userCtrl','userService'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
});