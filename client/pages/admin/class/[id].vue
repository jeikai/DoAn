<template>
    <AdminLayout>
        <div class="mt-12 flex gap-8">
            <div class="flex-1 border flex flex-col h-fit">
                <div class="pt-12 px-8 text-center flex justify-center flex-col w-full items-center">
                    <img src="https://static.vecteezy.com/system/resources/previews/009/385/472/non_2x/school-desk-clipart-design-illustration-free-png.png"
                        alt="" class="h-24 w-24 object-cover" />

                    <h3 class="font-semibold text-lg text-black my-2">{{ teacherInfo.name }}</h3>
                    <div class="p-2 text-center bg-[#f2f2f3] text-[#a8aaae] w-fit text-xs">Teacher</div>
                    <div class="border w-full my-6"></div>
                </div>
                <div class="px-8">
                    <p class="uppercase text-[#a8aaae] font-medium text-sm">Details</p>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Email: </span>
                        <span>{{ teacherInfo.email }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Phonenumber: </span>
                        <span>{{ teacherInfo.phoneNumber }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Date Of Birth: </span>
                        <span>{{ formattedDOB }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Address: </span>
                        <span>{{ teacherInfo.address }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Department: </span>
                        <span>{{ teacherInfo.Department }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Major: </span>
                        <span>{{ teacherInfo.Majors }}</span>
                    </div>
                </div>
                <div class="flex gap-4 my-4 m-auto">
                    <UButton color="primary" variant="solid" size="xl" @click="isOpen = true">Edit</UButton>
                    <UButton color="red" variant="outline" size="xl" @click="openDeleteModal">Delete</UButton>
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
                                    Update information of class
                                </h3>
                                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                    @click="isOpen = false" />
                            </div>
                        </template>

                        <UForm :state="state" @submit="submit">
                            <div class="flex gap-4">
                                <UFormGroup class="mb-4 flex-1" label="Class Name" name="className">
                                    <UInput v-model="state.className" placeholder="Class Name" />
                                </UFormGroup>
                                <UFormGroup class="mb-4 flex-1" label="Teacher" name="teacherId">
                                    <Select v-model:value="state.teacherId" class="w-80"
                                        :options="teacher.map(t => ({ label: t.name, value: t._id }))"></Select>
                                </UFormGroup>
                            </div>
                            <UFormGroup class="mb-4 flex-1" label="Students" name="listUser">
                                <Select v-model:value="state.listUser"
                                    :options="studentOptions.map(t => ({ label: t.email, value: t._id }))" mode="tags"
                                    placeholder="Please select" class="w-100"></Select>
                            </UFormGroup>
                            <UFormGroup class="mb-4 flex-1" label="Examination Board" name="examinationBoard">
                                <Select v-model:value="state.examinationBoard"
                                    :options="examination.map(t => ({ label: t.name, value: t._id }))" mode="tags"
                                    placeholder="Please select" class="w-100"></Select>
                            </UFormGroup>
                            <UButton type="submit"> Submit </UButton>
                        </UForm>
                    </UCard>
                </UModal>
            </div>
        </template>
        <template>
            <UModal v-model="isDeleteModalOpen" prevent-close>
                <UCard>
                    <div class="text-center p-6">
                        <h3 class="text-lg font-semibold mb-4">Do you want to delete this class?</h3>
                        <div class="flex justify-center gap-4">
                            <UButton color="red" variant="solid" @click="deleteAccount">Accept</UButton>
                            <UButton color="gray" variant="ghost" @click="closeDeleteModal">Cancel</UButton>
                        </div>
                    </div>
                </UCard>
            </UModal>
        </template>
    </AdminLayout>
</template> 

<script setup lang="ts">
import AdminLayout from '../layouts/AdminLayout.vue';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import * as z from 'zod';
import { Select } from 'ant-design-vue'

const route = useRoute()
const toast = useToast();
const isDeleteModalOpen = ref(false);
const isOpen = ref(false);
const token = process.client ? localStorage.getItem('token') : '';

const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
};

const schema = z.object({
    listUser: z.array(z.string()),
});

type Schema = z.output<typeof schema>;

const teacherInfo = ref({
    _id: '',
    email: '',
    name: '',
    phoneNumber: '',
    DOB: '',
    role: 1,
    address: '',
    Department: '',
    Majors: ''
});

let teacher: string[] = [];
let studentOptions = ref([]);
let examination: string[] = [];

let detailClass = ref({
    className: '',
    teacherId: '',
    listUser: [],
    examinationBoard: [],
});

const state = ref({
    className: undefined,
    listUser: undefined,
    teacherId: undefined,
    examinationBoard: undefined,
});
async function loadData() {
    try {
        const id = route.params.id;

        const response_detail = await axios.get(`http://localhost:5000/api/class/getDetail/${id}`);
        detailClass.value = response_detail.data
        teacherInfo.value = detailClass.value.teacherId;

        const response_people = await axios.get("http://localhost:5000/api/user/getAllTeacherAndStudent");
        const userData = response_people.data.userData;

        teacher = userData
            .filter(user => user.role === 1)
            .map(teacher => ({ _id: teacher._id, name: teacher.name }));

        examination = userData
            .filter(user => user.role === 1)
            .map(teacher => ({ _id: teacher._id, name: teacher.name }));

        studentOptions = userData
            .filter(user => user.role === 0)
            .map(student => ({ _id: student._id, email: student.email }));

        state.value = {
            className: detailClass.value.className,
            teacherId: teacher.find(t => t.name === teacherInfo.value.name)?._id,
            listUser: detailClass.value.listUser.map(t => t._id),
            examinationBoard: detailClass.value.examinationBoard.map(t => t._id)
        };
        console.log(state.value)
    } catch (error) {
        console.error(error);
    }
}

onMounted(loadData);

async function submit(event: FormSubmitEvent<Schema>) {
    console.log(event.data)
    if (!event.data.className || !event.data.listUser || event.data.listUser.length === 0 || !event.data.teacherId) {
        toast.error("Please fill in all required fields.");
    } else {
        try {
            const id = route.params.id;

            const response = await axios.put(`http://localhost:5000/api/class/${id}`, event.data, { headers });
            if (response.data) {
                toast.success("Update user successfully.");
                loadData();
                isOpen.value = false;
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error during form submission:", error);
            toast.error("An error occurred during form submission.");
        }
    }
}

const formattedDOB = computed(() => {
    const rawDOB = teacherInfo.value.DOB;
    if (rawDOB) {
        const date = new Date(rawDOB);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    return '';
});

function openDeleteModal() {
    isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
    isDeleteModalOpen.value = false;
}

async function deleteAccount() {
    const router = useRouter();
    try {
        const id = route.params.id;
        const response = await axios.delete(`http://localhost:5000/api/class/${id}`);

        closeDeleteModal();

        if (response.status === 200 && response.data) {
            toast.success("Delete successfully.");
            router.push('/admin/class');
        } else {
            toast.error("An error occurred while deleting.");
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
}

const links = ref([
    { name: 'Students', path: 'admin-class-id', url: `/admin/class/${route.params.id}`, icon: 'material-symbols:person-check-rounded' },
]);
</script>
 