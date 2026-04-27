<script setup>
import { ref } from "vue";
import { router, Head, Link } from "@inertiajs/vue3";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import pagination from "@/Components/Pagination.vue";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { PlusCircle, Pencil, Trash2 } from "lucide-vue-next";

const props = defineProps({
    entreprises: Object,
});

const confirmingDeletion = ref(false);
const currentEntrepriseId = ref(null);

const confirmDeletion = (id) => {
    currentEntrepriseId.value = id;
    confirmingDeletion.value = true;
};

const closeDeletion = () => {
    confirmingDeletion.value = false;
    currentEntrepriseId.value = null;
};

const destroy = () => {
    router.delete(route("entreprises.destroy", currentEntrepriseId.value));
    closeDeletion();
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
        "00": "0 ou non disponible",
        "01": "1-2",
        "02": "3-5",
        "03": "6-9",
        "11": "10-19",
        "12": "20-49",
        "21": "50-99",
        "22": "100-199",
        "31": "200-249",
        "32": "250-499",
        "41": "500-999",
        "42": "1 000-1 999",
        "51": "2 000-4 999",
        "52": "5 000-9 999",
        "53": "10 000+",
    };
    return code && map[code] ? map[code] : code ?? "";
};
</script>

<template>
    <Head title="Entreprises" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold leading-tight text-foreground">
                    Mes entreprises
                </h2>
                <Link :href="route('entreprises.create')">
                    <Button>
                        <PlusCircle class="mr-2 h-4 w-4" />
                        Ajouter une entreprise
                    </Button>
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div v-if="entreprises.data.length === 0" class="text-center py-12">
                    <p class="text-muted-foreground text-lg">Aucune entreprise enregistrée.</p>
                    <Link :href="route('entreprises.create')" class="mt-4 inline-block">
                        <Button variant="outline">
                            <PlusCircle class="mr-2 h-4 w-4" />
                            Créer votre première entreprise
                        </Button>
                    </Link>
                </div>

                <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Card v-for="entreprise in entreprises.data" :key="entreprise.id" class="hover:shadow-md transition-shadow">
                        <CardHeader class="pb-2">
                            <CardTitle class="text-lg">{{ entreprise.name }}</CardTitle>
                            <div class="flex gap-2 flex-wrap">
                                <Badge variant="secondary">SIRET : {{ entreprise.siret }}</Badge>
                                <Badge variant="outline">SIREN : {{ entreprise.siren }}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <dl class="space-y-1 text-sm text-muted-foreground">
                                <div v-if="entreprise.adresse">
                                    <dt class="inline font-medium text-foreground">Adresse : </dt>
                                    <dd class="inline">{{ entreprise.adresse }}, {{ entreprise.postalCode }} {{ entreprise.city }}</dd>
                                </div>
                                <div v-if="entreprise.sliceNbEmployee">
                                    <dt class="inline font-medium text-foreground">Effectif : </dt>
                                    <dd class="inline">{{ employeeLabel(entreprise.sliceNbEmployee) }} salariés</dd>
                                </div>
                                <div v-if="entreprise.creationDate">
                                    <dt class="inline font-medium text-foreground">Créée le : </dt>
                                    <dd class="inline">{{ formatDate(entreprise.creationDate) }}</dd>
                                </div>
                            </dl>
                            <div class="mt-4 flex gap-2">
                                <Link :href="route('entreprises.edit', entreprise.id)">
                                    <Button variant="outline" size="sm">
                                        <Pencil class="mr-1 h-3 w-3" />
                                        Modifier
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    @click="confirmDeletion(entreprise.id)"
                                >
                                    <Trash2 class="mr-1 h-3 w-3" />
                                    Supprimer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div class="mt-6">
                    <pagination :links="entreprises.links" class="flex justify-center" />
                </div>
            </div>
        </div>

        <!-- Delete confirmation dialog -->
        <Dialog :open="confirmingDeletion" @update:open="closeDeletion">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Supprimer cette entreprise ?</DialogTitle>
                    <DialogDescription>
                        Cette action est irréversible. Toutes les données associées à cette entreprise seront définitivement supprimées.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" @click="closeDeletion">Annuler</Button>
                    <Button variant="destructive" @click="destroy">Supprimer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AuthenticatedLayout>
</template>
