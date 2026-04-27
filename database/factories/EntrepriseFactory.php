<?php

namespace Database\Factories;

use App\Models\Entreprise;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Entreprise>
 */
class EntrepriseFactory extends Factory
{
    protected $model = Entreprise::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $siren = str_pad((string) $this->faker->numberBetween(100000000, 999999999), 9, '0', STR_PAD_LEFT);
        $siret = $siren.str_pad((string) $this->faker->numberBetween(10000, 99999), 5, '0', STR_PAD_LEFT);

        return [
            'name' => $this->faker->company(),
            'siret' => $siret,
            'siren' => $siren,
            'user_id' => User::factory(),
            'adresse' => $this->faker->streetAddress(),
            'postalCode' => str_pad((string) $this->faker->numberBetween(1000, 99999), 5, '0', STR_PAD_LEFT),
            'city' => $this->faker->city(),
            'creationDate' => $this->faker->date('Y-m-d'),
            'sliceNbEmployee' => $this->faker->randomElement(['00', '01', '02', '03', '11', '12', '21', '22', '31', '32', '41', '42', '51', '52', '53']),
        ];
    }
}
