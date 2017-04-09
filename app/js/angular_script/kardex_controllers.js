appKardex.controller("CtrlProduct", ['$http', "autenticar","jwtHelper","Alertify","$location", function ($http, autenticar,jwtHelper,Alertify,$location) {

    var self = this;
    self.init = function () {
        self.product={};
        self.product.prod_estado="ACTIVO";
        self.date = new Date();
        self.product.prod_fecha = self.date.getFullYear() + "-" + (self.date.getMonth()+1) + "-" + self.date.getDate();
        self.categories = [];
        self.units = [];

        self.urlGetCategories = "http://localhost/apiKardex/web/app_dev.php/api/categories";
        $http.get(self.urlGetCategories, {})
            .then(function (respuesta) {
                self.resp_categories = angular.fromJson(respuesta.data);
                if (self.resp_categories != "") {
                    $.each(self.resp_categories, function (i, item) {
                        self.categories.push({"id": item['ca_id_categoria'], "nombre": item['ca_descripcion']});
                    });
                }
            })


        self.urlGetUnits = "http://localhost/apiKardex/web/app_dev.php/api/measures";
        $http.get(self.urlGetUnits, {})
            .then(function (respuesta) {
                self.resp_units = angular.fromJson(respuesta.data);
                if (self.resp_units != "") {
                    $.each(self.resp_units, function (i, item) {
                        self.units.push({"id": item['um_id_unidad'], "nombre": item['um_descripcion']});
                    });
                }
            })

    }


    self.addProduct = function () {
        if(autenticar.comprobarToken()){
            self.loading=true;
            self.token=sessionStorage.getItem("token");
            var tokenPayload = jwtHelper.decodeToken(self.token);
            self.datos = {
                "prod_nombre": self.product.prod_nombre,
                "prod_detalle": self.product.prod_detalle,
                "prod_codigo": self.product.prod_codigo,
                "prod_estado": self.product.prod_estado,
                "prod_stock": 0,
                "prod_precio_unitario": 0,
                "prod_precio_total": 0,
                "prod_fecha_ingreso": self.product.prod_fecha,
                "ca_categoria": self.product.idcategoriaSeleccionada,
                "um_unidad": self.product.idunidadSeleccionada,
                "us_usuario": tokenPayload['id_user']
            };

            var config = {
                method: "POST",
                url: "http://localhost/apiKardex/web/app_dev.php/api/products",
                data: JSON.stringify(self.datos)
            }
            $http(config)
                .then(function (response) {
                    if (response.status == 201) {
                        self.loading=false;
                        self.product={};
                        self.init();
                        Alertify.success("Producto Añadido Correctamente!");
                    }
                }, function () {
                });

        }else{
            Alertify.error("Usuario debe autenticarse para realizar esta petición!");
            $location.path('/login');
        }

    }

}]);


appKardex.controller("CtrlEntryOrder", ['$http', "autenticar","jwtHelper","Alertify","$location", function ($http, autenticar,jwtHelper,Alertify,$location) {

    var self = this;
    self.init = function () {
        self.entry={};
        self.products=[];
        self.providers=[];
        self.date = new Date();
        self.entry.entry_date = self.date.getFullYear() + "-" + (self.date.getMonth()+1) + "-" + self.date.getDate();

        self.urlGetProducts = "http://localhost/apiKardex/web/app_dev.php/api/products";
        $http.get(self.urlGetProducts, {})
            .then(function (respuesta) {
                self.resp_products = angular.fromJson(respuesta.data);
                if (self.resp_products != "") {
                    $.each(self.resp_products, function (i, item) {
                        self.products.push({"id": item['prod_id_producto'], "nombre": item['prod_nombre']});
                    });
                }
            })

        self.urlGetProviders = "http://localhost/apiKardex/web/app_dev.php/api/providers";
        $http.get(self.urlGetProviders, {})
            .then(function (respuesta) {
                self.resp_providers = angular.fromJson(respuesta.data);
                if (self.resp_providers != "") {
                    $.each(self.resp_providers, function (i, item) {
                        self.providers.push({"id": item['pr_id_proveedor'], "nombre": item['pr_razon_social']});
                    });
                }
            })
    }

    self.addEntryOrder = function () {
        if(autenticar.comprobarToken()){
            self.loading=true;
            self.token=sessionStorage.getItem("token");
            var tokenPayload = jwtHelper.decodeToken(self.token);
            self.information = {
                "id_provider": self.entry.selectedProvider,
                "id_product": self.entry.selectedProduct,
                "quantity": self.entry.quantity,
                "unit_value": self.entry.unit_value,
                "total_value": (self.entry.quantity*self.entry.unit_value),
                "bill": self.entry.bill,
                "entry_date": self.entry.entry_date,
                "id_user": tokenPayload['id_user']
            };

            var config = {
                method: "POST",
                url: "http://localhost/apiKardex/web/app_dev.php/api/entryOrders",
                data: JSON.stringify(self.information)
            }
            $http(config)
                .then(function (response) {
                    if (response.status == 201) {
                        self.loading=false;
                        self.entry={};
                        self.init();
                        Alertify.success("Orden de Ingreso añadida Correctamente!");
                    }
                }, function () {
                });

        }else{
            Alertify.error("Usuario debe autenticarse para realizar esta petición!");
            $location.path('/login');
        }

    }

}]);





