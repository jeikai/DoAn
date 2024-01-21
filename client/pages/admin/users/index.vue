<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import * as z from 'zod';
import AdminLayout from "~/layouts/AdminLayout.vue";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { Upload, Button } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam } from 'ant-design-vue';

const toast = useToast();
const isOpen = ref(false);
const isOpenUpload = ref(false);
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
  }
];
const fileList = ref([]);
const headers = {
  authorization: 'authorization-text',
};
const people = ref<any[]>([{
  _id: '',
  name: '',
  phoneNumber: '',
  email: '',
  role: undefined
}]);

async function loadData() {
  try {
    const response = await axios.get('http://localhost:5000/api/user/getAllTeacherAndStudent');
    const userData = response.data.userData || [];
    people.value = userData.map(person => ({
      ...person,
      role: person.role === 1 ? 'Teacher' : 'Student'
    }));
    console.log(people.value)
  } catch (error) {
    console.error(error);
  }
}

onMounted(loadData);

function downloadCsv(filename: string, csvData: string) {
  const encodedData = '\ufeff' + encodeURIComponent(csvData);
  const element = document.createElement("a");
  element.setAttribute("href", `data:text/csv;charset=utf-8,${encodedData}`);
  element.setAttribute("download", filename);
  element.style.display = "none";

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

async function exportToCsv() {
  try {
    const headerRow = ['_id', 'email', 'name', 'phoneNumber', 'DOB', 'address', 'Department', 'Majors', 'role'];

    const csvData = people.value
      .map(person => {
        const rowData = headerRow.map(column => {
          return person.hasOwnProperty(column) && person[column] !== undefined && person[column] !== null
            ? String(person[column])
            : ' ';
        });

        return rowData.join(',');
      });
    const fullCsvData = [headerRow.join(','), ...csvData].join('\n');
    downloadCsv('export.csv', fullCsvData);
  } catch (error) {
    console.error(error);
  }
}

const table = ref({
  q: "",
  page: 1,
});

const pageCount = 5;
const filteredAndPagedRows = computed(() => {
  let filteredRows = people.value;
  if (table.value.q) {
    filteredRows = people.value.filter((person) => {
      return Object.values(person).some((value) => {
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
  console.log(pagedRows);
  return pagedRows;
});

const totalCount = computed(() => people.value.length);

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    const allowedFileTypes = ['application/csv', 'application/excel', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!allowedFileTypes.includes(info.file.type)) {
      toast.error(`Only CSV, Excel files are allowed.`);
      fileList.value = fileList.value.filter(file => file.uid !== info.file.uid);
      return;
    }
    toast.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    toast.error(`${info.file.name} file upload failed.`);
  }
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().refine((data) => data === state.value.password, {
    message: "Passwords do not match",
  }),
});
type Schema = z.output<typeof schema>;

const roles = ["Admin", "Teacher", "Student"];
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

const state = ref({
  name: undefined,
  email: undefined,
  phoneNumber: undefined,
  address: undefined,
  password: undefined,
  confirmPassword: undefined,
  role: roles[0],
  Department: study[0].department,
  Majors: study[0].major[0],
  DOB: undefined
});

const departmentOptions = computed(() => study.map(dep => dep.department));

const majorOptions = computed(() => {
  const selecteddepartment = state.value.Department;
  const selecteddepartmentObj = study.find(dep => dep.department === selecteddepartment);
  return selecteddepartmentObj ? selecteddepartmentObj.major : [];
});

async function submit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
  try {
    const response = await axios.post('http://localhost:5000/api/user/logup', event.data);
    const stateResponse = response.data.status;
    if (stateResponse) {
      isOpen.value = false;
      toast.success("Register account successfully.");
      loadData();
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error("Error during form submission:", error);
    toast.error("An error occurred during form submission.");
  }
}
async function uploadFile(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
  try {
    const formData = new FormData();
    formData.append('file', fileList.value[0]?.originFileObj);
    console.log(formData)
    const response = await axios.post('http://localhost:5000/api/uploadUser', formData);
    // const stateResponse = response.data.status;
    // if (stateResponse) {
    //   isOpen.value = false;
    //   toast.success("Register account successfully.");
    //   loadData(); 
    // } else {
    //   toast.error(response.data.message);
    // }
  } catch (error) {
    console.error("Error during form submission:", error);
    toast.error("An error occurred during form submission.");
  }
}
</script>

<template>
  <AdminLayout>
    <div class="border-2 p-10">
      <div class="flex gap-4 justify-end mb-4">
        <UInput size="xl" v-model="table.q" color="white" variant="outline" name="input" placeholder="Search..."
          icon="i-heroicons-magnifying-glass-20-solid" />

        <UButton color="indigo" variant="outline" label="Export" icon="i-heroicons-pencil-square" @click="exportToCsv" />
        <UButton color="blue" variant="outline" label="Upload file" icon="i-heroicons-arrow-up-tray"
          @click="isOpenUpload = true" />
        <UButton color="primary" variant="solid" label="Add new user" icon="i-heroicons-pencil-square"
          @click="isOpen = true" />
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
                  Add a new user
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
                <UFormGroup class="mb-4 flex-1" label="Password" name="password">
                  <UInput v-model="state.password" type="password" placeholder="Enter your password" />
                </UFormGroup>
                <UFormGroup class="mb-4 flex-1" label="Confirm Password" name="confirmPassword">
                  <UInput v-model="state.confirmPassword" type="password" placeholder="Enter your confirm password" />
                </UFormGroup>
              </div>
              <div class="flex gap-4">
                <UFormGroup class="mb-4 flex-1" label="User role" name="role">
                  <USelect v-model="state.role" :options="roles" />
                </UFormGroup>
                <UFormGroup class="mb-4 flex-1" label="User department" name="Department">
                  <USelect v-model="state.Department" :options="departmentOptions" />
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
      <div>
        <UModal v-model="isOpenUpload" prevent-close>
          <UCard :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  Upload file
                </h3>
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                  @click="isOpenUpload = false" />
              </div>
            </template>
            <UForm :state="fileList" @submit="uploadFile">
              <div class="flex gap-4">
                <UFormGroup class="mb-4 flex-1" label="File">
                  <Upload v-model:file-list="fileList" name="file" :headers="headers" @change="handleChange">
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
  </AdminLayout>
</template>