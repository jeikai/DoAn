const express = require('express');
const api = express.Router();
const chatController = require('../controllers/chatController');
const use = require('../helper/utility').use

api.post("/api/chatGroup", use(chatController.create))

module.exports = api