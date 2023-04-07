<?php

namespace App\Services\Admin;

use App\Http\Traits\ApiResponse;
use App\Repositories\Admin\ClassroomRepository;

class ClassroomService
{
    use ApiResponse;

    protected ClassroomRepository $classroomRepository;
    public function __construct(ClassroomRepository $classroomRepository)
    {
        $this->classroomRepository=$classroomRepository;
    }


    public function getAll($request){

            $result=$this->classroomRepository->getAll($request);

        if($result){
            return $this->apiResponse($result,'success','Get all classroom successfully');
        }else{
            return $this->apiResponse([],'fail','Get classroom unsuccessfully');
        }

    }
    public function showDetailClassroom($reqest,$id){

        $result=$this->classroomRepository->getAllDetailClassroom($reqest,$id);
        if($result){
            return $this->apiResponse($result,'success','Get all classroom detail successfully');
        }else{
            return $this->apiResponse([],'fail','Get classroom detail unsuccessfully');
        }

    }
    public function createClassroom($request){
        $dataRequest=[
            'class_name'=>$request->class_name,
            'number_roll_call'=>$request->number_roll_call,
            'number_lesson_week'=>$request->number_lesson_week,
            'teacher_code'=>$request->teacher_code,
        ];
        $dataDetailRequest=$request->detail_classroom;
        $result=$this->classroomRepository->createClassroom($dataRequest,$dataDetailRequest);
        if($result){
            return $this->apiResponse($result,'success',"Create classroom successfully");
        }else{
            return $this->apiResponse([],'fail','Create classroom unsuccessfully');
        }
    }



}
