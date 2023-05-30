<?php

namespace App\Services\Admin;

use App\Http\Traits\ApiResponse;
use App\Repositories\Admin\ClassroomRepository;
use App\Repositories\Admin\HistoryAskPermissionRepository;
use Illuminate\Support\Facades\Auth;
use Nette\Utils\Random;

class HistoryAskPermissionService
{
    use ApiResponse;

    protected HistoryAskPermissionRepository $historyAskPermissionRepository;
    public function __construct(HistoryAskPermissionRepository $historyAskPermissionRepository)
    {
        $this->historyAskPermissionRepository = $historyAskPermissionRepository;
    }

    // Admin
    public function getAll($request)
    {

        $result = $this->historyAskPermissionRepository->getAll($request);

        if ($result) {
            return $this->apiResponse($result, 'success', 'Get all history successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Get all history unsuccessfully');
        }
    }

    // Client
    public function getAllHistoryAskPermissionStudent($request)
    {

        $result = $this->historyAskPermissionRepository->getAllHistoryAskPermissionStudent($request);

        if ($result) {
            return $this->apiResponse($result, 'success', 'Get all history student successfully (CL)');
        } else {
            return $this->apiResponse([], 'fail', 'Get all history student unsuccessfully (CL)');
        }
    }
    // public function showDetailClassroom($request, $id)
    // {

    //     $result = $this->classroomRepository->getAllDetailClassroom($request, $id);
    //     if ($result) {
    //         return $this->apiResponse($result, 'success', 'Get all classroom detail successfully');
    //     } else {
    //         return $this->apiResponse([], 'fail', 'Get classroom detail unsuccessfully');
    //     }
    // }

    public function createAskPermission($request)
    {

        $user = Auth::user();
        $dataRequest = [
            'class_code' => $request->class_code,
            'student_code' =>  $user['student_code'],
            'number_roll_call' => $request->number_roll_call,
            'number_lesson_week' => $request->number_lesson_week,
            'reason' => $request->reason,
            'status' => $request->status,
        ];

        $result = $this->historyAskPermissionRepository->createAskPermission($dataRequest);
        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }

    public function updateAskPermission($request, $id)
    {
        $result = $this->historyAskPermissionRepository->updateAskPermission($request, $id);
        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }

    // Client

    public function updateAskPermissionClient($request, $id)
    {
        $result = $this->historyAskPermissionRepository->updateAskPermissionClient($request, $id);
        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }
}
