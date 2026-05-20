<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { Head, useForm } from "@inertiajs/vue3";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Search } from "lucide-vue-next";

interface EntrepriseProps {
    id: number;
    name: string;
    siret: string;
    siren: string;
    adresse: string | null;
    postalCode: string | null;
    city: string | null;
    sliceNbEmployee: string;
    creationDate: string | null;
}

interface EmployeeOption {
    value: string;
    label: string;
}

interface InseeAddress {
    numeroVoieEtablissement: string;
    typeVoieEtablissement: string;
    libelleVoieEtablissement: string;
    codePostalEtablissement: string;
    libelleCommuneEtablissement: string;
}

interface InseeEtablissement {
    siren: string;
    dateCreationEtablissement: string;
    trancheEffectifsEtablissement: string | null;
    adresseEtablissement: InseeAddress;
    uniteLegale: {
        denominationUniteLegale: string;
    };
}

const props = defineProps<{
    entreprise: EntrepriseProps;
}>();

const error = ref<boolean>(false);

const form = useForm({
    name: props.entreprise.name,
    siret: props.entreprise.siret,
    adresse: props.entreprise.adresse,
    postalCode: props.entreprise.postalCode,
    city: props.entreprise.city,
    siren: props.entreprise.siren,
    creationDate: props.entreprise.creationDate,
    sliceNbEmployee: props.entreprise.sliceNbEmployee,
});

const submit = (): void => {
    form.put(route("entreprises.update", props.entreprise.id), {
        onError: () => {
            error.value = true;
            setTimeout(() => { error.value = false; }, 5000);
        },
    });
};

const getDatas = async (): Promise<void> => {
    const siret = form.siret ? String(form.siret) : "";
    if (siret.length === 14) {
        const { data } = await axios.get<{ etablissement: InseeEtablissement }>(
            route("entreprises.lookup", siret)
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

const employeeOptions: EmployeeOption[] = [
    { value: "00", label: "0 salarié ou l'information n'est pas disponible" },
    { value: "01", label: "1 ou 2 salariés" },
    { value: "02", label: "3 à 5 salariés" },
    { value: "03", label: "6 à 9 salariés" },
    { value: "11", label: "10 à 19 salariés" },
    { value: "12", label: "20 à 49 salariés" },
    { value: "21", label: "50 à 99 salariés" },
    { value: "22", label: "100 à 199 salariés" },
    { value: "31", label: "200 à 249 salariés" },
    { value: "32", label: "250 à 499 salariés" },
    { value: "41", label: "500 à 999 salariés" },
    { value: "42", label: "1 000 à 1 999 salariés" },
    { value: "51", label: "2 000 à 4 999 salariés" },
    { value: "52", label: "5 000 à 9 999 salariés" },
    { value: "53", label: "10 000 salariés et plus" },
];
</script>

<template>
    <Head title="Modification d'entreprise" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-foreground">
                Modifier : {{ entreprise.name }}
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-3xl sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations de l'entreprise</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div v-if="error" class="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            Merci de vérifier tous les champs obligatoires.
                        </div>

                        <form @submit.prevent="submit" class="space-y-6">
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="siret">Numéro SIRET</Label>
                                    <Input
                                        id="siret"
                                        type="text"
                                        v-model="form.siret"
                                        maxlength="14"
                                        :class="{ 'border-destructive': form.errors.siret }"
                                    />
                                    <p v-if="form.errors.siret" class="text-xs text-destructive">{{ form.errors.siret }}</p>
                                </div>
                                <div class="flex items-end">
                                    <Button type="button" variant="outline" @click="getDatas">
                                        <Search class="mr-2 h-4 w-4" />
                                        Mettre à jour via INSEE
                                    </Button>
                                </div>
                            </div>

                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="siren">Numéro SIREN</Label>
                                    <Input
                                        id="siren"
                                        type="text"
                                        v-model="form.siren"
                                        maxlength="9"
                                        :class="{ 'border-destructive': form.errors.siren }"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <Label for="name">Nom de l'entreprise</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        v-model="form.name"
                                        :class="{ 'border-destructive': form.errors.name }"
                                    />
                                    <p v-if="form.errors.name" class="text-xs text-destructive">{{ form.errors.name }}</p>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label for="adresse">Adresse</Label>
                                <Input id="adresse" type="text" v-model="form.adresse" />
                            </div>

                            <div class="grid gap-4 sm:grid-cols-3">
                                <div class="space-y-2 sm:col-span-2">
                                    <Label for="city">Ville</Label>
                                    <Input id="city" type="text" v-model="form.city" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="postalCode">Code postal</Label>
                                    <Input id="postalCode" type="text" v-model="form.postalCode" maxlength="5" />
                                </div>
                            </div>

                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="creationDate">Date de création</Label>
                                    <Input
                                        id="creationDate"
                                        type="date"
                                        v-model="form.creationDate"
                                        :class="{ 'border-destructive': form.errors.creationDate }"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <Label for="sliceNbEmployee">Effectif</Label>
                                    <select
                                        id="sliceNbEmployee"
                                        v-model="form.sliceNbEmployee"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option v-for="opt in employeeOptions" :key="opt.value" :value="opt.value">
                                            {{ opt.label }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="flex justify-end gap-3">
                                <Button type="button" variant="outline" as="a" :href="route('entreprises.index')">
                                    Annuler
                                </Button>
                                <Button type="submit" :disabled="form.processing">
                                    Enregistrer les modifications
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
