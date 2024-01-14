<template>
  <NuxtPage />
</template>

<script>
export default {
  name: 'App',
  created() {
  if (typeof localStorage !== 'undefined') { 
    this.checkAuthentication();
  } else {
    console.error('localStorage is not available.');
  }
},
  methods: {
    checkAuthentication() {
      const token = localStorage.getItem("token")
      if (!token) {
        // Nếu không có token, điều hướng đến trang /login
        this.$router.push('/login');
      } else {
        // Nếu có token, kiểm tra vai trò từ token và điều hướng đến trang tương ứng
        const role = this.parseToken(token).role;
        if (role === 0) {
          this.$router.push('/student/class');
        } else if (role === 1) {
          this.$router.push('/teacher/class');
        } else if (role === 2) {
          this.$router.push('/admin/users');
        }
      }
    },
    parseToken(token) {
      // Hàm này để phân tích thông tin từ token
      // Bạn có thể sử dụng JWT library để phân tích token
      // Ví dụ: https://www.npmjs.com/package/jsonwebtoken
      // Ở đây, tôi giả sử token có định dạng JSON và chỉ lấy thông tin role
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        return {
          role: tokenData.role,
        };
      } catch (error) {
        console.error('Failed to parse token:', error);
        return null;
      }
    },
  },
};
</script>