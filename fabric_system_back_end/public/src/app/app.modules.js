let app = angular.module('fabric-system-front-end', [
    'ngStorage',
    'ngRoute'
]);

//Configure the constants
app.constant(
    'host_url', 'http://localhost:3000/admin/');

//Spcket server 
app.constant(
    'socket_server_url', 'http://localhost:3000');