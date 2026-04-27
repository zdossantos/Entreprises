<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class EntrepriseController extends Controller
{
    /**
     * Proxy the INSEE SIRENE API lookup for a given SIRET number.
     * The API token lives in config/services.php and is never exposed to the browser.
     */
    public function lookupSiret(string $siret): JsonResponse
    {
        $token = config('services.insee.token');

        $response = Http::withToken($token)
            ->get("https://api.insee.fr/entreprises/sirene/V3/siret/{$siret}");

        if ($response->failed()) {
            return response()->json(['error' => 'Entreprise non trouvée'], $response->status());
        }

        return response()->json($response->json());
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $entreprises = Entreprise::where('user_id', auth()->user()->id)->latest()->paginate(10);
        return Inertia::render('Entreprise/Index', ['entreprises' => $entreprises]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Entreprise/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = Request::validate([
            'name' => ['required'],
            'siret' => ['required','digits:14'],
            'adresse' => ['nullable'],
            'postalCode' => ['nullable','digits:5'],
            'city' => ['nullable'],
            'siren' => ['required','digits:9'],
            'creationDate' => ['required','date'],
            'sliceNbEmployee' => ['nullable'],
        ]);
        $entreprise = new Entreprise();
        $entreprise->name = $data['name'];
        $entreprise->user_id = auth()->user()->id;
        $entreprise->siret = $data['siret'];
        $entreprise->adresse = $data['adresse'];
        $entreprise->postalCode = $data['postalCode'];
        $entreprise->city = $data['city'];
        $entreprise->siren = $data['siren'];
        $entreprise->creationDate = $data['creationDate'];
        $entreprise->sliceNbEmployee = $data['sliceNbEmployee'];
        $entreprise->save();
        return redirect()->route('entreprises.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Illuminate\Http\Response
     */
    public function show(Entreprise $entreprise)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Illuminate\Http\Response
     */
    public function edit(Entreprise $entreprise)
    {
        if ($entreprise->user_id == auth()->user()->id) {
            return Inertia::render('Entreprise/Edit', [
                'entreprise' => [
                    'id' => $entreprise->id,
                    'name' => $entreprise->name,
                    'siret' => $entreprise->siret,
                    'adresse' => $entreprise->adresse,
                    'postalCode' => $entreprise->postalCode,
                    'city' => $entreprise->city,
                    'siren' => $entreprise->siren,
                    'creationDate' => $entreprise->creationDate,
                    'sliceNbEmployee' => $entreprise->sliceNbEmployee,
                ],
            ]);
        } else {
            return Redirect::route('entreprises.index');
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Entreprise $entreprise)
    {
        $data = Request::validate([
            'name' => ['required'],
            'siret' => ['required'],
            'adresse' => ['nullable'],
            'postalCode' => ['nullable'],
            'city' => ['nullable'],
            'siren' => ['required'],
            'creationDate' => ['required'],
            'sliceNbEmployee' => ['nullable'],
        ]);
        $entreprise->update($data);

        return Redirect::route('entreprises.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Illuminate\Http\Response
     */
    public function destroy(Entreprise $entreprise)
    {
        if ($entreprise->user_id == auth()->user()->id) {
            $entreprise->delete();
            return Redirect::route('entreprises.index');
        } else {
            return Redirect::route('entreprises.index');
        }
    }
}
