/**
 * Created by prasanna_d on 9/13/2017.
 */

'use strict';
angular.module('fabric-system-front-end')
    .factory('socket', function ($rootScope) {
        var socket = io.connect('http://localhost:3000');
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