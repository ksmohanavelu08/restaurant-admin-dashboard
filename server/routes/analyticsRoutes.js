const express = require('express');
const router = express.Router();
const { getTopSellers } = require('../controllers/orderController');

router.get('/top-sellers', getTopSellers);

module.exports = router;
