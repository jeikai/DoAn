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
                    <div class="mt-4" v-if="!projectInfo.isDenied && projectInfo.isApproved == 'Đã xét duyệt'">
                        <span class="font-medium text-sm">Deadline: </span>
                        <span>{{ formattedDOB }}</span>
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
                    </div>
                    <div class="mt-4">
                    </div>
                </div>
                <div v-if="!projectInfo.isDenied && !isDeadline" class="flex gap-4 my-4 m-auto">
                    <UButton color="primary" variant="solid" size="xl" @click="isOpen = true">Edit</UButton>
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
        <template>
            <div>
                <UModal v-model="isOpen" prevent-close>
                    <UCard :ui="{
                        ring: '',
                        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                    }">
                        <template #header>
                            <div class="flex items-center justify-between">
                                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                    Update project
                                </h3>
                                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                    @click="isOpen = false" />
                            </div>
                        </template>
                        <UForm :schema="schema" :state="state" @submit="submit">
                            <div class="flex gap-4">
                                <UFormGroup class="mb-4 flex-1" label="Project's name" name="projectName">
                                    <UInput v-model="state.projectName" placeholder="Name of project" />
                                </UFormGroup>

                            </div>
                            <div class="flex gap-4">
                                <UFormGroup class="mb-4 flex-1" label="Description" name="description">
                                    <UInput v-model="state.description" placeholder="Description of project" />
                                </UFormGroup>
                            </div>
                            <div class="flex gap-4">
                                <UFormGroup class="mb-4 flex-1" label="File">
                                    <Upload v-model:file-list="fileList" name="file" :headers="headers"
                                        @change="handleChange">
                                        <Button>
                                            <UploadOutlined></UploadOutlined>
                                            Click to Upload
                                        </Button>
                                    </Upload>
                                </UFormGroup>

                            </div>
                            <UButton type="submit"> Submit </UButton>
                        </UForm>
                    </UCard>
                </UModal>
            </div>
        </template>
    </StudentLayout>
</template> 

<script setup lang="ts">
import StudentLayout from '../layouts/StudentLayout.vue';
import { ref, onMounted, computed } from 'vue';
import * as z from 'zod';
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { Upload, Button } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam } from 'ant-design-vue';

const route = useRoute()
const toast = useToast();
const isOpen = ref(false);
const state = ref({
    projectName: '',
    type: 0,
    description: '',
})

const fileList = ref([]);
const headers = {
    authorization: 'authorization-text',
};

const schema = z.object({
    projectName: z.string().min(1, "Name is required"),
    type: z.number().int().min(0, "Type is required"),
    description: z.string().min(1, "Description is required"),
});

type Schema = z.output<typeof schema>;

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
        state.value = {
            projectName: projectInfo.value.projectName,
            type: projectInfo.value.type,
            description: projectInfo.value.description
        }
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

async function submit(event: FormSubmitEvent<Schema>) {
    console.log(event.data)
    try {
        const projectId = route.params.id;

        if (fileList.value.length > 1) {
            toast.error("Only upload 1 file");
            return;
        }
        const response_update_project = await axios.put(`http://localhost:5000/api/project/${projectId}`, event.data);
        if (response_update_project.data) {
            if (fileList.value.length === 0) {
                loadData();
                isOpen.value = false;
                toast.success("Update project successfully");
            } else {
                const formData = new FormData();
                formData.append('file', fileList.value[0]?.originFileObj);
                await axios.delete(`http://localhost:5000/api/upload/${projectId}`);
                const uploadFileResponse = await axios.post(`http://localhost:5000/api/upload/${projectId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if( uploadFileResponse.data) {
                    loadData();
                    isOpen.value = false;
                    toast.success("Update project and upload file successfully");
                } else {
                    toast.error("Upload file fail");
                }
            }

        } else {
            toast.error("Update project fail");
        }
    } catch (error) {
        console.error("Error during form submission:", error);
        toast.error("Update project fail");
    }
}

const formattedDOB = computed(() => {
    console.log(projectInfo.value.deadline)
    const rawDOB = projectInfo.value.deadline;
    if (rawDOB) {
        const date = new Date(rawDOB);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    return '';
});

const handleChange = (info: UploadChangeParam) => {
    if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
        const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        // Kiểm tra nếu loại file không thuộc danh sách cho phép
        if (!allowedFileTypes.includes(info.file.type)) {
            toast.error(`Only PDF, DOC, or DOCX files are allowed.`);
            // Xóa file không hợp lệ khỏi danh sách
            fileList.value = fileList.value.filter(file => file.uid !== info.file.uid);
            return;
        }

        toast.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
    }
};

const isDeadline = computed(() => {
    const projectDeadline = new Date(projectInfo.value.deadline);
    const currentDate = new Date();

    return projectDeadline < currentDate;
});

const links = ref([
    { name: 'Students', path: 'student-project-id', url: `/student/project/${route.params.id}`, icon: 'material-symbols:person-check-rounded' },
])
</script>
 