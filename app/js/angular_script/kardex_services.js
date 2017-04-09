var appKardex = angular.module("miapp", ['ngRoute', 'angular-jwt','Alertify']);

appKardex.service('autenticar', function (jwtHelper) {
    this.comprobarToken = function () {
        if (sessionStorage.getItem("token")) {
            if (!(jwtHelper.isTokenExpired(sessionStorage.getItem("token")))) {
                return true;
            }
        }
        return false;
    }
});


