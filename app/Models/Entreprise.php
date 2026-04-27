<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    protected $fillable = [
        'name',
        'siret',
        'adresse',
        'postalCode',
        'city',
        'siren',
        'creationDate',
        'user_id',
        'sliceNbEmployee',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    use HasFactory;
}
