<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterUserRequest;
use App\Models\Transaction;



class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', $search . '%');
        }

        $users = $query->paginate(10);

        return UserResource::collection($users);
    }

    public function userProfile(Request $request)
    {
        return new UserResource($request->user());
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }


    public function update(UpdateUserRequest $request, User $user)
    {

        $user_old_photo = $user->photo_filename;
        $user->fill($request->validated());
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        //Usando base64
        if ($request->photo_filename) {
            if (Storage::disk('public')->exists('photos/' . $user_old_photo)) {
                Storage::disk('public')->delete('photos/' . $user_old_photo);
            }

            $image = $request->photo_filename;
            $image = str_replace('data:image/png;base64,', '', $image);
            $image = str_replace('data:image/jpeg;base64,', '', $image);
            $image = str_replace(' ', '+', $image);
            $imageData = base64_decode($image);


            $extension = 'png';
            if (strpos($request->photo_filename, 'data:image/jpeg;base64,') === 0) {
                $extension = 'jpg';
            }
            $filename = $user->id . '_' . uniqid() . '.' . $extension;
            Storage::disk('public')->put('photos/' . $filename, $imageData);
            $user->photo_filename = $filename;
        }



        $user->save();
        $user->updated_at = now();

        return new UserResource($user);
    }

    public function delete(User $user)
    {

        $user->delete();
        $user->brain_coins_balance = 0;
        $user->save();

        return response()->json([
            'message' => 'ID: ' . $user->id . ', Name: ' . $user->name . ' deleted!'
        ]);
    }

    public function register(RegisterUserRequest $request)
    {
        $validatedData = $request->validated();

        // Criação do utilizador
        $user = new User();
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        $user->nickname = $validatedData['nickname'];
        $user->blocked = false;
        $user->brain_coins_balance = $validatedData['type'] === 'A' ? 0 : 10;
        $user->password = Hash::make($request->password);
        $user->type = $validatedData['type'];

        if ($user->save()) {
            // Criação das coins para um new user
            Transaction::create([
                'user_id' => $user->id,
                'brain_coins' => 10,
                'type' => 'B',
                'transaction_datetime' => now(),
            ]);

            // Processamento da foto, se fornecida
            if ($request->photo_filename) {
                $base64Image = $request->photo_filename;

                // Decodificar imagem Base64
                $base64Image = preg_replace('#^data:image/\w+;base64,#i', '', $base64Image);
                $imageData = base64_decode($base64Image);

                // Identificar extensão da imagem
                $extension = 'png';
                if (str_starts_with($request->photo_filename, 'data:image/jpeg;base64,')) {
                    $extension = 'jpg';
                }

                // Gerar nome do arquivo e salvar
                $filename = $user->id . '_' . uniqid() . '.' . $extension;
                Storage::disk('public')->put('photos/' . $filename, $imageData);

                // Atualizar o campo `photo_filename` do utilizador
                $user->photo_filename = $filename;
                $user->save();
            }

            return new UserResource($user);
        }

        return response()->json(['error' => 'Unable to create user'], 500);
    }
}
