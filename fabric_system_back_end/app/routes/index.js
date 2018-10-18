const express = require('express');
const router = express.Router();

//Core API routes
require('../routes/routes/api.routes')(router);

module.exports = router;