<?php

namespace App\Services\Client;

use App\Helpers\Helper;
use App\Http\Traits\ApiResponse;
use App\Repositories\Client\AuthClientRepository;

class AuthClientServices
{
    use ApiResponse;

    protected AuthClientRepository $authRepository;
    public function __construct(AuthClientRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }
    public function loginClientService($request)
    {
        $result = $this->authRepository->loginClientRepository($request);
        if ($result['status'] === 200) {
            return $this->apiResponse($result['token'], $result['status'], $result['message']);
        } else {
            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }
    public  function  registerClientService($request)
    {

        $dataRequest = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'student_code' => $request->student_code,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'image' =>   $request->image,
        ];

        $result = $this->authRepository->registerClientRepository($dataRequest);

        if ($result['status'] == 200) {
            return $this->apiResponse($result['data'], $result['status'], $result['message']);
        } else {

            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }

    public function getMeClient()
    {
        $result = $this->authRepository->getMeClient();
        if ($result['status'] === 200) {
            return $this->apiResponse($result, $result['status'], 'Get Information Successfully');
        } else {
            return $this->apiResponse([], $result['status'], 'Get Information unSuccessfully');
        }
    }

    public function logoutClient($request)
    {
        $result = $this->authRepository->logoutClient($request);
        if ($result['status'] === 200) {
            return $this->apiResponse([], 'success', $result['message'], $result['status']);
        }
    }

    public  function  updateUser($request)
    {

        $result = $this->authRepository->updateUser($request);

        if ($result['status'] == 200) {
            return $this->apiResponse($result['data'], $result['status'], $result['message']);
        } else {

            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }
}
