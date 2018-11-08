let app = angular.module('fabric-system-front-end', [
    'ngStorage',
    'ngRoute'
]);

//Configure the constants
// app.constant(
//     'host_url', 'http://localhost:3001/admin/');
app.constant(
    'host_url', 'http://fabric.projects.uom.lk/admin/');

//Spcket server 
// app.constant(
//     'socket_server_url', 'http://localhost:3001');
app.constant(
    'socket_server_url', 'http://fabric.projects.uom.lk');