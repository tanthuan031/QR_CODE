<?php

namespace App\Repositories\Client;

use App\Models\Classroom;
use App\Models\DetailClassroom;
use App\Models\JoinClassroom;
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
            $studentCode="1925535440";
            $data = Classroom::whereExists(function ($query) use ($studentCode) {
                $query->select(DB::raw(1))
                    ->from('join_classrooms')
                    ->whereColumn('classrooms.class_code', '=', 'join_classrooms.classroom_code')
                    ->where('student_code', $studentCode);
            })
                ->with('teachers')->paginate($this->paginate);

            return $data;
        }catch (\Exception $e){
            dd($e);
        }

    }

    public function createJoinClassroom($request){
        try {
            $checkJoin=JoinClassroom::query()->where('student_code','=',$request['student_code'])
                ->where('classroom_code','=',$request['classroom_code'])->first();

            if($checkJoin===null){
                $checkClassroom=Classroom::query()->where('class_code','=',$request['classroom_code'])->first();

                if($checkClassroom!==null){
                    $result=JoinClassroom::query()->create($request);
                    $data=[
                        'status'=>'success',
                        'message'=>"Create join classroom successfully",
                        'data'=>$result
                    ];

                }else{
                    $data=[
                        'status'=>401,
                        'message'=>"Class code not available",

                    ];
                }

            }else{
                $data=[
                    'status'=>401,
                    'message'=>"Your join classroom available",

                ];
            }


        }catch (\Exception $e){
            $data=[
                'status'=>401,
                'message'=>"Create join classroom unsuccessfully",

            ];
        }
        return $data;

    }

    public function showStudentClassroom($idClassroom){
        $student_code='3119410026';
        try {
            $result=DetailClassroom::query()->where('classroom_id','=',$idClassroom)->where('student_code','=',$student_code)->first();
//            dd($result);
            if($result){
//                dd("bb");
                $data=[
                    'message'=>'Get student successfully',
                    'status'=>'success',
                    'data'=>$result
                ];
            }else{
//                dd("aa");
                $data=[
                    'message'=>'Get student unsuccessfully',
                    'status'=>'fail',

                ];
            }
            return $data;
        }catch (\Exception $e){
            return false;

        }

    }

    public function studentAttendance($request,$id){
        try {
//            dd($request['roll']['attendance_week']);
            $student_code='3119410026';
            $listAttendance=DetailClassroom::query()->where('student_code','=',$student_code)
                ->where('classroom_id','=',$request['id_classroom'])->first();

            $data=json_decode($listAttendance['roll_coll']);
//            dd($data);
           foreach( $data as  $item) {
                dd($item[$item]);
                if ($item[$i][0] == '1' && $item[$i][1] == '1') {
                    $item[$i][2] = false;
                }

            };
            dd($attendanceArray);
//            dd($data);
//            foreach ($data as $item){
//                if($item->attendance_week==$request['roll']['attendance_week'] &&
//                    $item->attendance_lesson==$request['roll']['attendance_lesson']){
//                    dd("aa");
//                }else{
//                    dd("bb");
//                }
//            }

//            dd(json_decode(json_encode($request['roll'])));
//           $data= $listAttendance->update(['roll_coll'=>json_encode($request['roll'])]);
//                dd($listAttendance['roll_coll']);
        }catch (\Exception $e){
            $data=[
                'status'=>401,
                'message'=>"Create join classroom unsuccessfully",

            ];
        }
        return $data;

    }

}
