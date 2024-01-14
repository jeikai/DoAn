const express = require('express');
const api = express.Router();
const markController = require('../controllers/markController')
const use = require('../helper/utility').use
const authMiddleware = require('../middleware/authMiddleware')

api.post("/api/mark/:teacherId/:studentId/:projectId", authMiddleware.protectTeacher, use(markController.addMark))

api.get("/api/mark/:projectId", use(markController.listMark))

api.put("/api/mark/:markId", authMiddleware.protectTeacher, use(markController.updateProject))
module.exports = api