const express = require('express');
const api = express.Router();
const uploadController = require('../controllers/uploadController')
const use = require('../helper/utility').use
const authMiddleware = require('../middleware/authMiddleware')

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

api.post("/api/upload/:projectId", upload.single('file'), use(uploadController.uploadFile))

api.get("/api/upload/:projectId", use(uploadController.getFilesByProjectId))

api.delete("/api/upload/:projectId", use(uploadController.deleteFilesByProjectId))

module.exports = api
 