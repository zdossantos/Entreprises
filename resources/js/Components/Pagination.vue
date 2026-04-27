<!-- <template>
    <div v-if="links.length > 3">
        <div class="flex flex-wrap mt-8">
            <template v-for="(link, key) in links" :key="key">
                <div
                    v-if="link.url === null"
                    class="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded hover:bg-blue"
                    v-html="link.label"
                />

                <Link
                    v-else
                    class="mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary"
                    :class="{ 'bg-white': link.active }"
                    :href="link.url"
                    v-html="link.label"
                />
            </template>
        </div>
    </div>
</template> -->
<template>
    <div v-if="links.length > 3">
        <div
            class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
        >
            <div
                class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between"
            >
                <div>
                    <nav
                        class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                    >
                        <template v-for="(link, key) in links" :key="key">
                            <div
                                v-if="link.url === null"
                                class="relative z-10 inline-flex items-center border border-gray-300 bg-slate-200 px-4 py-2 text-sm font-medium text-gray-600 focus:z-20"
                                v-html="link.label"
                            />

                            <Link
                                v-else
                                class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                                :class="{
                                    'text-white font-bold bg-sky-500 hover:bg-sky-500/75':
                                        link.active,
                                }"
                                :href="link.url"
                                v-html="link.label"
                            />
                        </template>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from "vue";
import { Link } from "@inertiajs/vue3";
export default defineComponent({
    components: {
        Link,
    },
    props: {
        links: Array,
    },
});
</script>
