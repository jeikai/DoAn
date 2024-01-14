<template>
    <TeacherLayout>
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
                </div>
            </div>
            <div class="flex-[2]">
                <div class="w-full flex gap-4">
                    <div class="mt-4 px-4 py-8 border">
                        <h3 class="font-medium text-lg text-[#6f6b7d]">Project</h3>
                        <div>
                            <div class="flex gap-4 justify-end mb-4">
                                <UInput size="xl" v-model="table.q" color="white" variant="outline" name="input"
                                    placeholder="Search..." icon="i-heroicons-magnifying-glass-20-solid" />
                            </div>
                            <UTable :columns="columns" :rows="filteredAndPagedRows" :sort="{ column: 'title' }">
                                <template #projectName-data="{ row }">
                                    <!-- <NuxtLink :to="`/teacher/user/project/${row._id}`">{{ row.projectName }}</NuxtLink> -->
                                    <NuxtLink :to="{ name: 'teacher-user-project-id-classId-userId', params: { id: row._id, userId: route.params.id, classId: route.params.classId } }">{{ row.projectName }}</NuxtLink>
                                </template>
                            </UTable>
                            <div class="flex justify-end mt-4">
                                <UPagination v-model="table.page" :page-count="pageCount" :total="totalCount" />
                            </div>
                        </div> 
                    </div>
                </div>
                <NuxtPage />
            </div>
        </div>
    </TeacherLayout>
</template>
<script setup lang="ts">
import TeacherLayout from '../layouts/TeacherLayout.vue';
import axios from 'axios';
import avatarStudent from '@/assets/images/avatar_student.jpg';
import avatarTeacher from '@/assets/images/avatar_teacher.jpg';
const route = useRoute()
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
]

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
const project = ref<any[]>([]);
async function loadData() {
    try {
        const userId = localStorage.getItem('_id');
        const id = route.params.id;
        const classId = route.params.classId;
        const response_userData = await axios.get(`http://localhost:5000/api/user/getUserInfor/${id}`);
        userData.value = response_userData.data.userData;
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
        const response_class = await axios.get(`http://localhost:5000/api/class/getDetail/${classId}`);
        console.log(response_class.data.teacherId, userId);
        const response = await axios.get(`http://localhost:5000/api/project/${id}`)
        if (userId == response_class.data.teacherId._id) {
            project.value = response.data.map((item) => {
                return {
                    ...item, 
                    isApproved: item.isApproved ? 'Đã xét duyệt' : 'Chưa được chấp nhận'
                };
            });
        } else {
            project.value = response.data.filter(item => item.type === 1).map((item) => {
                return {
                    ...item,
                    isApproved: item.isApproved ? 'Đã xét duyệt' : 'Chưa được chấp nhận'
                };
            });
        }

    } catch (error) {
        console.error(error);
    }
}
onMounted(loadData);

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

const table = ref({
    q: "",
    page: 1,
});

const pageCount = 10;
const filteredAndPagedRows = computed(() => {
    let filteredRows = project.value;

    if (table.value.q) {
        filteredRows = filteredRows.filter((data) => {
            return Object.values(data).some((value) => {
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

const totalCount = computed(() => {
    return project.value;
});
</script>