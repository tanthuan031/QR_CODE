<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Auth\LoginRequest;
use App\Http\Requests\Admin\Auth\RegisterRequest;
use App\Services\Admin\AuthAdminService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthAdminController extends Controller
{

    protected AuthAdminService $authService;
    public function __construct(AuthAdminService $authService)
    {
        $this->authService = $authService;
    }
    /**
     * Login a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function login(LoginRequest $request): JsonResponse
    {

        return $this->authService->loginAdminService($request);
    }

    /**
     * Register the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function register(RegisterRequest $request)
    {
        //
        return $this->authService->registerAdminService($request);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        //
    }

    public function getMeAdmin(): JsonResponse
    {
        return $this->authService->getMeAdmin();
    }
    public function logoutAdmin(Request $request): JsonResponse
    {
        return $this->authService->logoutAdmin($request);
    }
}
