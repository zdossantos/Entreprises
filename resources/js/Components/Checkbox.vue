<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits<{
    (e: 'update:checked', value: boolean | unknown[]): void;
}>();

const props = withDefaults(
    defineProps<{
        checked?: boolean | unknown[];
        value?: unknown;
    }>(),
    {
        checked: false,
        value: null,
    }
);

const proxyChecked = computed({
    get() {
        return props.checked;
    },

    set(val) {
        emit('update:checked', val);
    },
});
</script>

<template>
    <input
        type="checkbox"
        :value="value"
        v-model="proxyChecked"
        class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
    />
</template>
