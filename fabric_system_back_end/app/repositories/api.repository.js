const { execFile } = require('child_process');
const fs = require('fs');
const request = require('request');
const server_config = require('../config/config.js');

module.exports = {
    get_batch_names: async function(callback){
        try{
            const image_uploaded_folder = './public/src/assets/images/upload/';
            let batch_list = [];

            //Read files and store the file names
            await fs.readdirSync(image_uploaded_folder).forEach(file => {
                batch_list.push(file);
            });

            return callback(200, {files: batch_list});
        }catch (ex){
            console.log(ex.toString());
            return callback(500, {message: ex.toString()});
        }
    },

    capture: async function(is_begin, callback){
        //Fix start stop process route
        let route = '/stop';
        if(is_begin){route = '/start'}
        try {
            await request({
                method: 'GET',
                url: server_config.system_url + route
            }, function (err, data) {
                if (err) {
                    return callback(500, {message: err});
                }
                if(is_begin) {
                    return callback(200, {message: "Capture process started, " + data.body.toString()});
                }else{
                    return callback(200, {message: "Capture process stopped, " + data.body.toString()});
                }
            });
        }catch (ex){
            return callback(500, {message: ex.toString()});
        }
    },

    light_panel: async function(switch_mood, red, green, blue, callback){
        //Fix start stop process route
        let route = '/light_off';
        if(switch_mood){route = '/light_on?r=' + red + '&g=' + green + '&b=' + blue;}
        try {
            await request({
                method: 'GET',
                url: server_config.system_url + route
            }, function (err, wit_res) {
                if (err) {
                    return callback(500, {message: err});
                }
                if(switch_mood) {
                    return callback(200, {message: "start request sent to the led_panels"});
                }else{
                    return callback(200, {message: "shut-down request sent to the led_panels"});
                }
            });
        }catch (ex){
            return callback(500, {message: ex.toString()});
        }
    },
    update_batch_folder: async function(folder_name, callback){
        try {
            //Change the folder name
            server_config.system_upload_folder = folder_name;
            return callback(200, {message: "Upload location changed: " + folder_name});
        }catch (ex){
            return callback(500, {message: ex.toString()});
        }
    },

    create_batch: async function(folder_name, callback){
        //Create the upload folder path for process
        let upload_path = 'public/src/assets/images/upload/' + folder_name;

        if (fs.existsSync(upload_path)) {
            return callback(409,
                {message: 'Batch name already exist on the server, Please select a different method.'});
        }else{
            //Create the folder in the upload directory
            fs.mkdirSync(upload_path);
            try {
                //Change the folder name
                server_config.system_upload_folder = folder_name;
                return callback(200, {message: "batch created successfully"});
            }catch (ex){
                return callback(500, {message: ex.toString()});
            }
        }
    },

    get_images: async function(batch_name, callback){
        const image_uploaded_folder = './public/src/assets/images/upload/' + batch_name + '/';
        let file_list = [];
        let processed_file_list = [];

        try{
            //Read files and store the file names
            await fs.readdirSync(image_uploaded_folder).forEach(file => {
                    if(file.includes("processed")){
                        processed_file_list.push('src/assets/images/upload/' + batch_name + '/' + file);
                    }else {
                        file_list.push('src/assets/images/upload/' + batch_name + '/' + file);
                    }
            });

            images = {
                images: file_list, processed_images: processed_file_list};

            return callback(200, {files: images});
        }catch (ex){
            return callback(500, {message: ex.toString()});
        }
    },

    upload_and_process : async function(image, file_name, file_suffix, callback){
        //Convert the image
        image = image.replace(/^data:image\/\w+;base64,/, "");
        image = image.replace(/ /g, '+');

        //get the folder name
        let upload_loc =  server_config.system_upload_folder;

        let decodedImage = new Buffer(image, 'base64');
        let file_path = 'public/src/assets/images/upload/' + upload_loc + '/' +
            file_name + '_' + file_suffix + '.jpg';

        try {
            await fs.writeFileSync(file_path,
                decodedImage, async function (err, data) {
                    if (err) {
                        return callback(500, {
                            data: err.toString()
                        });
                    }
                });

            //Constant File Location
            let execFilePath = './public/src/assets/files/processor/server_preprocessor.exe';
            //Arguments:
            //      [file_name]
            //      [allow_morphology_operations]
            //      [bitwise_not]
            //      [erode_size]
            //      [dilate_size]
            //      [display_result]
            //      [color_map]
            //      [color_range]
            //      [Gamma (leave blank will set gamma = 1.1)]1.1

            let respond = await execFile(
                execFilePath,
                [
                    file_path,      //file_name
                    '0',            //allow_morphology_operations
                    '1',            //bitwise_not
                    '1',            //erode_size
                    '1',            //dilate_size
                    '0',            //display_result
                    '2',            // color_map
                                    //      0 - COLORMAP_BONE
                                    //      1 - COLORMAP_HOT
                                    //      2 - COLORMAP_PINK
                                    //      3 - COLORMAP_RAINBOW
                                    //      4 - Don't Apply Color Map
                    '20',           //color_range
                    '1.1'           //Gamma (leave blank will set gamma = 1.1)
                ]
            );
            if (respond[0]) {
                return callback(500, {
                    data: respond[1],
                    output: respond[2],
                }, '', '');
            }
            file_path = 'src/assets/images/upload/' + upload_loc + '/' +
                file_name + '_' + file_suffix + '.jpg';
            let file_path_processed = 'src/assets/images/upload/' + upload_loc + '/' +
                file_name + '_' + file_suffix + '_processed.jpg';
            return callback(200, {
                data: respond[1],
                output: respond[2],
                message: "process completed: " + file_path_processed
            }, file_path, file_path_processed);
        }catch (ex){
            return callback(500, {message: ex.toString()});
        }
    },

    decode_image: async function(image, callback){
        image = image.replace(/^data:image\/\w+;base64,/, "");
        image = image.replace(/ /g, '+');

        try{
            let decodedImage = new Buffer(image, 'base64');
            await fs.writeFileSync('public/src/assets/images/tmp/image_decoded.jpg',
                decodedImage,  async function(err, data) {
                    if(err){
                        return callback(500, true, {
                            data: err.toString()
                        });
                    }
            });
            return callback(200, false, {
                data: "Successful"
            });
        }catch (ex){
            return callback(500, {message: ex.toString()});
        }
    },

    sample_encode_str: async function(callback){
        //Debugging
        let image_origial = 'public/src/assets/images/tmp/image.jpg';
        //let image_origial = 'public/src/assets/images/tmp/image.jpg';
        try{
            await fs.readFile(image_origial, async function(err, original_data){
                let base64Image = await original_data.toString('base64');
                if(err){
                    return callback(500, {
                        data: err.toString()
                    });
                }
                return callback(200, {
                    data: base64Image
                });
            });
        }catch (ex){
            return callback(500, {message: ex.toString()});
        }
    }
};