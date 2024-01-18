const api = require("express").Router();
const userController = require("../controllers/userController")
const use = require('../helper/utility').use
const validation = require('../service/validation')

api.post("/api/user/login", validation.loginValidate, use(userController.login));
api.post("/api/user/logup", validation.registerValidate, use(userController.logup));

api.get("/api/user/getAllUser", use(userController.getAllUser))
api.get("/api/user/getAllTeacherAndStudent", use(userController.getAllTeacherAndStudent))
api.get("/api/user/getUserInfor/:id", use(userController.getAUserInfor))

api.put("/api/user/updatePassword/:id", use(userController.updatePassword))
api.put("/api/user/updateUser/:id", use(userController.updateUser))

api.delete("/api/user/deleteUser/:id", use(userController.deleteUser)); 
module.exports = api
 