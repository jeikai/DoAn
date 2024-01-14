<template>
    <div class="mt-4 px-4 py-8 border">
        <h3 class="font-medium text-lg text-[#6f6b7d]">Student</h3>
        <div>
            <div class="flex gap-4 justify-end mb-4">
                <UInput size="xl" v-model="table.q" color="white" variant="outline" name="input" placeholder="Search..."
                    icon="i-heroicons-magnifying-glass-20-solid" />
            </div>
            <UTable :columns="columns" :rows="filteredAndPagedRowsStudent" :sort="{ column: 'title' }">
                <template #name-data="{ row }">
                    <NuxtLink :to="{ name: 'teacher-user-id-classId', params: { id: row._id, classId: route.params.id } }">{{ row.name }}</NuxtLink>
                </template>
            </UTable>
            <div class="flex justify-end mt-4">
                <UPagination v-model="table.page" :page-count="pageCount" :total="totalCountStudent" />
            </div>
        </div> 
    </div>
    <div class="mt-4 px-4 py-8 border">
        <h3 class="font-medium text-lg text-[#6f6b7d]">Examination Board</h3>
        <div>
            <div class="flex gap-4 justify-end mb-4">
                <UInput size="xl" v-model="table.q" color="white" variant="outline" name="input" placeholder="Search..."
                    icon="i-heroicons-magnifying-glass-20-solid" />
            </div>
            <UTable :columns="columns" :rows="filteredAndPagedRowsExamin" :sort="{ column: 'title' }">
                <template #name-data="{ row }">
                    {{ row.name }}
                </template>
            </UTable>
            <div class="flex justify-end mt-4">
                <UPagination v-model="table.page" :page-count="pageCount" :total="totalCountExamin" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
const route = useRoute()

const student = ref<any[]>([]);
const examinationBoard = ref<any[]>([]);
async function loadData() {
    try {
        const id = route.params.id;
        const response = await axios.get(`http://localhost:5000/api/class/getDetail/${id}`);
        student.value = response.data.listUser;
        examinationBoard.value = response.data.examinationBoard;
    } catch (error) {
        console.error(error);
    }
}

onMounted(loadData);

const columns = [
    {
        key: "name",
        label: "Name",
        sortable: true,
    },
    {
        key: "phoneNumber",
        label: "Phonenumber",
        sortable: true,
    },
    {
        key: "email",
        label: "Email",
        sortable: true,
        direction: "desc",
    },
    {
        key: "address",
        label: "Address",
        sortable: true,
        direction: "desc",
    }
];

const table = ref({
    q: "",
    page: 1,
});

const pageCount = 10;
const filteredAndPagedRowsStudent = computed(() => {
    let filteredRows = student.value;
    if (table.value.q) {
        filteredRows = student.value.filter((person) => {
            return Object.values(person).some((value) => {
                return String(value)
                    .toLowerCase()
                    .includes(table.value.q.toLowerCase());
            });
        });
    }
    filteredRows = filteredRows.filter((person) => person.role === 0);
    const pagedRows = filteredRows.slice(
        (table.value.page - 1) * pageCount,
        table.value.page * pageCount
    );
    return pagedRows;
});

const totalCountStudent = computed(() => student.value.length);

const filteredAndPagedRowsExamin = computed(() => {
    let filteredRows = examinationBoard.value;
    if (table.value.q) {
        filteredRows = examinationBoard.value.filter((examinationBoard) => {
            return Object.values(examinationBoard).some((value) => {
                return String(value)
                    .toLowerCase()
                    .includes(table.value.q.toLowerCase());
            });
        });
    }
    filteredRows = filteredRows.filter((examinationBoard) => examinationBoard.role === 1);
    const pagedRows = filteredRows.slice(
        (table.value.page - 1) * pageCount,
        table.value.page * pageCount
    );
    return pagedRows;
});

const totalCountExamin = computed(() => student.value.length);
</script>