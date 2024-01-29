<template>
    <AdminLayout>
        <img src="../../../assets/images/logo.png" alt="">
        <vue-webrtc v-if="hasJoined" width="100%" roomId="sample-room" ref="webrtc" />
        <input type="text" v-model="roomId" placeholder="Enter room ID">
        <button @click="toggleRoom">{{ hasJoined ? 'Leave Room' : 'Join Room' }}</button>
        <button @click="screenShare" v-if="hasJoined">Share your screen</button>
    </AdminLayout>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '~/layouts/AdminLayout.vue';
import { VueWebRTC } from 'vue-webrtc';

const roomId = ref('');
const hasJoined = ref(false);
let webrtcInstance;

const toggleRoom = () => {
    if (hasJoined.value) {
        webrtcInstance.leave();
        hasJoined.value = false;
    } else {
        webrtcInstance.join();
        hasJoined.value = true;
    }
};

const screenShare = () => {
    webrtcInstance.shareScreen();
};

onMounted(() => {
    webrtcInstance = $refs.webrtc;
});
</script>
  
<style lang="scss" scoped></style>