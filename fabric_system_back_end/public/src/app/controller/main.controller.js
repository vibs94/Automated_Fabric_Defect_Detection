app.controller('MainController', [
    '$scope','$http','host_url', '$location', 'PageRefreshService', 'socket',
    function($scope, $http,host_url, $location, PageRefreshService, socket){
        //Initialize variables
        $scope.pointer_events = 'none';
        $scope.textfield_pointer_events = 'auto';

        $scope.opacity = '0.4';
        $scope.textfield_opacity = '1';

        $scope.is_capturing = PageRefreshService.getIsCapturing();
        $scope.defect_count = 0;  
        $scope.images = [];
        
        //Selection for the batch names
        $scope.batch_names = [{file_name: 'New Batch'}];
        $scope.current_select_batch = $scope.batch_names[0];

        $scope.changeBatchSelection = function(){
            if($scope.current_select_batch.file_name==$scope.batch_names[0].file_name){
                $scope.textfield_pointer_events = 'auto';
                $scope.textfield_opacity = '1';
            }else{
                $scope.textfield_pointer_events = 'none';
                $scope.textfield_opacity = '0.4';
                $scope.batch_name = "";
            }
        }

        let showErrorMessage = function(message){alert(message);};
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

        socket.on('fabric_defect_server', function(msg){
            let file_path = msg.path;
            let file_path_processed = msg.processed_path;
            let classify_results = msg.classify_results;
            console.log(classify_results);

            let classified_results = '';
            if(classify_results.hole>=90){
                classified_results = 'Hole';
                $scope.defect_count = $scope.defect_count + 1;
            }
            if(classify_results.horizontal>=90){
                if(classified_results==''){
                    classified_results = 'Horizontal';
                    $scope.defect_count = $scope.defect_count + 1;
                }else{
                    classified_results = classified_results + ', Horizontal';
                    let tmp_array = classified_results.split(",");
                    $scope.defect_count = $scope.defect_count + tmp_array.length;
                }
            }
            if(classify_results.verticle>=90){
                if(classified_results==''){
                    classified_results = 'Verticle';
                    $scope.defect_count = $scope.defect_count + 1;
                }else{
                    classified_results = classified_results + ', Verticle';
                    let tmp_array = classified_results.split(",");
                    $scope.defect_count = $scope.defect_count + tmp_array.length;
                }
            }
            if(classified_results==''){
                classified_results = 'No defect ditected'
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

            // setTimeout(function(){
            //     $scope.$apply();}, 3000);
        });

        $scope.getImages = async function(){
            console.log(PageRefreshService.getIsCapturing())
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
                    let classify_results = result.data.files.classifications;

                    for(let i=0; i<images_arr.length; i++){
                        let classifiction = classify_results[i];
                        let classified_results = '';
                        if(classifiction.hole>=90){
                            classified_results = 'Hole';
                            $scope.defect_count = $scope.defect_count + 1;
                        }
                        if(classifiction.horizontal>=90){
                            if(classified_results==''){
                                classified_results = 'Horizontal';
                                $scope.defect_count = $scope.defect_count + 1;
                            }else{
                                classified_results = classified_results + ', Horizontal';
                                let tmp_array = classified_results.split(",");
                                $scope.defect_count = $scope.defect_count + tmp_array.length;
                            }
                        }
                        if(classifiction.verticle>=90){
                            if(classified_results==''){
                                classified_results = 'Verticle';
                                $scope.defect_count = $scope.defect_count + 1;
                            }else{
                                classified_results = classified_results + ', Verticle';
                                let tmp_array = classified_results.split(",");
                                $scope.defect_count = $scope.defect_count + tmp_array.length;
                            }
                        }
                        if(classified_results==''){
                            classified_results = 'No defect ditected'
                        }

                        let obj = {
                            file: images_arr[i], file_processed: processed_images_arr[i],
                            defect_count: "Statistics of hole, horizontal and verticle defects",
                            defects: [
                                {name: 'Hole', confidence: classifiction.hole},
                                {name: 'Horizontal', confidence: classifiction.horizontal},
                                {name: 'Verticle', confidence: classifiction.verticle}
                            ],
                            classified_as: classified_results
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
                    let data = PageRefreshService.getCurrenBatchName();
                    if(typeof data !== 'undefined'){
                        for(let index in $scope.batch_names){
                            if($scope.batch_names[index].file_name===data){
                                $scope.current_select_batch = $scope.batch_names[index];
                                $scope.textfield_pointer_events = 'none';
                                $scope.textfield_opacity = '0.4';
                                break;
                            }
                        }
                    }
                    $scope.$apply();
                }
            }catch (err){
                console.log(err);
                showErrorMessage(err.status + ', ' + err.statusText + '\n' + err.data.message);
            }
        };

        $scope.openHistory = async function(data){
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
            let batch = PageRefreshService.getCurrenBatchName();
            let current_frame_count = $scope.images.length;
            let data = '&batch=' + batch + '&index=' + current_frame_count;

            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + route + data
                });
                console.log(result);
                
                //Start The Capture
                isTimer = true;
                processTimer();

                PageRefreshService.setIsCapturing(true);
                $scope.is_capturing = 
                    PageRefreshService.getIsCapturing();
                $scope.$apply();
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

                //Stop the capture
                isTimer = false;

                PageRefreshService.setIsCapturing(false);
                $scope.is_capturing = 
                    PageRefreshService.getIsCapturing();
                $scope.$apply();
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
            if($scope.current_select_batch.file_name=='New Batch'){
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
            }else{
                let data = $scope.current_select_batch.file_name;
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
            }
        }

        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        let isTimer;
        $scope.timer = "00:00:00";
        function processTimer(){
            setTimeout(function(){
                seconds = seconds + 1;
                if(seconds==60){
                    seconds = 0;
                    minutes = minutes + 1;
                    if(minutes = 60){
                        minutes = 0;
                        hours = hours + 1;
                    }
                }
                
                $scope.timer = n(hours) + ":" + n(minutes) + ":" + n(seconds);
                $scope.$apply();
                if(isTimer){ processTimer();}
            }, 1000);
        }

        function n(n){
            return n > 9 ? "" + n: "0" + n;
        }
}]);