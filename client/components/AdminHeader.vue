<template>
  <header class="p-4 w-full flex items-center justify-between border shadow-lg">
    <div class="flex items-center justify-center">

    </div>
    <div class="flex-1 flex justify-end gap-4">
      <template v-for="link in links">
        <button class="flex items-center">
          <Icon v-if="link.icon" :name="link.icon" class="mr-0.5 mt-[2px]" size="25" />
        </button>
      </template> 
      <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
        :popper="{ placement: 'bottom-start' }">
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />
        <template #account="{ item }">
          <div class="text-left">
            <p>Signed in as</p>
            <p class="truncate font-medium text-gray-900 dark:text-white">
              {{ item.label }}
            </p>
          </div>
        </template>
        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>
          <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
        </template>
      </UDropdown>
    </div>
  </header>
</template>

<script setup>
const router = useRouter();
const items = [
  [
    {
      label: process.client ? localStorage.getItem('email') : '',
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: () => {
        if (process.client) {
          localStorage.setItem('token', '');
        }
        router.push('/login')
      }
    },
  ],
];

const links = ref([
  { icon: "material-symbols:light-mode-outline" },
  { icon: "material-symbols:circle-notifications-outline-sharp" },
]);

const search = ref('')
</script>