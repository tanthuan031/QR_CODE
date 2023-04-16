<?php

namespace App\Repositories\Client;

use App\Models\Classroom;
use Illuminate\Support\Facades\DB;

class ClassroomClientRepository
{

    protected $classroomRepo;
    protected $paginate;
    public function __construct(Classroom $classroom)
    {
        $this->classroomRepo=$classroom;
    }

    public function getAllClient($request){
        try {
            $studentCode="6275573318";
            $data = Classroom::whereExists(function ($query) use ($studentCode) {
                $query->select(DB::raw(1))
                    ->from('join_classrooms')
                    ->whereColumn('classrooms.class_code', '=', 'join_classrooms.classroom_id')
                    ->where('student_code', $studentCode);
            })
                ->with('teachers')->paginate($this->paginate);

            return $data;
        }catch (\Exception $e){
            dd($e);
        }

    }

}
