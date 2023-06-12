<?php

namespace App\Repositories\Client;

use App\Models\Classroom;
use App\Models\DetailClassroom;
use App\Models\JoinClassroom;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ClassroomClientRepository
{

    protected $classroomRepo;
    protected $paginate;
    public function __construct(Classroom $classroom)
    {
        $this->classroomRepo = $classroom;
    }

    public function getAllClient($request)
    {
        try {
            $user =  Auth::user();
            $studentCode = $user['student_code'];
            $data = Classroom::whereExists(function ($query) use ($studentCode) {
                $query->select(DB::raw(1))
                    ->from('join_classrooms')
                    ->whereColumn('classrooms.class_code', '=', 'join_classrooms.classroom_code')
                    ->where('student_code', $studentCode);
            })
                ->sort($request)
                ->search($request)
                ->with('teachers')->paginate($this->paginate);


            return $data;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function createJoinClassroom($request)
    {
        try {
            $checkJoin = JoinClassroom::query()->where('student_code', '=', $request['student_code'])
                ->where('classroom_code', '=', $request['classroom_code'])->first();

            if ($checkJoin === null) {
                $checkClassroom = Classroom::query()->where('class_code', '=', $request['classroom_code'])->first();
                if ($checkClassroom !== null) {
                    $checkStudentCode = DetailClassroom::query()->where('student_code', '=', $request['student_code'])
                        ->where('classroom_id', '=', $checkClassroom->id)
                        ->first();
                    if ($checkStudentCode !== null) {
                        $result = JoinClassroom::query()->create($request);
                        $data = [
                            'status' => 'success',
                            'message' => "Create join classroom successfully",
                            'data' => $result
                        ];
                    } else {
                        $data = [
                            'status' => 401,
                            'message' => "Student not found in classroom",
                        ];
                    }
                } else {
                    $data = [
                        'status' => 401,
                        'message' => "Class code not available",

                    ];
                }
            } else {
                $data = [
                    'status' => 401,
                    'message' => "Your join classroom available",

                ];
            }
        } catch (\Exception $e) {

            $data = [
                'status' => 401,
                'message' => "Create join classroom unsuccessfully",

            ];
        }
        return $data;
    }

    public function showStudentClassroom($idClassroom)
    {
        $user =  Auth::user();
        $studentCode = $user['student_code'];
        try {
            $result =
                DetailClassroom::query()
                ->where('classroom_id', '=', $idClassroom)
                ->where('student_code', '=', $studentCode)
                ->with(['attendances' => function ($query) use ($idClassroom) {
                    $query->where('classroom_id', $idClassroom);
                }])
                ->first();

            if ($result) {
                $data = [
                    'message' => 'Get student successfully',
                    'status' => 'success',
                    'data' => $result
                ];
            } else {
                $data = [
                    'message' => 'Get student unsuccessfully',
                    'status' => 'fail',

                ];
            }
            return $data;
        } catch (\Exception $e) {
            return false;
        }
    }
}
