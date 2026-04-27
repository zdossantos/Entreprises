<script setup>
import { ref } from "vue";
import { router, Head, Link } from "@inertiajs/vue3";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import BreezeNavLink from "@/Components/NavLink.vue";
import pagination from "@/Components/Pagination.vue";
import DangerButton from "@/Components/DangerButton.vue";
import Modal from "@/Components/Modal.vue";
import SecondaryButton from "@/Components/SecondaryButton.vue";

const props = defineProps({
    entreprises: Object,
});

const confirmingEntrepriseDeletion = ref(false);
const currentEntrepriseId = ref(null);

const confirmEntrepriseDeletion = (id) => {
    currentEntrepriseId.value = id;
    confirmingEntrepriseDeletion.value = true;
};

const closeModal = () => {
    confirmingEntrepriseDeletion.value = false;
    currentEntrepriseId.value = null;
};

const destroy = () => {
    router.delete(route("entreprises.destroy", currentEntrepriseId.value));
    closeModal();
};

const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

const employeeLabel = (code) => {
    const map = {
        "00": "0 salarié ou l'information n'est pas disponible",
        "01": "1 ou 2 salariés",
        "02": "3 à 5 salariés",
        "03": "6 à 9 salariés",
        "11": "10 à 19 salariés",
        "12": "20 à 49 salariés",
        "21": "50 à 99 salariés",
        "22": "100 à 199 salariés",
        "31": "200 à 249 salariés",
        "32": "250 à 499 salariés",
        "41": "500 à 999 salariés",
        "42": "1 000 à 1 999 salariés",
        "51": "2 000 à 4 999 salariés",
        "52": "5 000 à 9 999 salariés",
        "53": "10 000 salariés et plus",
    };
    return code ? `Effectif : ${map[code] ?? code}` : "";
};
</script>

<template>
    <Head title="Entreprises" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Entreprises
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 bg-white border-b border-gray-200">
                        <div class="mb-4 flex">
                            <Link
                                class="px-6 py-2 mb-2 text-green-100 bg-green-500 rounded"
                                :href="route('entreprises.create')"
                            >
                                Ajouter une entreprise
                            </Link>
                        </div>
                        <div class="flex flex-wrap flex-col sm:flex-row sm:items-start justify-center">
                            <div
                                class="md:w-1/2 p-3 flex justify-center"
                                v-for="entreprise in entreprises.data"
                                :key="entreprise.id"
                            >
                                <div class="h-auto w-full sm:w-96 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-black">
                                        {{ entreprise.name }}
                                    </h5>
                                    <div class="mb-3 font-normal text-gray-700">
                                        <p>N° de Siret : {{ entreprise.siret }}</p>
                                        <p>N° de Siren : {{ entreprise.siren }}</p>
                                        <p>Adresse : {{ entreprise.adresse }}</p>
                                        <p>Ville : {{ entreprise.city }}</p>
                                        <p>Code postal : {{ entreprise.postalCode }}</p>
                                        <p>{{ employeeLabel(entreprise.sliceNbEmployee) }}</p>
                                        <p>Date de création : {{ formatDate(entreprise.creationDate) }}</p>
                                    </div>
                                    <div class="flex justify-between">
                                        <a
                                            :href="route('entreprises.edit', entreprise.id)"
                                            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                        >
                                            Modifier
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M 19.171875 2 C 18.448125 2 17.724375 2.275625 17.171875 2.828125 L 16 4 L 20 8 L 21.171875 6.828125 C 22.275875 5.724125 22.275875 3.933125 21.171875 2.828125 C 20.619375 2.275625 19.895625 2 19.171875 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z"/>
                                            </svg>
                                        </a>
                                        <button
                                            @click="confirmEntrepriseDeletion(entreprise.id)"
                                            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
                                        >
                                            Supprimer
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 7 5 L 17 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <pagination class="flex justify-center" :links="entreprises.links" />
                    </div>
                </div>
            </div>
        </div>

        <Modal :show="confirmingEntrepriseDeletion" @close="closeModal">
            <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900">
                    Êtes-vous sûr de vouloir supprimer cette entreprise ?
                </h2>
                <p class="mt-1 text-sm text-gray-600">
                    Une fois l'entreprise supprimée, toutes ses données seront définitivement effacées.
                </p>
                <div class="mt-6 flex justify-end">
                    <SecondaryButton @click="closeModal">Annuler</SecondaryButton>
                    <DangerButton class="ml-3" @click="destroy">
                        Supprimer l'entreprise
                    </DangerButton>
                </div>
            </div>
        </Modal>
    </AuthenticatedLayout>
</template>
