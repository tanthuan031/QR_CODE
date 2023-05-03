<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\Auth\LoginRequest;
use App\Http\Requests\Client\Auth\RegisterRequest;
use App\Services\Client\AuthClientServices;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthClientController extends Controller
{
    protected AuthClientServices $authService;
    public function __construct(AuthClientServices $authService)
    {
        $this->authService = $authService;
    }
    // public function getMe(): JsonResponse
    // {
    //     // return $this->authService->getMe();
    // }
    /**
     * Login a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function login(LoginRequest $request): JsonResponse
    {
        //
        return $this->authService->loginClientService($request);
    }

    /**
     * Register the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function register(RegisterRequest $request)
    {
        //
        return $this->authService->registerClientService($request);
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

    public function getMeClient(): JsonResponse
    {
        return $this->authService->getMeClient();
    }
    public function logoutClient(Request $request): JsonResponse
    {
        return $this->authService->logoutClient($request);
    }
}
