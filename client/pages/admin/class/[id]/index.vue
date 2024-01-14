<template>
  <div class="mt-4 px-4 py-8 border">
    <h3 class="font-medium text-lg text-[#6f6b7d]">Project</h3>
    <div>
      <div class="flex gap-4 justify-end mb-4">
        <UInput size="xl" v-model="table.q" color="white" variant="outline" name="input" placeholder="Search..."
          icon="i-heroicons-magnifying-glass-20-solid" />
      </div>
      <UTable :columns="columns" :rows="filteredAndPagedRows" :sort="{ column: 'title' }">
        <template #name-data="{ row }">
          <NuxtLink :to="`/admin/users/${row._id}`">{{ row.name }}</NuxtLink>
        </template>

      </UTable>
      <div class="flex justify-end mt-4">
        <UPagination v-model="table.page" :page-count="pageCount" :total="totalCount" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
const route = useRoute()

const student = ref<any[]>([]);

async function loadData() {
  try {
    const id = route.params.id;
    const response = await axios.get(`http://localhost:5000/api/class/${id}`);
    student.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(loadData);

const columns = [
  {
    key: "_id",
    label: "ID",
    sortable: true,
  },
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
    key: "role",
    label: "Role",
    sortable: true,
  },
  {
    key: "actions",
  },
];

const table = ref({
  q: "",
  page: 1,
});

const pageCount = 10;
const filteredAndPagedRows = computed(() => {
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
  console.log(pagedRows);
  return pagedRows;
});

const totalCount = computed(() => student.value.length);

</script>