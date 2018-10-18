app.controller('MainController', [
    '$scope','$http','host_url', function($scope, $http,host_url){
        $scope.images = [];

        let socket = io.connect('http://localhost:3000');
        showErrorMessage = function(message){alert(message);};

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
            console.log($scope.images);

            setTimeout(function(){
                $scope.$apply();}, 3000);
        });

        $scope.onInit =  async function(){
            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + "get_images"
                });
                console.log(result);
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
                    console.log($scope.images);
                    $scope.$apply();
                }
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
                console.log(result);
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
                console.log(result);
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
                console.log(result);
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
                    console.log(result);
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
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "create_batch",
                        data: 'data=' + data,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    console.log(result);
                    //Should show the error message that batch already exist
                }catch (err){
                    console.log(err);
                    showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
                }
            }
        }
}]);