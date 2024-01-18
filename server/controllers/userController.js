const User = require("../models/User");
const cryptoJS = require("crypto-js");
const loginService = require("../service/loginService");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

module.exports = {
    login: async (req, res) => {
        try {
            let email = req.body.email;
            let password = req.body.password;

            if (!email || !password) {
                return res.status(200).json({
                    status: false,
                    message: "Không được để trống"
                });
            } else {
                let result = await loginService.handleLogin(email, password);
                if (result.statusCode == 0) {
                    const { JWT_SECRET_ACCESS_TOKEN, JWT_EXPRIRE_ACCESS_TOKEN } = process.env;
                    return res.status(200).json({
                        statusCode: result.statusCode,
                        message: result.message,
                        data: result.data,
                        token: jwt.sign({ _id: result.data._id, email: result.data.email, password: result.data.password, role: result.data.role },
                            JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_EXPRIRE_ACCESS_TOKEN })
                    });
                } else {
                    return res.status(200).json({
                        statusCode: result.statusCode,
                        message: result.message,
                    });
                }
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    logup: async (req, res) => {
        try {
            let {
                email,
                password,
                name,
                phoneNumber,
                DOB,
                address,
                Department,
                Majors,
                role
            } = req.body;
            console.log(req.body)
            if (!email || !password || !name) {
                return res.status(400).json({
                    status: false,
                    message: "Vui lòng cung cấp email, password và tên"
                });
            }

            let existingUser = await User.findOne({
                email: email
            });
            if (existingUser) {
                return res.status(409).json({
                    status: false,
                    message: "Email đã được sử dụng"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            if (role == 'Admin') {
                role = 2;
            } else if (role == 'Teacher') {
                role = 1;
            } else {
                role = 0;
            }
            const newUser = new User({
                email,
                password: hashedPassword,
                name,
                phoneNumber,
                DOB: new Date(DOB),
                address,
                Department,
                Majors,
                role,
                date_created: new Date()
            });

            await newUser.save();

            const { JWT_SECRET_ACCESS_TOKEN, JWT_EXPRIRE_ACCESS_TOKEN } = process.env;
            return res.status(200).json({
                status: true,
                message: "Đăng ký thành công",
                data: req.body,
                token: jwt.sign({ _id: newUser._id, email: newUser.email, password: newUser.password, role: newUser.role },
                    JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_EXPRIRE_ACCESS_TOKEN })
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            let userId = req.params.id;
            let updatedUser = req.body;
            await User.findByIdAndUpdate(userId, updatedUser);

            return res.status(200).json({
                status: true,
                message: "Cập nhật thông tin người dùng thành công"
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            let userId = req.params.id;

            await User.findByIdAndDelete(userId);

            return res.status(200).json({
                status: true,
                message: "Xóa người dùng thành công"
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    getAUserInfor: async (req, res) => {
        try {
            let userId = req.params.id;

            let user = await User.findById(userId);

            return res.status(200).json({
                status: true,
                userData: user
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    getAllUser: async (req, res) => {
        try {
            let users = await User.find();

            return res.status(200).json({
                status: true,
                userData: users
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    getAllTeacherAndStudent: async (req, res) => {
        try {
            let users = await User.find({ role: { $ne: 2 } });

            return res.status(200).json({
                status: true,
                userData: users
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
    updatePassword: async (req, res) => {
        try {
            const userId = req.params.id;
            const { newPassword } = req.body;
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await User.findByIdAndUpdate(userId, { password: hashedPassword });

            return res.status(200).json({
                status: true,
                message: "Cập nhật mật khẩu thành công"
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }
};