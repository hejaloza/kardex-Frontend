appKardex.config(function ($routeProvider, jwtOptionsProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'log',
            controllerAs: 'ctrlLog'
        })
        .when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'log',
            controllerAs: 'ctrlLog'
        })
        .when('/prueba', {
            templateUrl: 'templates/addProduct.html',
            controller: 'CtrlProduct',
            controllerAs: 'CtrlProd'
        })
        .when('/orden-ingreso', {
            templateUrl: 'templates/entryOrder.html',
            controller: 'CtrlEntryOrder',
            controllerAs: 'CtrlIO'
        })
        .when('/orden-egreso', {
            templateUrl: 'templates/outputOrder.html',
            controller: 'CtrlEntryOrder',
            controllerAs: 'CtrlIngreso'
        })
        .when('/solicitar-producto', {
            templateUrl: 'templates/orderProduct.html',
            controller: 'CtrlEntryOrder',
            controllerAs: 'CtrlIngreso'
        })
        .otherwise({
            redirectTo: '/'
        });

});


appKardex.config([
    '$httpProvider',
    function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $location,Alertify) {
            return {
                'request': function (config) {
                    var token = sessionStorage.getItem("token");
                    if (token) {
                        config.headers.TOKEN = token;
                    }
                    return config;
                },
                'responseError': function (response) {
                    if (response.status == 401 || response.status == 500) {
                        sessionStorage.removeItem("token");
                        Alertify.error("Usuario no autorizado para realizar esta petición!");
                        $location.path('/login');
                    }
                    return response;

                }
            };
        });

    }
]);






