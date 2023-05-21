<?php

namespace App\Services\Admin;

use App\Http\Traits\ApiResponse;
use App\Repositories\Admin\ClassroomRepository;
use Illuminate\Support\Facades\Auth;
use Nette\Utils\Random;

class ClassroomService
{
    use ApiResponse;

    protected ClassroomRepository $classroomRepository;
    public function __construct(ClassroomRepository $classroomRepository)
    {
        $this->classroomRepository = $classroomRepository;
    }


    public function getAll($request)
    {

        $result = $this->classroomRepository->getAll($request);

        if ($result) {
            return $this->apiResponse($result, 'success', 'Get all classroom successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Get classroom unsuccessfully');
        }
    }
    public function showDetailClassroom($request, $id)
    {

        $result = $this->classroomRepository->getAllDetailClassroom($request, $id);
        if ($result) {
            return $this->apiResponse($result, 'success', 'Get all classroom detail successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Get classroom detail unsuccessfully');
        }
    }
    public function createClassroom($request)
    {
        $user = Auth::user();
        $dataRequest = [
            'class_name' => $request->class_name,
            'number_roll_call' => $request->number_roll_call,
            'number_lesson_week' => $request->number_lesson_week,
            'teacher_code' => $user['id'],
            'class_code' => Random::generate(6, '1-9A-Z')
        ];

        $dataDetailRequest = $request->detail_classroom;
        $result = $this->classroomRepository->createClassroom($dataRequest, $dataDetailRequest);
        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], 'fail', $result['message']);
        }
    }

    public function createClassroomDetail($data, $idClass)
    {
        $result = $this->classroomRepository->createDetailClassroom($data, $idClass);
        if ($result) {
            return $this->apiResponse($result, 'success', 'Create student classroom detail successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Create student classroom detail unsuccessfully');
        }
    }

    public function updateClassroom($data, $idClass)
    {
        $result = $this->classroomRepository->updateClassroom($data, $idClass);
        if ($result['status'] == 'success') {
            return $this->apiResponse($result['data'], 'success', $result['message']);
        } else {
            return $this->apiResponse([], 'fail', $result['message']);
        }
    }

    public function destroy($idClass)
    {
        $result = $this->classroomRepository->destroy($idClass);
        if ($result) {
            return $this->apiResponse($result, 'success', 'Deleted classroom successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Deleted classroom unsuccessfully');
        }
    }

    public function exportClassroom($request, $id)
    {
        $result = $this->classroomRepository->exportClassroom($request, $id);
        if ($result) {
            return $this->apiResponse($result, 'success', 'Export classroom successfully');
        } else {
            return $this->apiResponse([], 'fail', 'Export classroom unsuccessfully');
        }
    }
}
