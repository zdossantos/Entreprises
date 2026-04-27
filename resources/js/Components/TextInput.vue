<script setup lang="ts">
import { onMounted, ref } from 'vue';

defineProps<{ modelValue?: string }>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const input = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (input.value?.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value?.focus() });

const onInput = (e: Event): void => {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>

<template>
    <input
        class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
        :value="modelValue"
        @input="onInput"
        ref="input"
    />
</template>
