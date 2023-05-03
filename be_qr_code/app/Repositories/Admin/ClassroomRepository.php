<?php

namespace App\Repositories\Admin;

use App\Models\Classroom;
use App\Models\DetailClassroom;
use Illuminate\Support\Facades\Auth;

class ClassroomRepository
{
    protected $classroom;
    protected int $paginate = 20;
    public function __construct(Classroom $classroom)
    {
        $this->classroom = $classroom;
    }
    public function getAll($request)
    {
        $user = Auth::user();
        $data = Classroom::query()
            //            ->filter($request)
            ->where('teacher_code', $user['id'])
            ->with('teachers')
            ->paginate($this->paginate);
        return $data;
    }

    public function getAllDetailClassroom($request, $id)
    {
        $result =
            DetailClassroom::query()
            ->where('classroom_id', '=', $id)
            ->with(['attendances' => function ($query) use ($id) {
                $query->where('classroom_id', $id);
            }])
            ->get();
        return $result;
    }
    public function createClassroom($request, $dataDetailRequest)
    {
        try {
            $checkClassname = Classroom::query()->where('class_name', $request['class_name'])
                ->where('teacher_code', $request['teacher_code'])
                ->first();
            if ($checkClassname === null) {
                $classroom = Classroom::query()->create($request);
                $this->createDetailClassroom($dataDetailRequest, $classroom['id']);
                $data = [
                    'data' => $classroom,
                    'message' => 'Create classroom successfully',
                    'status' => 'success'
                ];
            } else {
                $data = [
                    'message' => "Classname available",
                    'status' => 403
                ];
            }
        } catch (\Exception $e) {
            $data = [
                'message' => $e,
                'status' => 401
            ];
        }
        return $data;
    }

    public function createDetailClassroom($dataDetailRequest, $id)
    {
        try {
            foreach ($dataDetailRequest as $item) {
                DetailClassroom::query()->create([
                    'student_code' => $item['student_code'],
                    'first_name' => $item['first_name'],
                    'last_name' => $item['last_name'],
                    'classroom_id' => $id,
                    'score' => 0
                ]);
            }
            return true;
        } catch (\Exception $e) {
            return $e;
        }
    }
}
