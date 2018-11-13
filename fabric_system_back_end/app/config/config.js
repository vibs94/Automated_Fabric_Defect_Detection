module.exports = {
    //server url for embedded system, hosted by ngrok services
    system_url: 'https://5bae62f7.ngrok.io',

    //Upload file config
    system_upload_folder: 'sample_fabric_defects',

    //Python paths
    //Server
    python_path: 'C:/Users/Administrator/AppData/Local/Programs/Python/Python36/python.exe',
    //Local 
    // python_path: 'C:/Python/Python36/python.exe',

    //Classifier Location and config
    classifier_path: './public/src/assets/files/classifier/classify.py',

    //Preprocessor
    preprocessor_exec_file_path: './public/src/assets/files/processor/server_preprocessor.exe'
};