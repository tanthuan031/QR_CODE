<?php

namespace App\Services\Admin;

use App\Http\Traits\ApiResponse;
use App\Repositories\Admin\ClassroomRepository;
use App\Repositories\Admin\NotificationRepository;
use Illuminate\Support\Facades\Auth;
use Nette\Utils\Random;

class NotificationService
{
    use ApiResponse;

    protected NotificationRepository $notificationService;
    public function __construct(NotificationRepository $notificationService)
    {
        $this->notificationService = $notificationService;
    }


    public function getAll($request)
    {

        $result = $this->notificationService->getAll($request);

        if ($result) {
            return $this->apiResponse($result, 'success', 'Get all notification successfully');
        } else {
            return $this->apiResponse([], 400, 'Get  all notification unsuccessfully');
        }
    }

    public function getAllClient($request)
    {
        $result = $this->notificationService->getAllClient($request);

        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], $result['status'], $result['message']);
        } else {
            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }

    public function createNotification($request)
    {

        $dataRequest = [
            'class_code' => $request->class_code,
            'title' => $request->title,
            'content' => $request->content
        ];

        $result = $this->notificationService->createNotification($dataRequest);
        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }

    public function updateNotification($request, $id)
    {
        $result = $this->notificationService->updateNotification($request, $id);
        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], $result['status'], $result['message']);
        }
    }

    public function destroy($idNotification)
    {
        $result = $this->notificationService->destroy($idNotification);
        if ($result) {
            return $this->apiResponse($result, 'success', 'Deleted notification successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Deleted notification unsuccessfully');
        }
    }
}
