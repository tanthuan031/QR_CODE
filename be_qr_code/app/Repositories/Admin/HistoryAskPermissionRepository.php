<?php

namespace App\Repositories\Admin;

use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\DetailClassroom;
use App\Models\HistoryAskPermission;
use App\Models\JoinClassroom;
use Illuminate\Support\Facades\Auth;

class HistoryAskPermissionRepository
{
    protected $history;
    protected int $paginate = 20;
    public function __construct(HistoryAskPermission $history)
    {
        $this->history = $history;
    }
    // Admin
    // teacher admin
    public function getAll($request)
    {
        if ($request->has('detail-history')) {
            $user = Auth::user();
            $data = HistoryAskPermission::query()
                ->search($request)
                ->where('teacher_id', $user['id'])
                ->where('class_code', $request->input('detail-history'))
                ->with('classrooms')
                ->with('users')
                ->sort($request)
                ->get();
            return $data;
        } else {
            $user = Auth::user();
            $data = HistoryAskPermission::query()
                ->search($request)
                ->where('teacher_id', $user['id'])
                ->with('classrooms')
                ->distinct('class_code')

                ->get();
            return $data;
        }
    }

    // Client
    // Get all history students client

    public function getAllHistoryAskPermissionStudent($request)
    {
        $user = Auth::user();

        $data = HistoryAskPermission::query()
            ->search($request)
            ->where('student_code', $user['student_code'])
            ->with('classrooms')
            // ->distinct('class_code')
            ->paginate($this->paginate);

        return $data;
    }

    // Admin
    public function getAllDetailHistoryClass($request, $id)
    {
        $user = Auth::user();
        $data = HistoryAskPermission::query()
            ->search($request)
            ->where('id', $id)
            ->paginate($this->paginate);
        return $data;
    }

    // Client
    public function createAskPermission($request)
    {

        try {

            $checkClassroom = Classroom::query()->where('class_code', $request['class_code'])->first();

            if ($checkClassroom !== null) {
                $checkClassroomDetail = DetailClassroom::query()->where('classroom_id', $checkClassroom['id'])->where('student_code', $request['student_code'])->first();
                if ($checkClassroomDetail !== null) {
                    $checkHistory = HistoryAskPermission::query()
                        ->where('class_code', $request['class_code'])
                        ->where('student_code', $request['student_code'])
                        ->where('number_roll_call', $request['number_roll_call'])
                        ->where('number_lesson_week', $request['number_lesson_week'])
                        ->first();
                    if ($checkHistory == null) {
                        $request['teacher_id'] = $checkClassroom['teacher_code'];
                        $askPermission = HistoryAskPermission::query()->create($request);
                        $data = [
                            'status' => 'success',
                            'message' => 'Create Ask for permission successfully',
                            'data' => $askPermission
                        ];
                    } else {
                        $data = [
                            'status' => 400,
                            'message' => 'You have ask for permission',
                        ];
                    }
                } else {
                    $data = [
                        'status' => 400,
                        'message' => 'Student in classroom not found',
                    ];
                }
            } else {
                $data = [
                    'status' => 400,
                    'message' => 'Classroom not found',

                ];
            }
        } catch (\Exception $e) {
            $data = [
                'message' => 'Create Ask for permission unsuccessfully',
                'status' => 404
            ];
        }
        return $data;
    }

    // Admin
    public function updateAskPermission($request, $id)
    {

        try {
            $checkHistory = HistoryAskPermission::query()->where('id', $id)->first();
            if ($checkHistory !== null) {
                $checkHistory->update($request->all());
                $data = [
                    'status' => 'success',
                    'message' => 'Update Ask for permission successfully',
                    'data' =>  $checkHistory
                ];
            } else {
                $data = [
                    'status' => 400,
                    'message' => 'History ask for permission not found',

                ];
            }
        } catch (\Exception $e) {
            $data = [
                'message' => 'Update Ask for permission unsuccessfully',
                'status' => 401
            ];
        }
        return $data;
    }

    // Client
    public function updateAskPermissionClient($request, $id)
    {

        try {
            $user = Auth::user();
            $checkHistory = HistoryAskPermission::query()
                ->where('id', $id)
                ->where('student_code', $user['student_code'])
                ->first();
            if ($checkHistory !== null) {
                $checkHistory->update($request->all());
                $data = [
                    'status' => 'success',
                    'message' => 'Update Ask for permission successfully (CL)',
                    'data' =>  $checkHistory
                ];
            } else {
                $data = [
                    'status' => 400,
                    'message' => 'History ask for permission not found (CL)',

                ];
            }
        } catch (\Exception $e) {
            $data = [
                'message' => 'Update Ask for permission unsuccessfully (CL)',
                'status' => 401
            ];
        }
        return $data;
    }
}
