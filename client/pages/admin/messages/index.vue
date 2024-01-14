<template>
    <AdminLayout>
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
                    <div class="flex gap-4 p-3 mb-2 rounded-md">
                        <div>
                            <UAvatar chip-color="primary" chip-text="" chip-position="bottom-right" size="md"
                                src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between">
                                <h3 class="font-semibold">Name</h3>
                                <span class="text-sm text-gray-500">Time</span>
                            </div>
                            <p class="w-40 truncate">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, a.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            <div class="w-2/3">
                <div class="header flex gap-4 items-center h-14 border-b px-4">
                    <div class="flex-1">
                        <div class="flex gap-4 items-center">
                            <UAvatar chip-color="primary" chip-text="" chip-position="bottom-right" size="md"
                                src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
                            <div>
                                <h3 class="font-semibold">Name</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-4 w-full bg-[#f8f7fa]">
                    <ul class="h-[calc(75vh-80px)] overflow-x-auto flex flex-col-reverse py-4">
                        <li class="flex gap-4 mb-4">
                            <div>
                                <UAvatar size="md" src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
                            </div>
                            <div class="w-3/4">
                                <p class="bg-white shadow-md p-4 mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing
                                    elit. Quod distinctio tenetur cum praesentium, cumque exercitationem dolorum corrupti
                                    assumenda molestiae temporibus quidem incidunt, necessitatibus, sapiente dignissimos ea!
                                    Et deserunt repellat perferendis?</p>
                                <p class="text-gray-500">Time</p>
                            </div>
                        </li>
                        <li class="flex gap-4 mb-4 justify-end">
                            <div class="w-3/4">
                                <p class="bg-white shadow-md p-4 mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing
                                    elit. Quod distinctio tenetur cum praesentium, cumque exercitationem dolorum corrupti
                                    assumenda molestiae temporibus quidem incidunt, necessitatibus, sapiente dignissimos ea!
                                    Et deserunt repellat perferendis?</p>
                                <p class="text-gray-500">Time</p>
                            </div>
                            <div>
                                <UAvatar size="md" src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
                            </div>
                        </li>
                    </ul>
                    <div class="flex items-center gap-4 p-4 h-20">
                        <UInput class="flex-1" size="xl" name="input" placeholder="Type your message here" />
                        <UButton color="primary" variant="solid" label="Send" size="xl" />
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '~/layouts/AdminLayout.vue';


</script>