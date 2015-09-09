(function () {
    'use strict';

    angular
        .module('app')
        .controller('controller', controller);

    controller.$inject = ['$location', 'Hub', '$rootScope'];

    function controller($location,Hub,$rootScope) {
        /* jshint validthis:true */
        var vm = this;

        vm.Estado = 'desconectado';

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
                        vm.Estado = 'conectando';                        
                        console.log(vm.Estado);
                        $rootScope.$apply();
                        break;
                    case $.signalR.connectionState.connected:
                        vm.Estado = 'conectado';
                        console.log(vm.Estado);
                        $rootScope.$apply();
                        break;
                    case $.signalR.connectionState.reconnecting:
                        vm.Estado = 'reconectando';
                        console.log(vm.Estado);
                        $rootScope.$apply();
                        break;
                    case $.signalR.connectionState.disconnected:
                        vm.Estado = 'desconectado';
                        console.log(vm.Estado);
                        $rootScope.$apply();
                        break;
                }
            }
        });

        vm.Reconectar = function () {

            $.signalR.chatHub.connection.start();
        };


        vm.Enviar = function () {
            var mensaje = { Nombre: vm.Nombre, Mensaje: vm.message };
            console.log(mensaje);
            hub.send(vm.Nombre, vm.message);
            //vm.Mensajes.push(mensaje);
            vm.message = null;
        };
    }
})();
