app.controller('MainController', [
    '$scope','$http','host_url', '$location', 'PageRefreshService', 'socket',
    function($scope, $http,host_url, $location, PageRefreshService, socket){
        //Initialize variables
        $scope.pointer_events = 'none';
        $scope.opacity = '0.4';

        let isAutomatic = PageRefreshService.getIsAutomatic();

        $scope.updateIsAutomatic = function(condition){
            if(condition){
                console.log("LED panels are set to automatic configurations");
                setFields('none', '0.4');
                isAutomatic = PageRefreshService.setIsAutomatic("1");
            }else{
                console.log("LED panels are set to manual configurations");
                setFields('auto', '1');
                isAutomatic = PageRefreshService.setIsAutomatic("0");
            }
        }

        setFields = function(opinter_event, opacity){
            $scope.pointer_events = opinter_event;
            $scope.opacity = opacity;
        }

        $scope.images = [];
        $scope.batch_names = [];
        
        let showErrorMessage = function(message){alert(message);};

        socket.on('fabric_defect_server', function(msg){
            let file_path = msg.path;
            let file_path_processed = msg.processed_path;
            let classify_results = msg.classify_results;
            console.log(classify_results);

            let classified_results = '';
            if(classify_results.hole>=90){
                classified_results = 'Hole';
            }
            if(classify_results.horizontal>=90){
                if(classified_results==''){
                    classified_results = 'Horizontal';
                }else{
                    classified_results = classified_results + ', Horizontal';
                }
            }
            if(classify_results.verticle>=90){
                if(classified_results==''){
                    classified_results = 'Verticle';
                }else{
                    classified_results = classified_results + ', Verticle';
                }
            }

            let obj = {
                file: file_path, file_processed: file_path_processed,
                defect_count: "Statistics of hole, horizontal and verticle defects",
                defects: [
                    {name: 'Hole', confidence: classify_results.hole},
                    {name: 'Horizontal', confidence: classify_results.horizontal},
                    {name: 'Verticle', confidence: classify_results.verticle}
                ],
                classified_as: classified_results
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
            let route = "start_capture?isAutomatic=0";
            if(PageRefreshService.getIsAutomatic()=="1"){
                console.log("LED panel is on auto config mood: success");
                route = "start_capture?isAutomatic=1";
            }
            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + route
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
            if(isAutomatic){
                console.log("LED lights configurations: Automatic Mood");
                alert("Method is not implemented yet");
            }else{
                let isError = true;
                console.log("LED lights configurations: Manual Mood");
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
                    try {
                        let result = await $http({
                            method: "POST",
                            url: host_url + "turn_on_light",
                            data: 'r=' + $scope.input_red + '&b=' + $scope.input_blue + 
                                    '&g=' + $scope.input_green,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        //console.log(result);
                    }catch (err){
                        console.log(err);
                        showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
                    }
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