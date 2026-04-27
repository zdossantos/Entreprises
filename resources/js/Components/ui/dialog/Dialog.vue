<script setup>
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
    open: { type: Boolean, default: false },
});
const emit = defineEmits(["update:open"]);

const handleKeydown = (e) => {
    if (e.key === "Escape" && props.open) {
        emit("update:open", false);
    }
};

onMounted(() => document.addEventListener("keydown", handleKeydown));
onUnmounted(() => document.removeEventListener("keydown", handleKeydown));
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="open"
                class="fixed inset-0 z-50 flex items-center justify-center"
            >
                <div
                    class="fixed inset-0 bg-black/50"
                    aria-hidden="true"
                    @click="emit('update:open', false)"
                />
                <div
                    role="dialog"
                    aria-modal="true"
                    class="relative z-50 grid w-full max-w-lg gap-4 bg-background p-6 shadow-lg sm:rounded-lg mx-4"
                >
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
