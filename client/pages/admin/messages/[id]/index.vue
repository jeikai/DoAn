<template>
    <AdminLayout>
        <div class="header flex gap-4 items-center h-14 border-b px-4">
            <div class="flex-1">
                <div class="flex gap-4 items-center">
                    <UAvatar chip-color="primary" chip-text="" chip-position="bottom-right" size="md"
                        src="https://static.vecteezy.com/system/resources/previews/009/385/472/non_2x/school-desk-clipart-design-illustration-free-png.png"
                        alt="Avatar" />
                    <div>
                        <h3 class="font-semibold">{{ messages.chatName }}</h3>
                    </div>
                </div>
            </div>
            <div>
                <Icon name="material-symbols:groups-2" class="mr-4 mt-[2px] text-gray-500" size="25"
                    @click="isOpenView = true" />
                <Icon name="material-symbols:person-add" class="mr-4 mt-[2px] text-gray-500" size="25"
                    @click="isOpenAdd = true" />
                <Icon name="material-symbols:edit" class="mr-4 mt-[2px] text-gray-500" size="25"
                    @click="isOpenUpdate = true" />
            </div>
        </div>
        <div class="px-4 w-full bg-[#f8f7fa]">
            <ul class="h-[calc(75vh-80px)] overflow-x-auto flex flex-col-reverse py-4">
                <div v-for="msg in messages.listMessage" :key="msg">
                    <li class="flex gap-4 mb-4" :class="{ 'justify-end': msg.userId === userId }">
                        <div class="w-3/4">
                            <p class="bg-white shadow-md p-4 mb-2">{{ msg.message }}</p>
                            <p class="text-gray-500">{{ getMessageSender(msg.userId) }} - {{ formatTime(msg.time) }}</p>
                        </div>
                    </li>
                </div>
            </ul>
            <div class="flex items-center gap-4 p-4 h-20">
                <UInput v-model="message" class="flex-1" size="xl" name="input" placeholder="Type your message here" />
                <UButton color="primary" variant="solid" label="Send" size="xl" @click="sendMessage" />
            </div>
        </div>
        <template>
            <UModal v-model="isOpenView" prevent-close>
                <UCard :ui="{
                    ring: '',
                    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                View list of users
                            </h3>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                @click="isOpenView = false" />
                        </div>
                    </template>
                    <div class="flex gap-4" v-for="person in members">
                        <p>{{ person.name + " - " + person.email }}</p>
                    </div>
                </UCard>
            </UModal>
        </template>
        <template>
            <UModal v-model="isOpenAdd" prevent-close>
                <UCard :ui="{
                    ring: '',
                    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Add new member
                            </h3>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                @click="isOpenAdd = false" />
                        </div>
                    </template>
                    <UForm :schema="schema" :state="state" @submit="submit">
                        <UFormGroup class="mb-4 flex-1" label="Add by email" name="listUser">
                            <Select v-model:value="state.listUser"
                                :options="filteredUserData.map(user => ({ label: user.email, value: user._id }))"
                                mode="tags" placeholder="Please select" class="w-100"></Select>
                        </UFormGroup>
                        <UButton type="submit"> Submit </UButton>
                    </UForm>
                </UCard>
            </UModal>
        </template>
        <template>
            <UModal v-model="isOpenUpdate" prevent-close>
                <UCard :ui="{
                    ring: '',
                    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Update name of group
                            </h3>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                @click="isOpenUpdate = false" />
                        </div>
                    </template>
                    <UForm :state="data_name" @submit="update">
                        <UFormGroup class="mb-4 flex-1" label="Update name" name="chatName">
                            <UInput v-model="data_name.chatName" placeholder="Group name" />
                        </UFormGroup>
                        <UButton type="submit"> Submit </UButton>
                    </UForm>
                </UCard>
            </UModal>
        </template>
    </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '~/layouts/AdminLayout.vue';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { database, ref as dbRef, push, onValue, get, set } from '~/firebase';
import axios from 'axios';
import * as z from "zod";
import { Select } from 'ant-design-vue'
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const toast = useToast();
const route = useRoute();
const chatId = route.params.id;
const userId = process.client ? localStorage.getItem('_id') : '';

const isOpenView = ref(false);
const isOpenAdd = ref(false);
const isOpenUpdate = ref(false);

const schema = z.object({
    listUser: z.array(z.string()).min(1, "Please select at least one user"),
});
type Schema = z.output<typeof schema>;
const state = ref({
    listUser: [] as string[],
});
const data_name = ref({
    chatName: ''
})
let message = ref("");
const messages = ref({});
let userData = ref([]);
const members = ref([]);
const filteredUserData = ref([]);

async function loadData() {
    try {
        const chatRef = dbRef(database, `chat/${chatId}`);
        const response = await axios.get('http://localhost:5000/api/user/getAllTeacherAndStudent');
        userData.value = response.data.userData
            .map(person => ({ _id: person._id, email: person.email, name: person.name }));

        onValue(chatRef, (snapshot) => {
            const chatData = snapshot.val();
            messages.value = chatData ? chatData : {};

            members.value = messages.value.listUser.map(memberId => {
                const user = userData.value.find(student => student._id === memberId);
                return user ? { name: user.name, email: user.email } : { name: 'Unknown User', email: 'Unknown Email' };
            });

            if (messages.value.listMessage) {
                messages.value.listMessage = reverseObject(messages.value.listMessage);
            }
        });
        data_name.value.chatName = messages.value.chatName;
        console.log(name)
        filteredUserData.value = userData.value.filter(user => {
            return !members.value.some(member => member.email == user.email);
        });
    } catch (error) {
        toast.error('Error occurred');
    }
}

onMounted(loadData)

async function sendMessage() {
    try {
        const chatRef = dbRef(database, `chat/${chatId}/listMessage`);

        const currentTime = new Date().toISOString();

        const messageData = {
            userId: userId,
            message: message.value,
            time: currentTime
        };

        await push(chatRef, messageData);

        message.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function submit(event: FormSubmitEvent<Schema>) {
    try {
        const chatUserRef = dbRef(database, `chat/${chatId}/listUser`);
        const existingListUserSnapshot = await get(chatUserRef);
        const existingListUser = existingListUserSnapshot.val() || [];
        const newListUser = [...existingListUser, ...event.data.listUser];
        await set(chatUserRef, newListUser);
        loadData();
        toast.success('Members added successfully!');
        isOpenAdd.value = false;
    } catch (error) {
        console.error('Error adding members:', error);
        toast.error('Error adding members');
    }
}

async function update(event: FormSubmitEvent<Schema>) {
    try {
        if (!event.data.chatName) {
            toast.warning('Group name cannot be empty!');
            return;
        }

        const chatRef = dbRef(database, `chat/${chatId}`);
        const existingDataSnapshot = await get(chatRef);
        const existingData = existingDataSnapshot.val() || {};

        existingData.chatName = event.data.chatName;

        await set(chatRef, existingData);

        toast.success('Group name updated successfully!');
        loadData();
        isOpenUpdate.value = false;
    } catch (error) {
        console.error('Error updating name:', error);
        toast.error('Error updating name');
    }
}

function reverseObject(obj) {
    const messageArray = Object.keys(obj).map(key => ({ key, ...obj[key] }));
    return messageArray.reverse();
}

function formatTime(isoString) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };

    return new Date(isoString).toLocaleString(undefined, options);
}

function getMessageSender(senderId) {
    if (senderId === userId) {
        return 'By you';
    } else {
        const user = userData.value.find(student => student._id == senderId);
        return user ? 'By ' + user.name : 'Admin';
    }
}
</script>