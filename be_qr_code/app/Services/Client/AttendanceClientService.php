<?php

namespace App\Services\Client;

use App\Http\Traits\ApiResponse;
use App\Repositories\Client\AttendanceClientRepository;
use App\Repositories\Client\ClassroomClientRepository;

class AttendanceClientService
{
    use ApiResponse;

    protected AttendanceClientRepository $attendanceRepository;
    public function __construct(AttendanceClientRepository $attendanceRepository)
    {
        $this->attendanceRepository = $attendanceRepository;
    }

    public function createAttendanceClassroom($request)
    {
        $studentCode = '3119202825'; //auth
        $dataRequest = [
            'classroom_id' => $request->classroom_id,
            'student_code' => $studentCode,
            'week' => $request->week,
            'lesson' => $request->lesson,
            'status' => $request->status
        ];
        $result = $this->attendanceRepository->createAttendanceStudent($dataRequest);
        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], 'fail', $result['message']);
        }
    }

    public function updateAttendanceClassroom($request)
    {

        $dataRequest = [
            'student_code' => $request->student_code,
            'classroom_id' => $request->classroom_id,
            'week' => $request->week,
            'lesson' => $request->lesson,
            'status' => $request->status
        ];
        $result = $this->attendanceRepository->updateAttendanceStudent($dataRequest);
        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], 'fail', $result['message']);
        }
    }
}
