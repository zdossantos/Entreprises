<script setup>
import { Head, Link } from "@inertiajs/vue3";
import ApplicationLogo from "@/Components/ApplicationLogo.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import SecondaryButton from "@/Components/SecondaryButton.vue";
defineProps({
    canLogin: Boolean,
    canRegister: Boolean,
    laravelVersion: String,
    phpVersion: String,
});
</script>

<template>
    <Head title="Bienvenue" />

    <div
        class="relative flex flex-col items-top justify-center min-h-screen items-center pt-0"
    >
        <ApplicationLogo class="blockfill-current text-gray-800" />
        <div v-if="canLogin" class="text-5xl">
            <Link
                v-if="$page.props.auth.user"
                :href="route('dashboard')"
                class="text-sm underline"
                >Tableau de bord</Link
            >

            <template v-else>
                <Link :href="route('login')">
                    <PrimaryButton class="ml-4"> Connexion </PrimaryButton>
                </Link>
                <Link :href="route('register')" v-if="canRegister">
                    <SecondaryButton class="ml-4">
                        Inscription
                    </SecondaryButton>
                </Link>
            </template>
        </div>
    </div>
</template>
