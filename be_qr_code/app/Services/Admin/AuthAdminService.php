<?php

namespace App\Services\Admin;

use App\Http\Traits\ApiResponse;
use App\Repositories\Admin\AuthAdminRepository;
use App\Repositories\Admin\ClassroomRepository;
use Nette\Utils\Random;

class AuthAdminService
{
    use ApiResponse;

    protected AuthAdminRepository $authRepository;
    public function __construct(AuthAdminRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }
    public function loginAdminService($request)
    {

        $result = $this->authRepository->loginAdminRepository($request);
        if ($result['status'] === 200) {
            return $this->apiResponse($result['token'], $result['status'], $result['message']);
        } else {
            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }

    public  function  registerAdminService($request)
    {


        $dataRequest = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'teacher_code' => $request->teacher_code,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ];

        $result = $this->authRepository->registerAdminRepository($dataRequest);

        if ($result['status'] == 200) {
            return $this->apiResponse($result['data'], $result['status'], $result['message']);
        } else {

            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }
    public function getMeAdmin()
    {
        $result = $this->authRepository->getMeAdmin();
        if ($result['status'] === 200) {
            return $this->apiResponse($result, $result['status'], 'Get Information Successfully');
        } else {
            return $this->apiResponse([], $result['status'], 'Get Information unSuccessfully');
        }
    }

    public function logoutAdmin($request)
    {
        $result = $this->authRepository->logoutAdmin($request);
        if ($result['status'] === 200) {
            return $this->apiResponse([], 'success', $result['message'], $result['status']);
        }
    }
}
