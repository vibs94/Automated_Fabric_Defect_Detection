const api_controller = require('./../../controller/api.controller');

module.exports = function (router) {
    //Test routes for connection, ngrok testing post, get requests
    router.post('/post', function(req,res) {
        return res.status(200).send("server test route for post method");
    });
    router.get('/get', function(req,res) {
        return res.status(200).send("server test route for get method");
    });

    //Dummy Testing Route For Python Scripts
    router.get('/test_python_script', async function(req,res) {
        const repo = require('./../../repositories/api.repository');
        console.log(req.query.first_name);
        console.log(req.query.last_name);
        await repo.test_python_script(
            req.query.first_name,
            req.query.last_name,
            function(result){
                return res.status(200).json(result);
            }
        )
    });

    //Back-end server routes
    router.post(
        '/turn_on_light',
        async function(req,res) {
            api_controller.turn_on_light(req,res);
        }
    );
    router.post(
        '/turn_off_light',
        async function(req,res) {
            api_controller.turn_off_light(req,res);
        }
    );
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
