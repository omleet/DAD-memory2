<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;




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

    public function delete(User $user){

        $user->delete();
        $user->brain_coins_balance = 0;
        $user->save();

        return response()->json([
            'message' => 'ID: '. $user->id .', Name: '. $user->name . ' deleted!'
        ]);
    }

    
}
