const { execFile } = require('child_process');
const fs = require('fs');

module.exports = {
    get_images: async function(callback){
        const image_uploaded_folder = './public/src/assets/images/upload/';
        let file_list = [];
        let processed_file_list = [];

        //Read files and store the file names
        await fs.readdirSync(image_uploaded_folder).forEach(file => {
                if(file.includes("processed")){
                    processed_file_list.push('src/assets/images/upload/' + file);
                }else {
                    file_list.push('src/assets/images/upload/' + file);
                }
        });

        images = {
            images: file_list, processed_images: processed_file_list};

        return callback(200, {files: images});
    },

    upload_and_process : async function(image, file_name, file_suffix, callback){
        //Convert the image
        image = image.replace(/^data:image\/\w+;base64,/, "");
        image = image.replace(/ /g, '+');

        let decodedImage = new Buffer(image, 'base64');
        let file_path = 'public/src/assets/images/upload/' +
            file_name + '_' + file_suffix + '.jpg';

        await fs.writeFileSync(file_path,
            decodedImage,  async function(err, data) {
                if(err){
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
        if(respond[0]){
            return callback(500, {
                data: respond[1],
                output: respond[2],
            }, '', '');
        }
        file_path = 'src/assets/images/upload/' +
            file_name + '_' + file_suffix + '.jpg';
        let file_path_processed = 'src/assets/images/upload/' +
            file_name + '_' + file_suffix + '_processed.jpg';
        return callback(200, {
            data: respond[1],
            output: respond[2]
        }, file_path, file_path_processed);
    },

    decode_image: async function(image, callback){
        image = image.replace(/^data:image\/\w+;base64,/, "");
        image = image.replace(/ /g, '+');

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
    },

    sample_encode_str: async function(callback){
        //Debugging
        let image_origial = 'public/src/assets/images/test.jpg';
        //let image_origial = 'public/src/assets/images/tmp/image.jpg';

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
    }
};