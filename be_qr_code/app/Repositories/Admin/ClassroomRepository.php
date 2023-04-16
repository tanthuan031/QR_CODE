<?php

namespace App\Repositories\Admin;

use App\Models\Classroom;
use App\Models\DetailClassroom;

class ClassroomRepository
{
    protected $classroom;
    protected int $paginate = 8;
    public function __construct(Classroom $classroom)
    {
        $this->classroom=$classroom;

    }
    public function getAll($request){


        $data=Classroom::query()
//            ->filter($request)
                ->with('teachers')
            ->paginate($this->paginate);
        return $data;

    }

    public function getAllDetailClassroom($request,$id){
        $data=DetailClassroom::query()->where('classroom_id',$id)
//            ->filter($request)
            ->get();
        return $data;
    }
    public function createClassroom($request,$dataDetailRequest){
        try {
            $checkClassname=Classroom::query()->where('class_name',$request['class_name'])->first();
            if ($checkClassname===null){
                $classroom=Classroom::query()->create($request);
                $this->createDetailClassroom($dataDetailRequest,$classroom['id']);
                $data=[
                    'data'=>$classroom,
                    'message'=>'Create classroom successfully',
                    'status'=>'success'
                ];
            }else{
                $data=[
                    'message'=>"Classname available",
                    'status'=>403
                ];
            }


        }catch (\Exception $e){
            $data=[
                'message'=>$e,
                'status'=>403
            ];
        }
        return $data;
    }

    public function createDetailClassroom($dataDetailRequest,$id){
        try {
            foreach ($dataDetailRequest as $item){
                DetailClassroom::query()->create([
                    'student_code'=>$item['student_code'],
                    'first_name'=>$item['first_name'],
                    'last_name'=>$item['last_name'],
                    'classroom_id'=>$id,
                    'roll_coll'=>'1',
                    'score'=>'1'
                ]);
            }
            return true;

        }catch (\Exception $e){
            return $e;
        }
    }



}
