<template>
  <AdminLayout>
    <div class="text-right mb-4">
      <UButton size="lg" variant="outline" label="Add Class" @click="isOpen = true" />
    </div>
    <div class="grid grid-cols-3 gap-4">
      <template v-for="classItem in classes" :key="classItem._id">
        <NuxtLink :to="`/admin/class/${classItem._id}`" class="max-w-xs p-4 shadow-lg" style="text-decoration: none;">
          <img
            src="https://static.vecteezy.com/system/resources/previews/009/385/472/non_2x/school-desk-clipart-design-illustration-free-png.png"
            class="w-full object-cover mb-4 block" />
          <div class="font-semibold">{{ classItem.className }}</div>
          <div>{{ classItem.listUser.length }} students</div>
        </NuxtLink>
      </template>
    </div>

    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Add a new class
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>

        <UForm :schema="schema" :state="state" @submit="submit">
          <div class="flex gap-4">
            <UFormGroup class="mb-4 flex-1" label="Class Name" name="className">
              <UInput v-model="state.className" placeholder="Class Name" />
            </UFormGroup>
            <UFormGroup class="mb-4 flex-1" label="Teacher" name="teacherId">
              <USelect v-model="state.teacherId" :options="teacher.map(t => ({ label: t.name, value: t._id }))" />
            </UFormGroup>
          </div>
          <UFormGroup class="mb-4 flex-1" label="Students" name="listUser">
            <Select v-model:value="state.listUser" :options="studentOptions.map(t => ({ label: t.email, value: t._id }))"
              mode="tags" placeholder="Please select" class="w-100"></Select>
          </UFormGroup>
          <UFormGroup class="mb-4 flex-1" label="Examination Board" name="examinationBoard">
            <Select v-model:value="state.examinationBoard"
              :options="examination.map(t => ({ label: t.name, value: t._id }))" mode="tags" placeholder="Please select"
              class="w-100"></Select>
          </UFormGroup>
          <UButton type="submit"> Submit </UButton>
        </UForm>
      </UCard>
    </UModal>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '../layouts/AdminLayout.vue';
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { ref } from 'vue';
import { Select } from 'ant-design-vue'

let student = ref([]);
let studentOptions = ref([]);

const isOpen = ref(false);
const toast = useToast();

const token = process.client ? localStorage.getItem('token') : '';

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

interface ClassItem {
  _id: string;
  className: string;
  teacherId: string;
  listUser: string[];
  examinationBoard: string[];
}

const schema = z.object({
  listUser: z.array(z.string()),
  examinationBoard: z.array(z.string())
});

type Schema = z.output<typeof schema>;

let teacher: string[] = [];

let examination: string[] = [];

const classes = ref<ClassItem[]>([]);

const state = ref({
  className: undefined,
  listUser: [] as string[],
  teacherId: undefined,
  examinationBoard: [] as string[],
});

async function loadData() {
  try {
    const response_class = await axios.get("http://localhost:5000/api/class");
    classes.value = response_class.data;
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
  } catch (error) {
    console.error(error);
  }
}

onMounted(loadData);

async function submit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
  if (!event.data.className || !event.data.teacherId || event.data.listUser.length === 0) {
    toast.error("Please fill in all required fields.");
  } else {
    try {
      const response = await axios.post('http://localhost:5000/api/class', event.data, { headers });
      const stateResponse = response.data;
      if (stateResponse) {
        isOpen.value = false;
        toast.success("Register class successfully.");
        loadData();
      } else {
        toast.error("Error occurred!");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred during form submission.");
    }
  }

}
</script>