<template>
    <TeacherLayout>
        <div class="grid grid-cols-3 gap-4">
            <template v-for="classItem in classes" :key="classItem._id">
                <NuxtLink :to="`/teacher/class/${classItem._id}`" class="max-w-xs p-4 shadow-lg"
                    style="text-decoration: none;">
                    <img src="https://static.vecteezy.com/system/resources/previews/009/385/472/non_2x/school-desk-clipart-design-illustration-free-png.png"
                        class="w-full object-cover mb-4 block" />
                    <div class="font-semibold">{{ classItem.className }}</div>
                    <div>{{ classItem.listUser.length }} students</div>
                </NuxtLink>
            </template>
        </div>
    </TeacherLayout>
</template>
    
<script setup lang="ts">
import TeacherLayout from '../../../layouts/TeacherLayout.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';

interface ClassItem {
    _id: string;
    className: string;
    listUser: string[];
}

const classes = ref<ClassItem[]>([]);

async function loadData() {
    try {
        const response = await axios.get("http://localhost:5000/api/class");
        const userId = localStorage.getItem('_id');
        console.log(response.data);

        classes.value = response.data.filter(classItem =>
            classItem.teacherId === userId ||
            classItem.examinationBoard.some(id => id === userId)
        );
    } catch (error) {
        console.error(error);
    }
}

onMounted(loadData);
</script>