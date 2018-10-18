app.config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider){

    $routeProvider
        .when("/home", {
            //Home page
            templateUrl : "src/views/home-page.html",
            controller: 'MainController',
            resolve:{
                init : function () {
                    //Nothing here for now
                    console.log('home page route triggered');
                }
            }
        })
        .when("/process", {
            //Home page
            templateUrl : "src/views/capture-page.html",
            controller: 'MainController',
            resolve:{
                init : function () {
                    //Nothing here for now
                    console.log('capture page route triggered');
                }
            }
        })
        .otherwise({redirectTo: '/home'});

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
        // $locationProvider.hashPrefix('!');
}]);