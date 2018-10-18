const api_controller = require('./../../controller/api.controller');

module.exports = function (router) {
    router.post('/post', function(req,res) {
        return res.status(200).send("server test route for post method");
    });
    router.get('/get', function(req,res) {
        return res.status(200).send("server test route for get method");
    });

    router.post('/turn_on_light', function(req,res) {
        return res.status(200).send("testing");
    });
    router.post('/turn_off_light', function(req,res) {
        return res.status(200).send("testing");
    });

    router.post(
        '/update_batch_folder',
        async function(req,res) {
            api_controller.update_batch_folder(req,res);
        }
    );
    router.post(
        '/create_batch',
        async function(req,res) {
            api_controller.create_batch(req,res);
        }
    );
    router.get(
        '/get_batch_names',
        async function(req,res) {
            api_controller.get_batch_names(req,res);
        }
    );
    router.get(
        '/start_capture',
        async function(req,res) {
            api_controller.start_capture(req,res);
        }
    );
    router.get(
        '/stop_capture',
        async function(req,res) {
            api_controller.stop_capture(req,res);
        }
    );
    router.get(
        '/get_images',
        async function(req, res, next){
            api_controller.get_images(req,res);
        }
    );
    router.get(
        '/sample_encode_str',
        async function(req,res,next){
            api_controller.sample_encode_str(req,res);
        }
    );
    router.post(
        '/upload_and_process',
        async function(req, res, next) {
            api_controller.upload_and_process(req, res);
        }
    );
    router.get(
        '/decode_image',
        async function(req, res, next) {
            api_controller.decode_image(req, res);
        }
    );
};
