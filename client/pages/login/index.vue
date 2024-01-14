<template>
    <div class="login-wrapper">
        <div class="wrapper">
            <form @submit.prevent="submit">
                <h1>Login</h1>
                <div class="input-box">
                    <input type="text" placeholder="Username" required v-model="email" />
                    <i class='bx bxs-user'></i>
                </div>
                <div class="input-box">
                    <input :type="showPassword ? 'text' : 'password'" placeholder="Password" required v-model="password" />
                    <i class='bx bxs-lock-alt'></i>
                    <span class="toggle-password" @click="toggleShowPassword">
                        <i class="bx" :class="showPassword ? 'bxs-show' : 'bxs-hide'"></i>
                    </span>
                </div>
                <button type="submit" class="btn">Login</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const toast = useToast();

export default {
    name: "login",
    data() {
        return {
            email: '',
            password: '',
            showPassword: false,
        }
    },
    methods: {
        async submit() {
            try {
                const response = await axios.post('http://localhost:5000/api/user/login', {
                    email: this.email,
                    password: this.password,
                });
                const statusCode = response.data.statusCode;
                if (statusCode === 0) {
                    const token = response.data.token;
                    const _id = response.data.data._id;
                    const email = response.data.data.email;

                    localStorage.setItem('token', token);
                    localStorage.setItem('_id', _id);
                    localStorage.setItem('email', email);
                    toast.success("Đăng nhập thành công")
                    if (response.data.data.role === 0) {
                        await this.$router.push('/student/class');
                    } else if (response.data.data.role === 1) {
                        await this.$router.push('/teacher/class');
                    }
                    else if (response.data.data.role === 2) {
                        await this.$router.push('/admin/users');
                    }
                } else {
                    toast.error(response.data.message)
                    console.log(response.data.message);
                }
            } catch (error) {
                toast.error(error.message)
                console.error(error);
            }
        },
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },
    },
}
</script>
  
<style scoped>
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: url("./assets/images/bg.jpg") no-repeat;
    background-position: center;
}

.login-wrapper .wrapper {
    width: 420px;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, .2);
    backdrop-filter: blur(9px);
    color: #fff;
    border-radius: 12px;
    padding: 30px 40px;
}

.login-wrapper .wrapper h1 {
    font-size: 36px;
    text-align: center;
}

.login-wrapper .wrapper .input-box {
    position: relative;
    width: 100%;
    height: 50px;
    margin: 30px 0;
}

.login-wrapper .wrapper .input-box input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    border: 2px solid rgba(255, 255, 255, .2);
    border-radius: 40px;
    font-size: 16px;
    color: #fff;
    padding: 20px 45px 20px 20px;
}

.login-wrapper .wrapper .input-box input::placeholder {
    color: #fff;
}

.login-wrapper .wrapper .input-box i {
    position: absolute;
    right: 20px;
    top: 30%;
    transform: translate(-50%);
    font-size: 20px;
}

.login-wrapper .wrapper .input-box .toggle-password {
    position: absolute;
    right: 20px;
    top: 30%;
    transform: translate(-50%);
    cursor: pointer;
    font-size: 20px;
    color: #fff;
}

.login-wrapper .wrapper .input-box .toggle-password i {
    color: #fff;
}

.login-wrapper .wrapper .btn {
    width: 100%;
    height: 45px;
    background: #fff;
    border: none;
    outline: none;
    border-radius: 40px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    cursor: pointer;
    font-size: 16px;
    color: #333;
    font-weight: 600;
}

.login-wrapper .wrapper .register-link {
    font-size: 14.5px;
    text-align: center;
    margin: 20px 0 15px;
}
</style>