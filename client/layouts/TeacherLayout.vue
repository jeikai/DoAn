<template>
    <div class="min-h-full">
        <div class="grid grid-cols-12 w-full lg:gap-5 m-auto">
            <div class="col-span-3">
                <div class="sticky top-0">
                    <SidebarTeacher/>
                </div>
            </div>
            <div class="col-span-9 pr-4">
                <AdminHeader />
                <div class="mt-8">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>