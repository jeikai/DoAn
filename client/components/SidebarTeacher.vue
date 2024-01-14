<template>
    <div class="h-screen border-r shadow-sm p-4">
        <div class="flex gap-2 items-center">
            <img src="../assets/images/logo.png" class="w-16 h-16" alt="">
            <span class="font-semibold text-base text-primay">Hanoi Architectutal university</span>
        </div>
        <ul class="mt-5 space-y-5" v-for="link in links">
            <li class="p-2 font-medium rounded-lg"
                :class="link.url == route.fullPath ? 'text-primay' : '' "
            >
                <NuxtLink class="flex items-center gap-4 no-underline" :to="link.url">
                    <Icon 
                            v-if="link.icon" 
                            :name="link.icon" 
                            class="mr-0.5 mt-[2px]" 
                            size="25"
                        /> 
                    <span>
                        {{ link.name }}
                    </span>
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<script setup>

const route = useRoute()

const links = ref([
    { name: 'Class', url: '/teacher/class', icon: 'material-symbols:groups-2' },
    { name: 'Messages', url: '/teacher/messages', icon: 'material-symbols:chat-outline' },
])

</script>
