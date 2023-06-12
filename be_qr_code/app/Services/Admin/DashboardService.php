<?php

namespace App\Services\Admin;

use App\Http\Traits\ApiResponse;
use App\Repositories\Admin\ClassroomRepository;
use App\Repositories\Admin\DashboardRepository;
use Illuminate\Support\Facades\Auth;
use Nette\Utils\Random;

class DashboardService
{
    use ApiResponse;

    protected DashboardRepository $dashboardRepository;
    public function __construct(DashboardRepository $dashboardRepository)
    {
        $this->dashboardRepository = $dashboardRepository;
    }


    public function getTotalDashboard($request)
    {

        $result = $this->dashboardRepository->getTotalDashboard($request);


        if ($result) {
            return $this->apiResponse($result['data'], $result['status'], 'Get total dashboard successfully');
        } else {
            return $this->apiResponse([], $result['status'], 'Get total dashboard unsuccessfully');
        }
    }

    public function getAttendanceRatio($request)
    {

        $result = $this->dashboardRepository->getAttendanceRatio($request);


        if ($result) {
            return $this->apiResponse($result['data'], $result['status'], 'Get attendance ratio successfully');
        } else {
            return $this->apiResponse([], $result['status'], 'Get attendance ratio unsuccessfully');
        }
    }
}
