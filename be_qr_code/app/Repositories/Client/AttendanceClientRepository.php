<?php

namespace App\Repositories\Client;

use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\DetailClassroom;
use Exception;

class AttendanceClientRepository
{

    protected $attendanceRepo;
    protected $paginate;
    public function __construct(Attendance $attendance)
    {
        $this->attendanceRepo = $attendance;
    }
    // Student attendance 
    public function createAttendanceStudent($request)
    {
        try {
            // Kiem tra xem sinh vien co trong lop do khong
            $checkStudentClassroom = DetailClassroom::query()->where('student_code', '=', $request['student_code'])
                ->where('classroom_id', '=', $request['classroom_id'])->first();

            if ($checkStudentClassroom !== null) {
                // Tim thu buoi hom do da diem danh chua
                $checkAttendance = Attendance::query()
                    ->where('student_code', '=', $request['student_code'])
                    ->where('classroom_id', '=', $request['classroom_id'])
                    ->where('week', '=', $request['week'])
                    ->where('lesson', '=', $request['lesson'])
                    ->first();
                // Goi de tinh diem 
                $resultClassroom = Classroom::query()->where('id', '=', $request['classroom_id'])->first();

                if ($checkAttendance !== null) {

                    $result = $checkAttendance->update($request);

                    if ($request['status'] == '0') {
                        $score = $checkStudentClassroom['score']  + 10 / ($resultClassroom['number_roll_call'] * $resultClassroom['number_lesson_week']);
                        $checkStudentClassroom->update([
                            'score' => $score
                        ]);
                    } else {
                        $score = $checkStudentClassroom['score']  - 10 / ($resultClassroom['number_roll_call'] * $resultClassroom['number_lesson_week']);
                        $checkStudentClassroom->update([
                            'score' => $score
                        ]);
                    }
                    $data = [
                        'status' => 'success',
                        'message' => "Attendance student successfully (up)",
                        'data' => $result
                    ];
                } else {
                    $result = Attendance::query()->create($request);
                    if ($request['status'] == '0') {
                        $score = $checkStudentClassroom['score']  + 10 / ($resultClassroom['number_roll_call'] * $resultClassroom['number_lesson_week']);
                        $checkStudentClassroom->update([
                            'score' => $score
                        ]);
                    } else {
                        $score = $checkStudentClassroom['score']  - 10 / ($resultClassroom['number_roll_call'] * $resultClassroom['number_lesson_week']);
                        $checkStudentClassroom->update([
                            'score' => $score
                        ]);
                    }
                    $data = [
                        'status' => 'success',
                        'message' => "Attendance student successfully (Cr)",
                        'data' => $result
                    ];
                }
            } else {
                $data = [
                    'status' => 404,
                    'message' => 'Student or classroom not found',
                ];
            }
        } catch (Exception $e) {
            $data = [
                'status' => 401,
                'message' => 'Error. Attendance student unsuccessfully',
            ];
        }
        return $data;
    }
    // Admin Atendance for student
    public function updateAttendanceStudent($request)
    {
        try {
            $checkStudentClassroom = DetailClassroom::query()->where('student_code', '=', $request['student_code'])
                ->where('classroom_id', '=', $request['classroom_id'])->first();
            if ($checkStudentClassroom !== null) {
                $checkAttendance = Attendance::query()
                    ->where('student_code', '=', $request['student_code'])
                    ->where('classroom_id', '=', $request['classroom_id'])
                    ->where('week', '=', $request['week'])
                    ->where('lesson', '=', $request['lesson'])
                    ->first();
                $resultClassroom = Classroom::query()->where('id', '=', $request['classroom_id'])->first();

                if ($checkAttendance !== null) {
                    $result = $checkAttendance->update($request);
                    if ($request['status'] == '0') {
                        $score = $checkStudentClassroom['score']  + 10 / ($resultClassroom['number_roll_call'] * $resultClassroom['number_lesson_week']);
                        $checkStudentClassroom->update([
                            'score' => $score
                        ]);
                    } else {
                        $score = $checkStudentClassroom['score']  - 10 / ($resultClassroom['number_roll_call'] * $resultClassroom['number_lesson_week']);
                        $checkStudentClassroom->update([
                            'score' => $score
                        ]);
                    }
                    $data = [
                        'status' => 'success',
                        'message' => "Update attendance student successfully",
                        'data' => $result
                    ];
                } else {
                    $result = Attendance::query()->create($request);
                    if ($request['status'] == '0') {
                        $score = $checkStudentClassroom['score']  + 10 / ($resultClassroom['number_roll_call'] * $resultClassroom['number_lesson_week']);
                        $checkStudentClassroom->update([
                            'score' => $score
                        ]);
                    } else {
                        $score = $checkStudentClassroom['score']  - 10 / ($resultClassroom['number_roll_call'] * $resultClassroom['number_lesson_week']);
                        $checkStudentClassroom->update([
                            'score' => $score
                        ]);
                    }
                    $data = [
                        'status' => 'success',
                        'message' => "Attendance student successfully",
                        'data' => $result
                    ];
                }
            } else {
                $data = [
                    'status' => 401,
                    'message' => 'Student or classroom not found',
                ];
            }
        } catch (Exception $e) {
            $data = [
                'status' => 401,
                'message' => 'Error. Attendance student unsuccessfully',
            ];
        }
        return $data;
    }
}
