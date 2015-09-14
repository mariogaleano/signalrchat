(function () {
    'use strict';

    angular
        .module('app')
        .controller('controller', controller);

    controller.$inject = ['$location', 'Hub', '$rootScope', '$scope'];

    function controller($location, Hub, $rootScope, $scope) {
        /* jshint validthis:true */
        var vm = this;

        vm.Estado = 'desconectado';
        vm.listaGrupos = [];
        vm.MyGroup;

        vm.title = 'controller';
        //vm.Nombre = 'Mario';
        vm.Mensajes = [];
        vm.MensajesGrupo = [];

        vm.SetNombre = function () {
            vm.NombreListo = true;
            vm.GetGroups();
        };

        var hub = new Hub('chathub', {

            //client side methods
            listeners: {
                'broadcastMessage': function (name, message,groupname) {
                    var mensaje = { Nombre: name, Mensaje: message, groupName: groupname };
                    vm.Mensajes.push(mensaje);
                    $rootScope.$apply();
                },
                'grupocreado': function (groupname) {
                    vm.listaGrupos.push(groupname);
                    $rootScope.$apply();
                }
            },

            //server side methods
            methods: ['send', 'createroom', 'joinroom', 'leaveroom', 'getgroups'],

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


        $scope.$watch('vm.grupoSeleccionado', function (current, original) {
            if (original !== undefined) {
                if (current[0] !== original[0]) {
                    hub.joinroom(current[0]);
                }
            }
        });



        vm.Enviar = function () {
            var mensaje = { Nombre: vm.Nombre, Mensaje: vm.message };
            console.log(mensaje);
            hub.send(vm.Nombre, vm.message, vm.grupoSeleccionado[0]);            
            vm.message = null;
        };

        vm.CrearGrupo = function () {
            hub.createroom(vm.grupoNuevo);
            hub.joinroom(vm.grupoNuevo);
            vm.MyGroup = vm.grupoNuevo;
            //vm.listaGrupos.push(vm.grupoNuevo);
        };

        vm.SeleccionarGrupo = function () {
            vm.MyGroup = vm.selectedGroup;            
        };

        vm.GetGroups = function () {
            hub.getgroups().then(
                function (data) {
                    vm.listaGrupos = data;
                    console.log(vm.listaGrupos);
                    $rootScope.$apply();
                },
                function (error) { }
                );          
            
        };

        vm.SeleccionarGrupo = function () {
            hub.joinroom(vm.grupoSeleccionado[0]);
        };
    }
})();
