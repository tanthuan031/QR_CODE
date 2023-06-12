<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\ClassroomService;
use App\Services\Client\AttendanceClientService;
use App\Services\Client\ClassroomClientService;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    protected ClassroomService $classroomService;
    protected AttendanceClientService $attendanceClientService;
    public function __construct(ClassroomService $classroomService, AttendanceClientService $attendanceClientService)
    {
        $this->classroomService = $classroomService;
        $this->attendanceClientService = $attendanceClientService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->classroomService->getAll($request);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        if ($request->has('add-class-detail')) {
            $data = $request->detail_classroom;
            return $this->classroomService->createClassroomDetail($data, $request['classroom_id']);
        } else {
            return $this->classroomService->createClassroom($request);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)

    {
        //
        return $this->classroomService->showDetailClassroom($request, $id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        if ($request->has('update_classroom')) {
            return $this->classroomService->updateClassroom($request, $id);
        } else {
            return $this->attendanceClientService->updateAttendanceClassroom($request);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        //
        if ($request->has('delete-details')) {
            return $this->classroomService->destroyStudent($id);
        } else {
            return $this->classroomService->destroy($id);
        }
    }

    public function exportClassroom(Request $request, $id)
    {
        return $this->classroomService->exportClassroom($request, $id);
    }
}
