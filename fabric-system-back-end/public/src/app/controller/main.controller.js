app.controller('MainController', [
    '$scope','$http','host_url', function($scope, $http,host_url){
        $scope.images = [];

        let socket = io.connect('http://localhost:3000');

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
            }
        };
}]);