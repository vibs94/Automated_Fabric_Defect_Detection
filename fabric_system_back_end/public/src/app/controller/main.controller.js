app.controller('MainController', [
    '$scope','$http','host_url', '$location', 'PageRefreshService',
    function($scope, $http,host_url, $location, PageRefreshService){
        $scope.images = [];
        $scope.batch_names = [];

        let socket = io.connect('http://localhost:3000');
        let showErrorMessage = function(message){alert(message);};

        socket.on('fabric_defect_server', function(msg){
            let file_path = msg.path;
            let file_path_processed = msg.processed_path;

            let obj = {
                file: file_path, file_processed: file_path_processed,
                defect_count: -1,
                defects: [
                    {name: 'test_value', confidence: '-1'},
                    {name: 'test_value2', confidence: '-2'},
                ]
            };

            let isExit = false;
            $scope.images.forEach(function(entry) {
                if(entry.file===obj.file){isExit = true;}
            });
            if(!isExit){$scope.images.push(obj)}
            console.log("Image received through socket.io connection: success");

            setTimeout(function(){
                $scope.$apply();}, 3000);
        });

        $scope.getImages = async function(){
            //Get selected batch name
            let data = PageRefreshService.getCurrenBatchName();
            console.log('Current upload folder is set to: ' + data);

            if(typeof data==='undefined'){
                $location.path( "/home" );
                return;
            }

            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + "get_images?batch_name=" + data
                });
                //console.log(result);
                if (result.status === 200) {
                    let images_arr = result.data.files.images;
                    let processed_images_arr = result.data.files.processed_images;
                    for(let i=0; i<images_arr.length; i++){
                        let obj = {
                            file: images_arr[i], file_processed: processed_images_arr[i],
                            defect_count: -1,
                            defects: [
                                {name: 'test_value', confidence: '-1'},
                                {name: 'test_value2', confidence: '-2'},
                            ]
                        };
                        $scope.images.push(obj);
                    }
                    //console.log($scope.images);
                    $scope.$apply();
                }
            }catch (err){
                console.log(err);
                showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
                $location.path( "/home" );
                $scope.$apply();
            }
        };

        $scope.onInit =  async function(){
            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + "get_batch_names"
                });
                if (result.status === 200) {
                    let files_arr = result.data.files;
                    for(let i=0; i<files_arr.length; i++){
                        let obj = {
                            file_name: files_arr[i]};
                        $scope.batch_names.push(obj);
                    }
                    $scope.$apply();
                }
            }catch (err){
                console.log(err);
                showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
            }
        };

        $scope.openHistory = async function(index){
            let data = $scope.batch_names[index].file_name;
            PageRefreshService.updateCurrentBatchName(data);
            try {
                let result = await $http({
                    method: "POST",
                    url: host_url + "update_batch_folder",
                    data: 'data=' + data,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                //console.log(result);
                $location.path( "/process" );
                $scope.$apply();

            }catch (err){
                console.log(err);
                showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
            }
        };

        $scope.startCapture = async function(){
            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + "start_capture"
                });
                //console.log(result);
            }catch (err){
                console.log(err);
                showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
            }
        };

        $scope.stopCapture = async function(){
            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + "stop_capture"
                });
                //console.log(result);
            }catch (err){
                console.log(err);
                showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
            }
        };

        $scope.lightOff = async function(){
            try {
                let result = await $http({
                    method: "POST",
                    url: host_url + "turn_off_light",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                //console.log(result);
            }catch (err){
                console.log(err);
                showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
            }
        };

        $scope.lightOn = async function(){
            let isError = true;
            if(typeof $scope.input_red === 'undefined' ||
                $scope.input_red.replace(' ', '') === ''){
                showErrorMessage("Red color cannot left blank or invalid value!");
                let isError = false;
                return;
            }
            if(typeof $scope.input_green === 'undefined' ||
                $scope.input_green.replace(' ', '') === ''){
                showErrorMessage("Green color cannot left blank or invalid value!");
                let isError = false;
                return;
            }
            if(typeof $scope.input_blue === 'undefined' ||
                $scope.input_blue.replace(' ', '') === ''){
                showErrorMessage("Blue color cannot left blank or invalid value!");
                let isError = false;
                return;
            }
            if(isError){
                let data =  $scope.input_red + ' ' + $scope.input_green
                    + ' ' + $scope.input_blue;
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "turn_on_light",
                        data: 'data=' + data,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    //console.log(result);
                }catch (err){
                    console.log(err);
                    showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
                }
            }
        };

        $scope.createBatch = async function(){
            let isError = true;
            if(typeof $scope.batch_name === 'undefined' ||
                $scope.batch_name.replace(' ', '') === ''){
                showErrorMessage("Batch name cannot left blank or invalid value!");
                let isError = false;
                return;
            }
            if(isError){
                let data =  $scope.batch_name;
                PageRefreshService.updateCurrentBatchName(data);
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "create_batch",
                        data: 'data=' + data,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    //console.log(result);
                    let obj = {
                        file_name: data};
                    $scope.batch_names.push(obj);

                    $location.path( "/process" );
                    $scope.$apply();
                }catch (err){
                    console.log(err);
                    showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
                }
            }
        }
}]);