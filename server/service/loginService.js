const bcrypt = require('bcryptjs')
const User = require('../models/User')
let checkEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({
                where: { email: email }
            })
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleLogin = async (email, password) => {
    try {
        let result = {};
        let checkEmailExist = await checkEmail(email);
        if (!checkEmailExist) {
            let user = await User.findOne({
                email: email
            });
            if (user) {
                let checkPassword = await bcrypt.compare(password, user.password);
                if (checkPassword) {
                    result.data = user;
                    result.statusCode = 0;
                    result.message = "Đăng nhập thành công";
                } else {
                    result.statusCode = 1;
                    result.message = "Sai mật khẩu";
                }
            }
        } else {
            result.statusCode = 2;
            result.message = "Email không tồn tại";
        }
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    handleLogin: handleLogin,
}