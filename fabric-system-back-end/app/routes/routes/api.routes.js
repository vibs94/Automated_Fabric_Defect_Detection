const api_controller = require('./../../controller/api.controller');
const request = require('request');
let url = 'https://3e451c16.ngrok.io';

module.exports = function (router) {
    router.post('/post', function(req,res) {
        console.log(req.body);
        return res.status(200).send("testing");
    });

    router.get('/get', function(req,res) {
        return res.status(200).send("testing");
    });

    router.post('/turn_on_light', function(req,res) {
        return res.status(200).send("testing");
    });

    router.post('/turn_off_light', function(req,res) {
        return res.status(200).send("testing");
    });

    router.post('/create_batch', function(req,res) {
        return res.status(200).send("testing");
    });

    router.get('/start_capture', async function(req,res) {
        try {
            await request({
                method: 'GET',
                url: url + '/start'
            }, function (err, wit_res) {
                if (err) {
                    return res.json(500, {message: err});
                }
                return res.json(200, {data: JSON.parse(wit_res.body)});
            });
        }catch (ex){
            return res.json(500, {data: ex.toString()});
        }
    });
    router.get('/stop_capture', async function(req,res) {
        try {
            await request({
                method: 'GET',
                url: url + '/stop'
            }, function (err, wit_res) {
                if (err) {return res.json(500,{message: err});}
                return res.json(200,{data: JSON.parse(wit_res.body)});
            });
        }catch (ex){
            return res.json(500, {data: ex.toString()});
        }
    });
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
