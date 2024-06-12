<?php

namespace App\Repositories\Client;

use App\Helpers\Helper;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Mockery\Undefined;

class AuthClientRepository
{
    public function __construct()
    {
    }
    public function loginClientRepository($request)
    {
        $student = User::query()->where('student_code', $request->student_code)->first();
        if ($student) {

            if (Hash::check($request->password, $student->password)) {
                $token = $student->createToken($student->student_code)->plainTextToken;
                $data = [
                    'token' => $token,
                    'message' => "Login successfully",
                    'status' => 200,
                ];
            } else {
                $data = [
                    'message' => "Password is incorrect",
                    'status' => 403,
                ];
            }
        } else {
            $data = [
                'message' => "Student code does not exits",
                'status' => 403,
            ];
        }
        return $data;
    }
    public function registerClientRepository($request)
    {
        $checkStudentCode = User::query()->where('student_code', $request['student_code'])
            ->orWhere('email', $request['email'])
            ->first();
        if ($checkStudentCode === null) {
            // $image = Helper::saveImgBase64v1($request['image'], 'User');

            $result = User::query()->create([
                'first_name' => $request['first_name'],
                'last_name' => $request['last_name'],
                'student_code' => $request['student_code'],
                'email' => $request['email'],
                'password' => $request['password'],
                'image' =>   $request['image'],
            ]);
            $data = [
                'data' => $result,
                'message' => "Register student successful",
                'status' => 200,
            ];
        } else {
            $data = [
                'message' => "Student or email code available",
                'status' => 403,
            ];
        }

        return $data;
    }

    public function getMeClient()
    {
        $user = Auth::user();

        if ($user) {
            // $imageUrl = $user['image'];
            // if ($imageUrl) {
            //     $url = asset('storage/User/' . $imageUrl);
            //     $user->setAttribute('image', $url);
            // }
            $data = [
                'data' => $user,
                'message' => "Get user successfully",
                'status' => 200,
            ];
        } else {
            $data = [
                'message' => "Get user unsuccessfully",
                'status' => 401,
            ];
        }
        return $data;
    }

    public function logoutClient($request)
    {
        $request->user()->currentAccessToken()->delete();
        return  $result = [
            'status' => 200,
            'message' => 'Logout Successfully'
        ];
    }

    public function updateUser($request)
    {
        $user = Auth::user();
        $checkStudentCode = User::query()->where('student_code', $user['student_code'])->first();
        if ($checkStudentCode) {
            // $image = Helper::saveImgBase64v1($request['image'], 'User');
            // dd($request);
            if ($request->has('image')) {
                $imageOld = $checkStudentCode['image'];
                Storage::disk('public')->delete('User/' . $imageOld);
                $image = Helper::saveImgBase64v1($request['image'], 'User');
                $request->merge(['image' => $image]);
            }
            $result = $checkStudentCode->update($request->all());
            $data = [
                'data' => $result,
                'message' => "Update profile successfully",
                'status' => 200,
            ];
        } else {
            $data = [
                'message' => "Student not found",
                'status' => 403,
            ];
        }

        return $data;
    }
}
