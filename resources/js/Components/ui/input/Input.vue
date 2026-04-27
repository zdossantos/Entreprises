<script setup lang="ts">
import { computed } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
    defineProps<{
        class?: string;
        type?: string;
        modelValue?: string | number | null;
    }>(),
    {
        class: "",
        type: "text",
        modelValue: "",
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const onInput = (e: Event): void => {
    emit("update:modelValue", (e.target as HTMLInputElement).value);
};

const inputValue = computed(() => props.modelValue ?? "");
</script>

<template>
    <input
        v-bind="$attrs"
        :type="type"
        :value="inputValue"
        @input="onInput"
        :class="cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            props.class
        )"
    />
</template>
