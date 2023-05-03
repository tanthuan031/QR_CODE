<?php

namespace App\Services\Client;

use App\Http\Traits\ApiResponse;
use App\Repositories\Client\ClassroomClientRepository;
use Illuminate\Support\Facades\Auth;

class ClassroomClientService
{
    use ApiResponse;

    protected ClassroomClientRepository $classroomRepository;
    public function __construct(ClassroomClientRepository $classroomRepository)
    {
        $this->classroomRepository = $classroomRepository;
    }


    public function getAllClient($request)
    {

        $result = $this->classroomRepository->getAllClient($request);

        if ($result) {
            return $this->apiResponse($result, 'success', 'Get all classroom client successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Get classroom client unsuccessfully');
        }
    }

    public function createJoinClassroom($request)
    {
        $studentCode = Auth::user();


        $dataRequest = [
            'student_code' => $studentCode['student_code'],
            'classroom_code' => $request->classroom_code,
        ];
        $result = $this->classroomRepository->createJoinClassroom($dataRequest);
        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], 'fail', $result['message']);
        }
    }

    public function showStudentClassroom($idClassroom)
    {

        $result = $this->classroomRepository->showStudentClassroom($idClassroom);
        //        dd($result['status']);
        if ($result['status'] == 'success') {

            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {

            return $this->apiResponse([], 'fail', $result['message']);
        }
    }

    public function studentAttendance($request, $id)
    {

        $result = $this->classroomRepository->studentAttendance($request, $id);
        if ($result['status'] == 'success') {

            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {

            return $this->apiResponse([], 'fail', $result['message']);
        }
    }

    public function createJoinClassroom($request){
        $studentCode='1925535440';
        $dataRequest=[
            'student_code'=>$studentCode,
            'classroom_code'=>$request->classroom_code,
        ];
        $result=$this->classroomRepository->createJoinClassroom($dataRequest);
        if($result['status']=='success'){
            return $this->apiResponse($result['data'],'success',$result['message']);
        }else{
            return $this->apiResponse([],'fail',$result['message']);
        }
    }

    public function showStudentClassroom($idClassroom){

        $result=$this->classroomRepository->showStudentClassroom($idClassroom);
//        dd($result['status']);
        if ($result['status']=='success'){

            return $this->apiResponse($result['data'],'success',$result['message']);
        }else{

            return $this->apiResponse([],'fail',$result['message']);
        }
    }

    public function studentAttendance($request,$id){

        $result=$this->classroomRepository->studentAttendance($request,$id);
//        dd($result['status']);
        if ($result['status']=='success'){

            return $this->apiResponse($result['data'],'success',$result['message']);
        }else{

            return $this->apiResponse([],'fail',$result['message']);
        }
    }
}
