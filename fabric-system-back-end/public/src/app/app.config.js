app.config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider){

    $routeProvider
        .when("/", {
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

        .otherwise({redirectTo: '/'});

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
        // $locationProvider.hashPrefix('!');
}]);