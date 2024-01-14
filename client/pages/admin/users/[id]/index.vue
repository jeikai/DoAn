<template>
  <div class="mt-4 px-4 py-8 border">
    <h3 class="font-medium text-lg text-[#6f6b7d]">Project</h3>
    <div>
      <div class="flex gap-4 justify-end mb-4">
        <UInput size="xl" v-model="table.q" color="white" variant="outline" name="input" placeholder="Search..."
          icon="i-heroicons-magnifying-glass-20-solid" />
      </div>
      <UTable :columns="columns" :rows="filteredAndPagedRows" :sort="{ column: 'title' }">
      </UTable>
      <div class="flex justify-end mt-4">
        <UPagination v-model="table.page" :page-count="pageCount" :total="totalCount" />
      </div>
    </div>
  </div> 
</template>

<script setup lang="ts">
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const route = useRoute()
let columns = [];

const project = ref<any[]>([]);
const classes = ref<any[]>([]);

async function loadData() {
  try {
    const id = route.params.id;
    const response_userData = await axios.get(`http://localhost:5000/api/user/getUserInfor/${id}`);
    console.log(response_userData)
    const isStudent = response_userData.data.userData.role === 0 ? true : false;
    if (isStudent) {
      const response = await axios.get(`http://localhost:5000/api/project/${id}`)
      project.value = response.data
      project.value = response.data.map((item) => {
        return {
          ...item,
          isApproved: item.isApproved ? 'Đã xét duyệt' : 'Chưa được chấp nhận'
        };
      });
      columns = [
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
    } else {
      const response = await axios.get("http://localhost:5000/api/class");
      classes.value = response.data.filter(classItem => classItem.teacherId.includes(id)).map((item) => {
        return {
          ...item,
          listUser: item.listUser.length,
          examinationBoard: item.examinationBoard.length
        };
      });
      columns = [
        {
          key: "className",
          label: "Class name",
          sortable: true,
        },
        {
          key: "listUser",
          label: "No Students",
          sortable: true,
        },
        {
          key: "examinationBoard",
          label: "No ExaminationBoard",
          sortable: true,
        }
      ];
    }
  } catch (error) {
    console.error(error);
  }
}

onMounted(loadData);

const table = ref({
  q: "",
  page: 1,
});

const pageCount = 10;
const filteredAndPagedRows = computed(() => {
  let filteredRows = project.value.length > 0 ? project.value : classes.value;

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
  return project.value.length > 0 ? project.value.length : classes.value.length;
});


</script>

<style lang="scss" scoped></style>