<?php

namespace App\Services\Client;

use App\Http\Traits\ApiResponse;
use App\Repositories\Client\ClassroomClientRepository;

class ClassroomClientService
{
    use ApiResponse;

    protected ClassroomClientRepository $classroomRepository;
    public function __construct(ClassroomClientRepository $classroomRepository)
    {
        $this->classroomRepository=$classroomRepository;
    }


    public function getAllClient($request){

        $result=$this->classroomRepository->getAllClient($request);

        if($result){
            return $this->apiResponse($result,'success','Get all classroom client successfully');
        }else{
            return $this->apiResponse([],'fail','Get classroom client unsuccessfully');
        }

    }
}
