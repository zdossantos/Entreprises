<script setup lang="ts">
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { Head, Link } from "@inertiajs/vue3";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Building2, ArrowRight } from "lucide-vue-next";
</script>

<template>
    <Head title="Tableau de bord" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-foreground leading-tight">
                Tableau de bord
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card class="hover:shadow-md transition-shadow">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium">Entreprises</CardTitle>
                            <Building2 class="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <CardDescription class="mb-4">
                                Gérez vos entreprises enregistrées, consultez leurs informations et mettez-les à jour.
                            </CardDescription>
                            <Link :href="route('entreprises.index')">
                                <Button size="sm">
                                    Voir mes entreprises
                                    <ArrowRight class="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
