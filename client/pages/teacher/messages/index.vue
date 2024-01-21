<template>
    <TeacherLayout>
        <div class="flex border shadow-md">
            <div class="w-1/3 border-r">
                <div class="header flex gap-4 items-center h-14 border-b px-4 mb-4">
                    <UAvatar chip-color="primary" chip-text="" chip-position="bottom-right" size="md"
                        src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
                    <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
                        name="input" placeholder="Search..." />
                    <UButton color="primary" variant="solid" label="Add new chat" icon="i-heroicons-pencil-square"
                        @click="isOpen = true" />
                </div>
                <div class="px-2 w-full h-[75vh] overflow-x-auto">
                    <div class="flex gap-4 p-3 mb-2 rounded-md" v-for="chat in chatGroup">
                        <div>
                            <UAvatar chip-color="primary" chip-text="" chip-position="bottom-right" size="md"
                                src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
                        </div>
                        <NuxtLink :to="`/teacher/messages/${chat.id}`" class="text-black no-underline">
                            <div class="flex-1">
                                <div class="flex justify-between">
                                    <h3 class="font-semibold">{{ chat.chatName }}</h3>
                                </div>
                                <p class="w-40 truncate">
                                    {{ chat.lastMessage }}
                                </p>
                                <p class="text-sm text-gray-500">
                                    {{ formatTime(chat.lastTime) }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="w-2/3 flex-container">
                <div className="welcome_container">
                    <img src="../../../assets/images/heart.gif" />
                    <h1>
                        WELCOME
                    </h1>
                    <h3>Please select a chat to Start messaging.</h3>
                </div>
            </div>
        </div>
        <template>
            <UModal v-model="isOpen" prevent-close>
                <UCard :ui="{
                    ring: '',
                    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Add new chat
                            </h3>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                @click="isOpen = false" />
                        </div>
                    </template>
                    <UForm :schema="schema" :state="state" @submit="submit">

                        <UFormGroup class="mb-4 flex-1" label="Name of chat" name="chatName">
                            <UInput v-model="state.chatName" placeholder="Group name" />
                        </UFormGroup>
                        <UFormGroup class="mb-4 flex-1" label="Add by email" name="listUser">
                            <Select v-model:value="state.listUser"
                                :options="studentOptions.map(t => ({ label: t.email, value: t._id }))" mode="tags"
                                placeholder="Please select" class="w-100"></Select>
                        </UFormGroup>
                        <UButton type="submit"> Submit </UButton>
                    </UForm>
                </UCard>
            </UModal>
        </template>
    </TeacherLayout>
</template>

<script setup lang="ts">
import TeacherLayout from '../layouts/TeacherLayout.vue';
import { ref, onMounted } from 'vue';
import * as z from "zod";
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { Select } from 'ant-design-vue'
import { database, ref as dbRef, push, onValue } from '~/firebase';
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const isOpen = ref(false);
const toast = useToast();

const schema = z.object({
    listUser: z.array(z.string()).min(1, "Please select at least one user"),
});
type Schema = z.output<typeof schema>;
const MAX_CHAT_NAME_LENGTH = 15;
let studentOptions = ref([]);
const state = ref({
    chatName: '',
    listUser: [] as string[],
});

const chatGroup = ref([])

async function loadData() {
    try {
        const userId = process.client ? localStorage.getItem('_id') : '';
        const responsePeople = await axios.get("http://localhost:5000/api/user/getAllTeacherAndStudent");
        studentOptions.value = responsePeople.data.userData
            .map(person => ({ _id: person._id, email: person.email, name: person.name }));

        onValue(dbRef(database, "chat"), (data) => {
            chatGroup.value = [];
            data.forEach((d) => {
                const chat = d.val();
                chat.id = d.key;
                chat.chatName = shortenString(chat.chatName, MAX_CHAT_NAME_LENGTH);

                if (chat.listUser && chat.listUser.includes(userId)) {
                    if (chat.listMessage && Object.keys(chat.listMessage).length > 0) {
                        const lastMessageKey = Object.keys(chat.listMessage).pop();
                        chat.lastMessage = chat.listMessage[lastMessageKey].message;
                        chat.lastTime = chat.listMessage[lastMessageKey].time;
                    } else {
                        chat.lastMessage = null;
                        chat.lastTime = null;
                    }

                    chatGroup.value.push(chat);
                }
            });
        });
        console.log(chatGroup);
    } catch (error) {
        toast.error('Error occurred');
    }
}

onMounted(loadData);

async function submit(event: FormSubmitEvent<Schema>) {
    try {
        const userId = process.client ? localStorage.getItem('_id') : '';

        const selectedUsers = event.data.listUser;

        if (!selectedUsers.includes(userId)) {
            selectedUsers.push(userId);
        }

        const newChat = {
            chatName: event.data.chatName,
            listUser: selectedUsers,
            listMessage: []
        };

        await push(dbRef(database, "chat"), newChat);

        toast.success('Chat created successfully!');
        isOpen.value = false;
    } catch (error) {
        console.log(error);
        toast.error('Error creating chat');
    }
}


function shortenString(str, maxLength) {
    return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
}

function formatTime(isoString) {
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };

    return new Date(isoString).toLocaleString(undefined, options);
}
</script>

<style>
  .flex-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: auto;
  }

  .welcome_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: black;
  }

  img {
    height: 10rem;
  }
</style>
