/**
 * Created by prasanna_d on 9/13/2017.
 */

'use strict';
angular.module('fabric-system-front-end')
    .factory('socket', function (LoopBackAuth) {
        let socket = io.connect('http://localhost:3000');
        let id = LoopBackAuth.accessTokenId;
        let userId = LoopBackAuth.currentUserId;
        socket.on('connect', function(){
            socket.emit('authentication', {id: id, userId: userId });
            socket.on('authenticated', function() {
                // use the socket as usual
                console.log('User is authenticated');
            });
        });
        return socket;
    });