<template>
    <div class="mt-4 px-4 py-8 border">
        <h3 class="font-medium text-lg text-[#6f6b7d]">View your file</h3>
        <div v-if="file && file.fileUrl">
            <template v-if="isPDF(file.fileName)">
                <!-- Hiển thị PDF -->
                <iframe :src="file.fileUrl" width="100%" height="500px" frameborder="0"></iframe>
            </template>
            <template v-else-if="isWordDoc(file.fileName)">
                <!-- Hiển thị tên file và biểu tượng của Google Docs -->
                <a :href="file.fileUrl" download="file.fileName">
                    <button class="btn btn-primary" style="font-size: 16px">
                        <span class="icon-text">
                            <FileTextOutlined />
                            <span class="ml-2">{{ getShortFileName(file.fileName) }}</span>
                        </span>
                    </button>
                </a>
            </template>
            <template v-else>
                <p>This file format is not supported.</p>
            </template>
        </div>
    </div>
</template>
  
<style>
.icon-text {
    display: flex;
    align-items: center;
}

.ml-2 {
    margin-left: 0.5rem;
}
</style>
  
<script setup lang="ts">
import axios from 'axios';
const route = useRoute()
import { FileTextOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';
const file = ref<any>();

async function loadData() {
    try {
        const id = route.params.id;
        const response = await axios.get(`http://localhost:5000/api/upload/${id}`);
        file.value = response.data[0];
    } catch (error) {
        console.error(error);
    }
}

function isPDF(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
}

function isWordDoc(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx');
}

function getShortFileName(fileName: string): string {
    const maxLength = 20; // Đặt độ dài tối đa cho tên tệp tin rút gọn
    if (fileName.length <= maxLength) {
        return fileName;
    }
    return fileName.substr(0, maxLength) + '...';
}

onMounted(loadData);
</script>