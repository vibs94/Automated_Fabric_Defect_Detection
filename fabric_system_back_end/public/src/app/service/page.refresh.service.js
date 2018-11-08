angular.module('fabric-system-front-end').factory('PageRefreshService', [function () {
    let selected_value = -1;
    let isNewProcess = false;
    let current_batch_name;

    //LED panel color configurations
    let isAutomatic = "1";

    //Initialize
    if(localStorage.getItem("current_batch_name")!==null){
        current_batch_name =
            localStorage.getItem("current_batch_name");
    }

    let service = {};
    //Page refresh section
    service.run = run;

    //LED panel color configuration
    service.getIsAutomatic = getIsAutomatic;
    service.setIsAutomatic = setIsAutomatic;

    //History Section
    service.getIsNewProcess = getIsNewProcess;
    service.setIsNewProcess = setIsNewProcess;
    service.getCurrenBatchName = getCurrenBatchName;
    service.updateCurrentBatchName = updateCurrentBatchName;
    return service;

    function getIsAutomatic() { return isAutomatic;}
    function setIsAutomatic(flag){
        isAutomatic = flag;
    }

    function getCurrenBatchName() {return current_batch_name;}
    function updateCurrentBatchName(item){
        current_batch_name = item;
        localStorage.setItem("current_batch_name", item);
    }

    function getIsNewProcess(){return isNewProcess;}
    function setIsNewProcess(flag) {
        isNewProcess = flag;
    }

    function run() {
        console.log('Page Refresh Service Initialized');
    }
}]);