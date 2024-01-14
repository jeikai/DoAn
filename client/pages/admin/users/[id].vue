<template>
    <AdminLayout>
        <div class="mt-12 flex gap-8">
            <div class="flex-1 border flex flex-col h-fit">
                <div class="pt-12 px-8 text-center flex justify-center flex-col w-full items-center">
                    <img :src="getAvatarSrc" alt="" class="h-24 w-24 object-cover" />

                    <h3 class="font-semibold text-lg text-black my-2">{{ userData.name }}</h3>
                    <div class="p-2 text-center bg-[#f2f2f3] text-[#a8aaae] w-fit text-xs">{{ roleText }}</div>
                    <div class="border w-full my-6"></div>
                </div>
                <div class="px-8">
                    <p class="uppercase text-[#a8aaae] font-medium text-sm">Details</p>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Email: </span>
                        <span>{{ userData.email }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Phonenumber: </span>
                        <span>{{ userData.phoneNumber }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Date Of Birth: </span>
                        <span>{{ formattedDOB }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Address: </span>
                        <span>{{ userData.address }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Department: </span>
                        <span>{{ userData.Department }}</span>
                    </div>
                    <div class="mt-4">
                        <span class="font-medium text-sm">Major: </span>
                        <span>{{ userData.Majors }}</span>
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
                                    Update user information
                                </h3>
                                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                    @click="isOpen = false" />
                            </div>
                        </template>
                        <UForm :schema="schema" :state="state" @submit="submit">
                            <div class="flex gap-4">
                                <UFormGroup class="mb-4 flex-1" label="Name" name="name">
                                    <UInput v-model="state.name" placeholder="Username" />
                                </UFormGroup>

                                <UFormGroup class="mb-4 flex-1" label="Email" name="email">
                                    <UInput v-model="state.email" placeholder="Email" />
                                </UFormGroup>
                            </div>
                            <div class="p-2 text-center bg-[#f2f2f3] text-[#a8aaae] w-fit text-xs">{{ roleText }}</div>
                            <div class="flex gap-4">
                                <UFormGroup class="mb-4 flex-1" label="Phonenumber" name="phoneNumber">
                                    <UInput v-model="state.phoneNumber" placeholder="Phonenumber" />
                                </UFormGroup>
                                <UFormGroup class="mb-4 flex-1" label="Address" name="address">
                                    <UInput v-model="state.address" placeholder="Address" />
                                </UFormGroup>
                            </div>
                            <UFormGroup class="mb-4 flex-1" label="Date of Birth" name="DOB">
                                <UInput v-model="state.DOB" type="date" />
                            </UFormGroup>
                            <div class="flex gap-4">
                                <UFormGroup class="mb-4 flex-1" label="User department" name="department">
                                    <USelect v-model="state.department" :options="departmentOptions" />
                                </UFormGroup>
                            </div>
                            <UFormGroup class="mb-4 flex-1" label="User major" name="majors">
                                <USelect v-model="state.Majors" :options="majorOptions" />
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
                        <h3 class="text-lg font-semibold mb-4">Do you want to delete this account?</h3>
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
import AdminLayout from '~/layouts/AdminLayout.vue';
import axios from 'axios';
import avatarStudent from '@/assets/images/avatar_student.jpg';
import avatarTeacher from '@/assets/images/avatar_teacher.jpg';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
const route = useRoute()
const toast = useToast();
import * as z from 'zod';

let userData = ref({
    email: '',
    name: '',
    phoneNumber: '',
    DOB: '',
    role: 0,
    address: '',
    Department: '',
    Majors: ''
});

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
});
type Schema = z.output<typeof schema>;

async function loadData() {
    try {
        const id = route.params.id;
        const response = await axios.get(`http://localhost:5000/api/user/getUserInfor/${id}`);
        userData.value = response.data.userData;
        state.value = {
            name: userData.value.name,
            email: userData.value.email,
            phoneNumber: userData.value.phoneNumber,
            address: userData.value.address,
            role: userData.value.role,
            department: userData.value.Department,
            Majors: userData.value.Majors,
            DOB: formattedDOB.value
        };
    } catch (error) {
        console.error(error);
    }
}
onMounted(loadData);

async function submit(event: FormSubmitEvent<Schema>) {
    try {
        const id = route.params.id;
        const response = await axios.put(`http://localhost:5000/api/user/updateUser/${id}`, event.data);
        const stateResponse = response.data.status;
        if (stateResponse) {
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

const isOpen = ref(false);
const isDeleteModalOpen = ref(false);

const study = [
    {
        department: "CNTT CLC",
        major: ["KHMT", "HTTT", "MMT"]
    },
    {
        department: "CNTT",
        major: ["CNTT", "CNTTJapan"]
    },
    {
        department: "Computer and Robotics",
        major: ["Computer Engineering", "Robotics Engineering"]
    },
    {
        department: "Engineering Physics",
        major: ["Engineering Physics"]
    },
    {
        department: "Mechanical Engineering",
        major: ["Mechanical Engineering"]
    },
    {
        department: "Aerospace Engineering",
        major: ["Aerospace Engineering"]
    },
];

const formattedDOB = computed(() => { 
    console.log(userData.value.DOB)
    const rawDOB = userData.value.DOB;
    if (rawDOB) {
        const date = new Date(rawDOB);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    return '';
});

const state = ref({
    name: userData.value.name,
    email: userData.value.email,
    phoneNumber: userData.value.phoneNumber,
    address: userData.value.address,
    role: userData.value.role,
    department: userData.value.Department,
    Majors: userData.value.Majors,
    DOB: formattedDOB
});

const departmentOptions = computed(() => study.map(dep => dep.department));

const majorOptions = computed(() => {
    const selecteddepartment = state.value.department;
    const selecteddepartmentObj = study.find(dep => dep.department === selecteddepartment);
    return selecteddepartmentObj ? selecteddepartmentObj.major : [];
});

const roleText = computed(() => {
    return userData.value.role === 0 ? 'Student' : 'Teacher';
}); 
const getAvatarSrc = computed(() => {
    if (userData.value.role === 0) {
        return avatarStudent;
    } else {
        return avatarTeacher;
    }
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
        const response = await axios.delete(`http://localhost:5000/api/user/deleteUser/${id}`);

        closeDeleteModal();

        if (response.status === 200 && response.data.status) {
            toast.success("Delete successfully.");
            router.push('/admin/users');
        } else {
            toast.error(response.data.message || "An error occurred while deleting.");
        }
    } catch (error) {
        console.error(error);
        toast.error(error);
    }
}

const links = ref([
    { name: 'Account', path: 'admin-users-id', url: `/admin/users/${route.params.id}`, icon: 'material-symbols:person-check-rounded' },
    { name: 'Security', path: 'admin-users-id-security', url: `/admin/users/${route.params.id}/security`, icon: 'material-symbols:lock-open-outline-rounded' },
])

</script>
