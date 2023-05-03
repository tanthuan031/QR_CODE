<?php

namespace App\Repositories\Admin;

use App\Helpers\Helper;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthAdminRepository
{
    public function __construct()
    {
    }
    public function loginAdminRepository($request)
    {
        $teacher = Teacher::query()->where('teacher_code', $request->teacher_code)->first();
        if ($teacher) {

            if (Hash::check($request->password, $teacher->password)) {
                $token = $teacher->createToken($teacher->teacher_code)->plainTextToken;
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
    public function registerAdminRepository($request)
    {

        $checkTeacherCode = Teacher::query()->where('teacher_code', $request['teacher_code'])
            ->orWhere('email', $request['email'])
            ->first();
        if ($checkTeacherCode === null) {

            $result = Teacher::query()->create([
                'first_name' => $request['first_name'],
                'last_name' => $request['last_name'],
                'teacher_code' => $request['teacher_code'],
                'email' => $request['email'],
                'password' => $request['password'],

            ]);
            $data = [
                'data' => $result,
                'message' => "Register teacher successful",
                'status' => 200,
            ];
        } else {
            $data = [
                'message' => "Teacher or email code available",
                'status' => 403,
            ];
        }

        return $data;
    }

    public function getMeAdmin()
    {
        $user = Auth::user();
        if ($user) {
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

    public function logoutAdmin($request)
    {
        $request->user()->currentAccessToken()->delete();
        return  $result = [
            'status' => 200,
            'message' => 'Logout Successfully'
        ];
    }
}
