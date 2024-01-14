<template>
    <StudentLayout>
        <div class="mt-12 flex gap-8">
            <div class="flex-1 border flex flex-col h-fit">
                <div class="pt-12 px-8 text-center flex justify-center flex-col w-full items-center">
                    <img src="https://static.vecteezy.com/system/resources/previews/009/385/472/non_2x/school-desk-clipart-design-illustration-free-png.png"
                        alt="" class="h-24 w-24 object-cover" />

                    <h3 class="font-semibold text-lg text-black my-2">{{ projectInfo.projectName }}</h3>
                    <div class="border w-full my-6"></div>
                </div>
                <div class="px-8">
                    <p class="uppercase text-[#a8aaae] font-medium text-sm">Details</p>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Name: </span>
                        <span>{{ projectInfo.projectName }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Description: </span>
                        <span>{{ projectInfo.description }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">State: </span>
                        <span>{{ projectInfo.isApproved }}</span>
                    </div>
                    <div v-if="projectInfo.type == 0">
                        <div class="mt-4">
                            <span class="font-medium text-sm">Execution Score: </span>
                            <span>{{ listMark.execution }}</span>
                        </div>
                    </div>
                    <div v-if="projectInfo.type == 1">
                        <div class="mt-4">
                            <span class="font-medium text-sm">Guidance Score: </span>
                            <span>{{ listMark.guidance }}</span>
                        </div>
                        <div class="mt-4">
                            <span class="font-medium text-sm">Execution Score: </span>
                            <span>{{ listMark.execution }}</span>
                        </div>
                        <div class="mt-4">
                            <span class="font-medium text-sm">Proccess Score: </span>
                            <span>{{ listMark.proccess }}</span>
                        </div>
                        <div class="mt-4">
                            <span class="font-medium text-sm">Defense Score: </span>
                            <span>{{ listMark.sumDefense }}</span>
                        </div>
                        <div class="mt-4">
                            <span class="font-medium text-sm">Final Project Score: </span>
                            <span>{{ listMark.final }}</span>
                        </div>
                        <div class="mt-4">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-[2]">
                <div class="w-full flex gap-4">
                    <template v-for="link in links">
                        <NuxtLink :to="link.url" class="flex gap-2 items-center justify-center py-2 px-4  rounded-md"
                            :class="route.name === link.path ? 'bg-primay font-medium text-white' : 'hover:text-primay'">
                            <Icon :name="link.icon" />
                            {{ link.name }}
                        </NuxtLink>
                    </template>
                </div>
                <NuxtPage />
            </div>
        </div>
    </StudentLayout>
</template> 

<script setup lang="ts">
import StudentLayout from '../layouts/StudentLayout.vue';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const route = useRoute()
const toast = useToast();

const projectInfo = ref({
    _id: '',
    projectName: '',
    description: '',
    isApproved: '',
    isDenied: '',
    listMark: '',
    date_created: '',
    deadline: '',
    type: 0
});

const listMark = ref<any>({
    guidance: 0,
    execution: 0,
    defense: 0,
    proccess: 0,
    sumDefense: 0,
    final: 0
});

async function loadData() {
    try {
        const userId = process.client ? localStorage.getItem('_id') : '';
        const id = route.params.id;
        const response = await axios.get(`http://localhost:5000/api/project/${userId}/${id}`);
        const response_mark = await axios.get(`http://localhost:5000/api/mark/${id}`)
        const projectData = response.data[0];

        projectInfo.value = {
            ...projectData,
            isApproved: projectData.isApproved ? 'Đã xét duyệt' : projectData.isDenied ? 'Bị từ chối' : 'Chưa được chấp nhận'
        };
        response_mark.data.forEach(markData => {
            switch (markData.type) {
                case 0:
                    listMark.value.guidance = markData.mark;
                    break;
                case 1:
                    listMark.value.execution = markData.mark;
                    break;
                case 2:
                    listMark.value.defense = markData.mark;

                    break;
                case 3:
                    listMark.value.proccess = markData.mark;
                    break;
                case 4:
                    listMark.value.sumDefense = markData.mark;
                    break;
                case 5:
                    listMark.value.final = markData.mark;
                    break;
                default:
                    break;
            }
        });
    } catch (error) {
        console.error(error);
    }
}

onMounted(loadData)

const links = ref([
    { name: 'Students', path: 'student-project-id', url: `/student/project/${route.params.id}`, icon: 'material-symbols:person-check-rounded' },
])
</script>
 