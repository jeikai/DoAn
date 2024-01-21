<template>
    <StudentLayout>
        <div class="border-2 p-10">
            <div class="flex gap-4 justify-end mb-4">
                <UInput size="xl" v-model="table.q" color="white" variant="outline" name="input" placeholder="Search..."
                    icon="i-heroicons-magnifying-glass-20-solid" />

                <UButton color="primary" variant="solid" label="Upload project" icon="i-heroicons-pencil-square"
                    @click="isOpen = true" />
            </div>
            <UTable :columns="columns" :rows="filteredAndPagedRows" :sort="{ column: 'projectName' }">
                <template #projectName-data="{ row }">
                    <NuxtLink :to="`/student/project/${row._id}`">{{ row.projectName }}</NuxtLink>
                </template>
            </UTable>

            <div class="flex justify-end mt-4">
                <UPagination v-model="table.page" :page-count="pageCount" :total="totalCount" />
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
                                    Upload project
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
                                <UFormGroup class="mb-4 flex-1" label="Type" name="type">
                                    <USelect v-model="state.type"
                                        :options="typeOptions.map(t => ({ label: t.type, value: t._id }))" />
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
import StudentLayout from '../../../layouts/StudentLayout.vue';
import { ref, onMounted, computed } from 'vue';
import * as z from 'zod';
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { Upload, Button } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam } from 'ant-design-vue';

const toast = useToast();

const isOpen = ref(false);
const fileList = ref([]);
const headers = {
    authorization: 'authorization-text',
};
const columns = [
    {
        key: "projectName",
        label: "Name",
        sortable: true,
    },
    {
        key: "description",
        label: "Description",
        sortable: true,
    },
    {
        key: "date_created",
        label: "Date created",
        sortable: true,
    },
    {
        key: "isApproved",
        label: "State",
        sortable: true,
        direction: "desc"
    }

];

const typeOptions = [
    {
        "type": "First",
        "_id": 0
    },
    {
        "type": "Second",
        "_id": 1
    }];

const project = ref<any[]>([]);

const state = ref({
    projectName: undefined,
    type: 0,
    description: undefined,
})

watch(() => state.value.type, (newValue) => {
    if (typeof newValue === 'string') {
        state.value.type = parseInt(newValue);
    }
});

const schema = z.object({
    projectName: z.string().min(1, "Name is required"),
    type: z.number().int().min(0, "Type is required"),
    description: z.string().min(1, "Description is required"),
});

type Schema = z.output<typeof schema>;

async function loadData() {
    try {
        const id = localStorage.getItem('_id')
        const response = await axios.get(`http://localhost:5000/api/project/${id}`)
        project.value = response.data
        project.value = response.data.map((item) => {
            return {
                ...item,
                isApproved: item.isApproved ? 'Đã xét duyệt' : item.isDenied ? 'Bị từ chối' : 'Chưa được chấp nhận'
            };
        });
    } catch (error) {
        console.error(error);
    }
}

onMounted(loadData);

async function submit(event: FormSubmitEvent<Schema>) {
    let projectId;
    const userId = localStorage.getItem('_id');
    const token = localStorage.getItem('token');

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    try {
        if (fileList.value.length === 0) {
            toast.error("Please upload your file");
            return;
        }

        if (fileList.value.length > 1) {
            toast.error("Only upload 1 file");
            return;
        }

        const formData = new FormData();
        formData.append('file', fileList.value[0]?.originFileObj);

        // Step 1: Create the project
        const createProjectResponse = await axios.post(`http://localhost:5000/api/project/${userId}`, event.data, { headers });
        projectId = createProjectResponse.data._id;

        // Step 2: Upload file
        const uploadFileResponse = await axios.post(`http://localhost:5000/api/upload/${projectId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (uploadFileResponse.data) {
            // Success: File uploaded and project created
            loadData();
            toast.success('Create project successfully.');
        } else {
            // Failure: Delete the project
            await axios.delete(`http://localhost:5000/api/project/${projectId}`, { headers });
            toast.error('Create project fail!');
        }

        isOpen.value = false;

    } catch (error) {
        // An error occurred during project creation or file upload
        if (projectId) {
            // If project creation was successful before the error, delete the project
            await axios.delete(`http://localhost:5000/api/project/${projectId}`, { headers });
        }
        console.error("Error during form submission:", error);
        toast.error("Create project fail");
    }
}

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

const table = ref({
    q: "",
    page: 1,
});

const pageCount = 10;
const filteredAndPagedRows = computed(() => {
    let filteredRows = project.value;
    if (table.value.q) {
        filteredRows = project.value.filter((project) => {
            return Object.values(project).some((value) => {
                return String(value)
                    .toLowerCase()
                    .includes(table.value.q.toLowerCase());
            });
        });
    }
    const pagedRows = filteredRows.slice(
        (table.value.page - 1) * pageCount,
        table.value.page * pageCount
    );
    return pagedRows;
});

const totalCount = computed(() => project.value.length);

</script> 