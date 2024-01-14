<template>
    <div class="mt-4 px-4 py-8 border">
        <h3 class="font-medium text-lg text-[#6f6b7d]">Change Password</h3>
        <div class="p-4 bg-orange-100 my-4">
            <p class="font-semibold text-lg text-orange-400">Ensure that these requirements are met</p>
            <p class="font-semibold text-lg text-orange-400">Minimum 8 characters long, uppercase & symbol</p>
        </div>
        <div class="flex gap-2 mb-4">
            <div class="flex-1">
                <label class="block mb-1 font-semibold text-[#6f6b7d]">New Password</label>
                <input v-model="newPassword"
                    class="w-full px-4 py-2 text-[#6f6b7d] border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    type="password" />
            </div>
            <div class="flex-1">
                <label class="block mb-1 font-semibold text-[#6f6b7d]">Confirm New Password</label>
                <input v-model="confirmNewPassword"
                    class="w-full px-4 py-2 text-[#6f6b7d] border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    type="password" />
            </div>
        </div>
        <button @click="changePassword"
            class="px-6 py-3 text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none">Change
            Password</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const newPassword = ref('');
const confirmNewPassword = ref('');
const route = useRoute();
const toast = useToast();

const changePassword = async () => {
    if (!newPassword.value || !confirmNewPassword.value) {
        toast.error('Please fill in both password fields.');
        return;
    }

    if (newPassword.value !== confirmNewPassword.value) {
        toast.error('Passwords do not match.');
        return;
    }

    try {
        const userId = route.params.id;
        const response = await axios.put(`http://localhost:5000/api/user/updatePassword/${userId}`, {
            newPassword: newPassword.value
        });

        if (response.data.status) {
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error('An error occurred while updating the password.');
        console.error(error);
    }
};
</script>