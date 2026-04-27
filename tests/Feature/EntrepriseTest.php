<?php

use App\Models\Entreprise;
use App\Models\User;

test('entreprises index requires authentication', function () {
    $response = $this->get(route('entreprises.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated user can view their entreprises', function () {
    $user = User::factory()->create();
    $entreprise = Entreprise::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('entreprises.index'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('Entreprise/Index')
            ->has('entreprises.data', 1)
    );
});

test('user cannot see other users entreprises', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Entreprise::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->get(route('entreprises.index'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page->has('entreprises.data', 0)
    );
});

test('authenticated user can access create form', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('entreprises.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('Entreprise/Create'));
});

test('authenticated user can create an entreprise', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('entreprises.store'), [
        'name' => 'Acme Corp',
        'siret' => '12345678901234',
        'siren' => '123456789',
        'adresse' => '1 Rue de la Paix',
        'postalCode' => '75001',
        'city' => 'Paris',
        'creationDate' => '2020-01-15',
        'sliceNbEmployee' => '12',
    ]);

    $response->assertRedirect(route('entreprises.index'));
    $this->assertDatabaseHas('entreprises', [
        'name' => 'Acme Corp',
        'siret' => '12345678901234',
        'user_id' => $user->id,
    ]);
});

test('creating an entreprise validates required fields', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('entreprises.store'), []);

    $response->assertSessionHasErrors(['name', 'siret', 'siren', 'creationDate']);
});

test('authenticated user can access edit form for their entreprise', function () {
    $user = User::factory()->create();
    $entreprise = Entreprise::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('entreprises.edit', $entreprise));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('Entreprise/Edit')
            ->has('entreprise')
    );
});

test('user cannot edit another users entreprise', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $entreprise = Entreprise::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->get(route('entreprises.edit', $entreprise));

    $response->assertRedirect(route('entreprises.index'));
});

test('authenticated user can update their entreprise', function () {
    $user = User::factory()->create();
    $entreprise = Entreprise::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->put(route('entreprises.update', $entreprise), [
        'name' => 'Updated Corp',
        'siret' => $entreprise->siret,
        'siren' => $entreprise->siren,
        'adresse' => $entreprise->adresse,
        'postalCode' => $entreprise->postalCode,
        'city' => $entreprise->city,
        'creationDate' => $entreprise->creationDate,
        'sliceNbEmployee' => $entreprise->sliceNbEmployee,
    ]);

    $response->assertRedirect(route('entreprises.index'));
    $this->assertDatabaseHas('entreprises', [
        'id' => $entreprise->id,
        'name' => 'Updated Corp',
    ]);
});

test('authenticated user can delete their entreprise', function () {
    $user = User::factory()->create();
    $entreprise = Entreprise::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->delete(route('entreprises.destroy', $entreprise));

    $response->assertRedirect(route('entreprises.index'));
    $this->assertDatabaseMissing('entreprises', ['id' => $entreprise->id]);
});

test('user cannot delete another users entreprise', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $entreprise = Entreprise::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->delete(route('entreprises.destroy', $entreprise));

    $response->assertRedirect(route('entreprises.index'));
    $this->assertDatabaseHas('entreprises', ['id' => $entreprise->id]);
});
