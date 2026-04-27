<script setup>
import { ref } from "vue";
import { Head, useForm } from "@inertiajs/vue3";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";

const error = ref(false);

const form = useForm({
    name: null,
    siret: null,
    adresse: null,
    postalCode: null,
    city: null,
    siren: null,
    creationDate: null,
    sliceNbEmployee: "00",
});

const submit = () => {
    form.post(route("entreprises.store"), {
        onError: () => {
            error.value = true;
            setTimeout(() => {
                error.value = false;
            }, 5000);
        },
    });
};

const getDatas = async () => {
    const siret = form.siret ? String(form.siret) : "";
    if (siret.length === 14) {
        const headers = { Authorization: `Bearer ${import.meta.env.VITE_SIRET_API_TOKEN}` };
        const { data } = await axios.get(
            `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`,
            { headers }
        );
        const info = data.etablissement;
        const addr = info.adresseEtablissement;
        form.name = info.uniteLegale.denominationUniteLegale;
        form.adresse = `${addr.numeroVoieEtablissement} ${addr.typeVoieEtablissement} ${addr.libelleVoieEtablissement}`;
        form.postalCode = addr.codePostalEtablissement;
        form.city = addr.libelleCommuneEtablissement;
        form.siren = info.siren;
        form.creationDate = info.dateCreationEtablissement;
        form.sliceNbEmployee = info.trancheEffectifsEtablissement ?? "00";
    }
};
</script>

<template>
    <Head title="Ajout d'entreprise" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Ajout d'entreprise
            </h2>
        </template>
        <div class="py-12">
            <div class="mt-10 sm:mt-0 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="md:grid md:grid-cols-2 md:gap-6">
                    <div v-if="error">
                        <span class="bg-red-100 text-red-800 text-xl font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                            Merci de vérifier tous les champs
                        </span>
                    </div>
                    <div class="mt-5 md:col-span-2 md:mt-0">
                        <form @submit.prevent="submit">
                            <div class="overflow-hidden shadow sm:rounded-md">
                                <div class="bg-white px-4 py-5 sm:p-6">
                                    <div class="grid grid-cols-6 gap-6">
                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="siret" class="block text-sm font-medium text-gray-700">Siret</label>
                                            <input type="text" name="siret" id="siret" v-model="form.siret" maxlength="14" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div class="col-span-6 sm:col-span-3 flex items-end">
                                            <PrimaryButton type="button" @click="getDatas" class="h-10">
                                                Récupérer les informations
                                            </PrimaryButton>
                                        </div>
                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="siren" class="block text-sm font-medium text-gray-700">Siren</label>
                                            <input type="text" name="siren" id="siren" v-model="form.siren" maxlength="9" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
                                            <input type="text" name="name" id="name" v-model="form.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div class="col-span-6 sm:col-span-4">
                                            <label for="adresse" class="block text-sm font-medium text-gray-700">Adresse</label>
                                            <input type="text" name="adresse" id="adresse" v-model="form.adresse" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div class="col-span-6 sm:col-span-2">
                                            <label for="city" class="block text-sm font-medium text-gray-700">Ville</label>
                                            <input type="text" name="city" id="city" v-model="form.city" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                                            <label for="postalCode" class="block text-sm font-medium text-gray-700">Code Postal</label>
                                            <input type="text" name="postalCode" id="postalCode" v-model="form.postalCode" maxlength="5" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                                            <label for="creationDate" class="block text-sm font-medium text-gray-700">Date de création</label>
                                            <input type="date" name="creationDate" id="creationDate" v-model="form.creationDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="sliceNbEmployee" class="block text-sm font-medium text-gray-700">Nombre d'employés</label>
                                            <select id="sliceNbEmployee" name="sliceNbEmployee" v-model="form.sliceNbEmployee" class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                                <option value="00">0 salarié ou l'information n'est pas disponible</option>
                                                <option value="01">1 ou 2 salariés</option>
                                                <option value="02">3 à 5 salariés</option>
                                                <option value="03">6 à 9 salariés</option>
                                                <option value="11">10 à 19 salariés</option>
                                                <option value="12">20 à 49 salariés</option>
                                                <option value="21">50 à 99 salariés</option>
                                                <option value="22">100 à 199 salariés</option>
                                                <option value="31">200 à 249 salariés</option>
                                                <option value="32">250 à 499 salariés</option>
                                                <option value="41">500 à 999 salariés</option>
                                                <option value="42">1 000 à 1 999 salariés</option>
                                                <option value="51">2 000 à 4 999 salariés</option>
                                                <option value="52">5 000 à 9 999 salariés</option>
                                                <option value="53">10 000 salariés et plus</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    <button type="submit" class="px-6 py-2 text-white bg-gray-900 rounded">
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
