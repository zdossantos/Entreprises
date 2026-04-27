<?php

use App\Models\Entreprise;
use App\Models\User;

test('entreprise belongs to a user', function () {
    $user = User::factory()->create();
    $entreprise = Entreprise::factory()->create(['user_id' => $user->id]);

    expect($entreprise->user)->toBeInstanceOf(User::class);
    expect($entreprise->user->id)->toBe($user->id);
});

test('entreprise has correct fillable attributes', function () {
    $fillable = (new Entreprise())->getFillable();

    expect($fillable)->toContain('name');
    expect($fillable)->toContain('siret');
    expect($fillable)->toContain('siren');
    expect($fillable)->toContain('adresse');
    expect($fillable)->toContain('postalCode');
    expect($fillable)->toContain('city');
    expect($fillable)->toContain('creationDate');
    expect($fillable)->toContain('sliceNbEmployee');
    expect($fillable)->toContain('user_id');
});

test('entreprise can be created with factory', function () {
    $entreprise = Entreprise::factory()->create();

    expect($entreprise)->toBeInstanceOf(Entreprise::class);
    expect($entreprise->name)->not->toBeNull();
    expect($entreprise->siret)->toHaveLength(14);
    expect($entreprise->siren)->toHaveLength(9);
});
