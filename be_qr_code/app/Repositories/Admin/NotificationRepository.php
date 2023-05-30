<?php

namespace App\Repositories\Admin;

use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\DetailClassroom;
use App\Models\JoinClassroom;
use App\Models\Notification;
use Exception;
use Illuminate\Support\Facades\Auth;

class NotificationRepository
{
    protected $notification;
    protected int $paginate = 20;
    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }
    // Admin
    public function getAll($request)
    {

        if ($request->has('class-code')) {
            $user = Auth::user();
            $data = Notification::query()
                ->search($request)
                ->where('class_code', $request->input('class-code'))
                ->where('teacher_id', $user['id'])
                ->sort($request)
                ->get();
            return $data;
        }
        return false;
    }


    // Client

    public function getAllClient($request)
    {
        try {
            if ($request->has('class-code')) {
                $user = Auth::user();
                $checkClassroom = Classroom::query()->where('class_code', $request->input('class-code'))->first();
                if ($checkClassroom !== null) {
                    $checkStudent = DetailClassroom::query()->where('classroom_id', $checkClassroom['id'])
                        ->where('student_code', $user['student_code'])->first();
                    if ($checkStudent !== null) {
                        $data = Notification::query()
                            ->search($request)
                            ->sort($request)
                            ->where('class_code', $request->input('class-code'))
                            // ->with('teachers')
                            ->get();
                        $data = [
                            'message' => 'Get all notification successfully (CL)',
                            'status' => 'success',
                            'data'  => $data
                        ];
                    } else {
                        $data = [
                            'message' => 'Student not found',
                            'status' => 400,

                        ];
                    }
                } else {
                    $data = [
                        'message' => 'Classroom not found',
                        'status' => 400,

                    ];
                }
            } else {
                $data = [
                    'message' => 'Get all notifications unsuccessful (CL)',
                    'status' => 404
                ];
            }
        } catch (Exception $e) {
            $data = [
                'message' => 'Get all notifications unsuccessful (CL)',
                'status' => 401
            ];
        }

        return $data;
    }

    public function createNotification($request)
    {
        try {

            $user = Auth::user();
            $checkClassroom = Classroom::query()->where('class_code', $request['class_code'])
                ->where('teacher_code', $user['id'])
                ->first();

            if ($checkClassroom !== null) {
                $request['teacher_id'] = $checkClassroom['teacher_code'];
                $askPermission = Notification::query()->create($request);
                $data = [
                    'status' => 'success',
                    'message' => 'Create notification successfully',
                    'data' => $askPermission
                ];
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


    public function updateNotification($request, $id)
    {
        try {
            $checkNotification = Notification::query()->where('id', $id)->first();
            if ($checkNotification !== null) {
                $user = Auth::user();
                $checkClassroom = Classroom::query()->where('class_code', $request['class_code'])
                    ->where('teacher_code', $user['id'])
                    ->first();

                if ($checkClassroom !== null) {
                    $request['teacher_id'] = $checkClassroom['teacher_code'];
                    $checkNotification->update($request->all());
                    $data = [
                        'status' => 'success',
                        'message' => 'Update notification successfully',
                        'data' =>  $checkNotification
                    ];
                } else {
                    $data = [
                        'status' => 400,
                        'message' => 'Classroom not found',

                    ];
                }
            } else {
                $data = [
                    'status' => 400,
                    'message' => 'Notification not found',

                ];
            }
        } catch (\Exception $e) {
            $data = [
                'message' => 'Update Ask for permission unsuccessfully',
                'status' => 404
            ];
        }
        return $data;
    }

    public function destroy($id)
    {
        try {
            $teacher = Auth::user();
            $notification = Notification::query()
                ->where('teacher_id', $teacher['id'])
                ->find($id);
            if ($notification !== null) {
                $notification->delete();
                return $notification;
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return $e;
        }
    }

    // public function destroy($id)
    // {
    //     try {
    //         $teacher = Auth::user();
    //         $classroom = Classroom::query()
    //             ->where('teacher_code', $teacher['id'])
    //             ->find($id);
    //         if ($classroom !== null) {
    //             Attendance::where('classroom_id', $id)->delete();
    //             JoinClassroom::where('classroom_code', $classroom['class_code'])->delete();
    //             DetailClassroom::where('classroom_id', $id)->delete();
    //             $classroom->delete();
    //             return $classroom;
    //         } else {
    //             return false;
    //         }
    //     } catch (\Exception $e) {
    //         return $e;
    //     }
    // }
}
