<?php

namespace App\Services\Client;

use App\Http\Traits\ApiResponse;
use App\Models\Teacher;
use App\Repositories\Client\AttendanceClientRepository;
use App\Repositories\Client\ClassroomClientRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;

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
        // Check time 
        $requestedTime = Carbon::createFromFormat('n/j/Y, g:i:s A', $request['create_at']);
        $expiryTime = $requestedTime->copy()->addMinutes($request['attendance_time']);
        $formattedTime = $expiryTime->format('Y-m-d H:i:s');
        $now = \Carbon\Carbon::now();
        $now->setTimezone('Asia/Ho_Chi_Minh');
        $formattedTimeNow
            = $now->format('Y-m-d H:i:s');
        $datetimeNow = Carbon::parse($formattedTimeNow);
        $datetime2 = Carbon::parse($formattedTime);
        // Kiểm tra xem thời gian hiện tại có còn hạn hay không
        if (!$datetimeNow->lessThanOrEqualTo($datetime2)) {
            return $this->apiResponse([], 'fail', "Time out");
        }
        // Check token
        $parts = explode('|', $request['tokensAdmin']);
        $token_value = $parts[1];
        $tokenExists = DB::table('personal_access_tokens')
            ->where('token', hash('sha256', $token_value))
            ->where('expires_at', null)
            ->exists();
        if (!$tokenExists) {
            return $this->apiResponse([], 'fail', "Hacker token");
        }

        $studentCode = Auth::user(); //auth
        $dataRequest = [
            'classroom_id' => $request->classroom_id,
            'student_code' => $studentCode['student_code'],
            'week' => $request->attendance_week,
            'lesson' => $request->attendance_lesson,
            'status' => '0'
        ];
        $result = $this->attendanceRepository->createAttendanceStudent($dataRequest);
        if (
            $result['status'] == 'success'
        ) {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], $result['status'], $result['message']);
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
