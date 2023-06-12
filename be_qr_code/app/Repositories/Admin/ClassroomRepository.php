<?php

namespace App\Repositories\Admin;

use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\DetailClassroom;
use App\Models\JoinClassroom;
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
            ->search($request)
            ->sort($request)
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
            ->with(['users' => function ($query) {
                $query->select('id', 'student_code', 'image');
            }])
            ->get();
        // Thêm đường dẫn đầy đủ vào trường image
        $result->map(function ($detailClassroom) {
            if ($detailClassroom->users && $detailClassroom->users->image) {
                $detailClassroom->users->image = asset('storage/User/' . $detailClassroom->users->image);
            }
            return $detailClassroom;
        });

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

    public function updateClassroom($dataRequest, $id)
    {
        try {
            if (isset($dataRequest->number_lesson_week) || isset($dataRequest->number_roll_call)) {
                $attendance = Attendance::query()->where('classroom_id', $id)->first();
                if ($attendance !== null) {
                    return [
                        'message' => 'Classroom has been attendanced. Not updated number lesson week & number roll call',
                        'status' => 'fail'
                    ];
                }
            }
            $resultClassroom = Classroom::query()->where('id', '=', $id)->first();
            $resultClassroom->update($dataRequest->all());
            return [
                'message' => 'Update classroom successfully',
                'status' => 'success',
                'data' => $resultClassroom
            ];
        } catch (\Exception $e) {
            return $e;
        }
    }
    // Delete student
    public function destroyStudent($id)
    {
        try {
            $teacher = Auth::user();
            $detailClassroom = DetailClassroom::query()->find($id);
            if ($detailClassroom !== null) {
                $checkTeacher = Classroom::query()->where('teacher_code', $teacher['id'])->find($detailClassroom['classroom_id']);
                if ($checkTeacher !== null) {
                    $classroom = Classroom::query()->where('id', $detailClassroom['classroom_id'])->first();
                    Attendance::where('student_code', $detailClassroom['student_code'])
                        ->where('classroom_id', $detailClassroom['classroom_id'])
                        ->delete();
                    JoinClassroom::where('classroom_code', $classroom['class_code'])
                        ->where('student_code', $detailClassroom['student_code'])
                        ->delete();
                    $detailClassroom->delete();
                    return
                        $detailClassroom;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return $e;
        }
    }
    // Delete classroom

    public function destroy($id)
    {
        try {
            $teacher = Auth::user();
            $classroom = Classroom::query()
                ->where('teacher_code', $teacher['id'])
                ->find($id);
            if ($classroom !== null) {
                Attendance::where('classroom_id', $id)->delete();
                JoinClassroom::where('classroom_code', $classroom['class_code'])->delete();
                DetailClassroom::where('classroom_id', $id)->delete();
                $classroom->delete();
                return $classroom;
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return $e;
        }
    }

    public function exportClassroom($request, $id)
    {
        // $headings = [
        //     'STT', 'MSSV', 'Họ và tên lót', 'Tên', 'Mã l', 'Giá mua', 'Ngày mua', 'Mô tả', 'Người tạo'
        // ];

        // if ($request->has('allocation')) {
        //     $results = AssetModem::query()
        //         ->join('customer_modem', 'assets_modems.id', '=', 'customer_modem.asset_modem_id')
        //         ->select(

        //             'asset_code',
        //             'asset_name',
        //             'supplier',
        //             'warranty',
        //             'serial',
        //             'purchase_cost',
        //             'purchase_date',
        //             'asset_description',
        //             'assets_modems.user_created',
        //         )->get();
        // } else {
        //     $results = AssetModem::query()
        //         ->select(

        //             'asset_code',
        //             'asset_name',
        //             'supplier',
        //             'warranty',
        //             'serial',
        //             'purchase_cost',
        //             'purchase_date',
        //             'asset_description',
        //             'user_created',
        //         )->get();
        // }

        // return Excel::download(new AssetModemExport($results, $headings), 'DS TB.xlsx');
    }
}
