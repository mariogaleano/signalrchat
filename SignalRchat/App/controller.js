(function () {
    'use strict';

    angular
        .module('app')
        .controller('controller', controller);

    controller.$inject = ['$location', 'Hub', '$rootScope'];

    function controller($location,Hub,$rootScope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'controller';
        //vm.Nombre = 'Mario';
        vm.Mensajes = [];

        vm.SetNombre = function () {
            vm.NombreListo = true;
        };

        var hub = new Hub('chathub', {

            //client side methods
            listeners: {
                'broadcastMessage': function (name, message) {
                    var mensaje = { Nombre: name, Mensaje: message };
                    console.log(mensaje);
                    //hub.send(vm.name, vm.message);
                    vm.Mensajes.push(mensaje);
                    $rootScope.$apply();
                }               
            },

            //server side methods
            methods: ['send'],

            //query params sent on initial connection
            //queryParams: {
            //    'token': 'exampletoken'
            //},

            //handle connection error
            errorHandler: function (error) {
                console.error(error);
            },

            //specify a non default root
            //rootPath: '/api

            stateChanged: function (state) {
                switch (state.newState) {
                    case $.signalR.connectionState.connecting:
                        //your code here
                        break;
                    case $.signalR.connectionState.connected:
                        //your code here
                        break;
                    case $.signalR.connectionState.reconnecting:
                        //your code here
                        break;
                    case $.signalR.connectionState.disconnected:
                        //your code here
                        break;
                }
            }
        });

        vm.Enviar = function () {
            var mensaje = { Nombre: vm.Nombre, Mensaje: vm.message };
            console.log(mensaje);
            hub.send(vm.Nombre, vm.message);
            //vm.Mensajes.push(mensaje);
        };
    }
})();
