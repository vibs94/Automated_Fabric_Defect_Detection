const api_repository = require('./../repositories/api.repository');

module.exports = {
    classify_image: async function(req, res){
        if(typeof req.body==='undefined') {
            return res.status(400).json({message: 'body data is required'});}
        if(typeof req.body.image==='undefined' ||
            req.body.image===''){
            return res.status(400).json({message: 'image is required'});
        }
        let image = req.body.image;
        api_repository.classify_image(
            image,
            async function(status, message){
                return res.status(status).json(message);
            }
        )
    },

    turn_on_light: async function(req, res){
        if(typeof req.body==='undefined') {
            return res.status(400).json({message: 'body data is required'});}
        if(typeof req.body.r==='undefined' ||
            req.body.r===''){
            return res.status(400).json({message: 'r is required'});
        }
        if(typeof req.body.g==='undefined' ||
            req.body.g===''){
            return res.status(400).json({message: 'g is required'});
        }
        if(typeof req.body.b==='undefined' ||
            req.body.b===''){
            return res.status(400).json({message: 'b is required'});
        }
        api_repository.light_panel(
            true,
            req.body.r, req.body.g, req.body.b,
            async function(status, message){
                return res.status(status).json(message);
            }
        )
    },

    turn_off_light: async function(req, res){
        api_repository.light_panel(
            false,
            0,0,0,  //Set RGB color to black
            async function(status, message){
                return res.status(status).json(message);
            }
        )
    },

    get_batch_names: async function(req,res){
        api_repository.get_batch_names(
            async function(status, message){
                return res.status(status).json(message);
            }
        )
    },

    start_capture: async function(req, res){
        if(typeof req.query==='undefined') {
            return res.status(400).json({message: 'query data is required'});}
        if(typeof req.query.isAutomatic==='undefined' ||
            req.query.isAutomatic===''){
            return res.status(400).json({message: 'isAutomatic is required'});
        }
        if(typeof req.query.batch==='undefined' ||
            req.query.batch===''){
            return res.status(400).json({message: 'batch is required'});
        }
        if(typeof req.query.index==='undefined' ||
            req.query.index===''){
            return res.status(400).json({message: 'index is required'});
        }
        let isAutomatic = req.query.isAutomatic;
        let index = req.query.index;
        let batch = req.query.batch;
        api_repository.capture(
            true,
            isAutomatic, index, batch, 
            async function(status, message){
                return res.status(status).json(message);
            }
        )
    },

    stop_capture: async function(req, res){
        api_repository.capture(
            false,
            false, 0, '',
            async function(status, message){
                return res.status(status).json(message);
            }
        )
    },

    update_batch_folder: async function(req,res){
        if(typeof req.body==='undefined') {
            return res.status(400).json({message: 'body data is required'});}
        if(typeof req.body.data==='undefined' ||
            req.body.data===''){
            return res.status(400).json({message: 'data is required'});
        }
        api_repository.update_batch_folder(
            req.body.data,
            async function(status, message){
                return res.status(status).json(message);
            }
        );
    },

    create_batch: async function(req, res){
        if(typeof req.body==='undefined') {
            return res.status(400).json({message: 'body data is required'});}
        if(typeof req.body.data==='undefined' ||
            req.body.data===''){
            return res.status(400).json({message: 'data is required'});
        }
        api_repository.create_batch(
            req.body.data,
            async function(status, message){
                return res.status(status).json(message);
            }
        );
    },

    get_images : async function(req, res) {
        if(typeof req.query==='undefined') {
            return res.status(400).json({message: 'query data is required'});}
        if(typeof req.query.batch_name==='undefined' ||
            req.query.batch_name===''){
            return res.status(400).json({message: 'batch_name is required'});
        }
        api_repository.get_images(
            req.query.batch_name,
            async function (status, message) {
                return res.status(status).json(message);
            }
        );
    },

    upload_and_process : async function(req, res){
        if(typeof req.body==='undefined') {
            return res.status(400).json({message: 'body data is required'});}
        if(typeof req.body.encode_str==='undefined' ||
            req.body.encode_str===''){
            return res.status(400).json({message: 'encode_str is required'});
        }
        if(typeof req.body.file_name==='undefined' ||
            req.body.file_name===''){
            return res.status(400).json({message: 'file_name is required'});
        }
        if(typeof req.body.file_suffix==='undefined' ||
            req.body.file_suffix===''){
            return res.status(400).json({message: 'file_suffix is required'});
        }
        api_repository.upload_and_process(
            req.body.encode_str,
            req.body.file_name,
            req.body.file_suffix,
            async function (status, message, path, processed_path, classify_results) {
                let data = {
                    path: path, processed_path: processed_path, classify_results: classify_results};
                io.emit('fabric_defect_server', data);
                return res.status(status).json(message);
            }
        );
    },

    decode_image: async function(req, res){
        if(typeof req.query==='undefined'){
            return res.status(400).json({message: 'query data is required'});}
        if(typeof req.query.image==='undefined' ||
            req.query.image===''){
            return res.status(400).json({message: 'image is required'});
        }

        api_repository.decode_image(
            req.query.image,
            await function(status, is_error, data){
                if(is_error){
                    return res.status(status).json(data);
                }else{
                    return res.status(200).sendFile(
                        'src/assets/images/tmp/image_decoded.jpg',
                        {root: './public'});
                }
            }
        )
    },

    sample_encode_str: async function(req, res){
        api_repository.sample_encode_str(
            async function(status, data){
                return res.status(status).json(data);
            }
        );
    }
};

