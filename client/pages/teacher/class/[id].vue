<template>
    <TeacherLayout>
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
                    <div class="mt-4"></div>
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
    </TeacherLayout>
</template> 

<script setup lang="ts">
import TeacherLayout from '../layouts/TeacherLayout.vue';
import axios from 'axios';
const route = useRoute()

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

async function loadData() {
    try {
        const id = route.params.id;
        const response = await axios.get(`http://localhost:5000/api/class/getDetail/${id}`);
        teacherInfo.value = response.data.teacherId;
    } catch (error) {
        console.error(error);
    }
}

onMounted(loadData)

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
const links = ref([
{ name: 'Students', path: 'teacher-class-id', url: `/teacher/class/${route.params.id}`, icon: 'material-symbols:person-check-rounded' },
])
</script>
 