appKardex.controller('CtrlPrueba', function Controller(jwtHelper) {
    var self = this;

    self.pruebaToken = function () {

        var expToken = 'eyJhbGciOiJSUzI1NiJ9.eyJ1c2VybmFtZSI6ImphaGlyIiwiZXhwIjoxNDg4MzY5MTc5LCJpYXQiOjE0ODgzNjU1Nzl9.otCDoq9yK-3n9O_mUdAer9WnHX04PmJpbqZxLto4GCsnVKWEs7FqaqhVGT2dtl2RepjIH5-68SsMQl5FmCFwUtWoy7wdLIBOmcILgg0SrzluwKaCzPbVBh5IKdQrkuLcAwJ1oODTMyeUy27sbxHWeEHWmQFrOboHlOlIaAdTeGNK3RXsqt9GhDk7l0xUaIjsluKVbaBgdND1Ik4JU0VWn9N6sP1eo32fAxBOB6c178hcG6WvH6xPR01eufgozphYhEOu2QJTWb4TG0_ge8V5RF8dq02kd8Gv1sgmB2i1WAfpXCmUCiQKbKgQymEIkwywonU83CppbTu_rMfmIsxqpRiDDKisNH2bCHXfFZDwrVDrxLCXpQfEsd5ANbf3HCUHtYDLesUcIQwIxkQYirfQghmd_0zW5XwpLwLEmpdJFH61ME1gPrO11MMTHhP4R3FavlLYr19-INiNHM4C0-Pb7AQrfCKv5tshXR831b6NU12suoYPbBlyiWbrXBnq0ZGW0oLVxpBKCa-pD2yebtwk6OMq-ifn3_aYjGS4wLR8kkgiGe6zhD2q-eEvhG0fVZwA3O3u3iJMA6I1kvRrUeTboIU8W9TVs3NSI0_xoykbHlXQ90hES8cUYMn-aG8ubyZ98iXa5pK_l6EECsLHs5KGgxjYA-6DtDKBp2gSeIDiVMA';

        var tokenPayload = jwtHelper.decodeToken(expToken);
        alert(tokenPayload['username']);
        var date = jwtHelper.getTokenExpirationDate(expToken);
        alert(date);

    }
});


appKardex.controller("log", ['$http', "autenticar", function ($http, autenticar) {
    var self = this;
    self.auth = autenticar.comprobarToken();
    self.authError=false;


    self.login = function () {
        self.loading=true;
        self.username = self.inputUsername;
        self.password = self.inputPassword;

        self.datos = {"username": self.username, "password": self.password};
        var config = {
            method: "POST",
            url: "http://localhost/apiKardex/web/app_dev.php/api/token-authentication",
            data: JSON.stringify(self.datos)
        }
        $http(config)
            .then(function (response) {
                self.loading=false;
                if (response.status == 200) {
                    self.resp_token = angular.fromJson(response.data);
                    sessionStorage.setItem("token", self.resp_token['token']);
                    window.location.replace(window.location.pathname);
                } else {
                     self.inputUsername="";
                     self.inputPassword="";
                     self.authError=true;
                }
            }, function () {
            });
    }


    self.logout = function () {
        sessionStorage.removeItem("token");
        window.location.replace(window.location.pathname);
    }


}]);

