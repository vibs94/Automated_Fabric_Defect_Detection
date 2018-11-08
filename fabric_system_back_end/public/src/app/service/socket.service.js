/**
 * Created by prasanna_d on 9/13/2017.
 */

'use strict';
angular.module('fabric-system-front-end')
    .factory('socket', 
    function ($rootScope, socket_server_url) {
        console.log("Socket connect to: " + socket_server_url);
        var socket = io.connect(socket_server_url);
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {  
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            }
        };
    });