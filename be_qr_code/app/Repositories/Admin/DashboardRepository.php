<?php

namespace App\Repositories\Admin;

use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\DetailClassroom;
use App\Models\HistoryAskPermission;
use App\Models\JoinClassroom;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    protected $classroom;

    public function __construct(Classroom $classroom)
    {
        $this->classroom = $classroom;
    }

    public function getTotalDashboard($request)
    {
        $teacher = Auth::user();
        if ($teacher) {
            $totalClassroom = Classroom::query()
                ->select(DB::raw('count(*) as totalClassroom'))
                ->where('teacher_code', '=', $teacher->id)
                ->get();
            $totalPermission = HistoryAskPermission::query()
                ->select(DB::raw('count(*) as totalPermission'))
                ->where('teacher_id', '=', $teacher->id)
                ->get();
            $totalNotification = Notification::query()
                ->select(DB::raw('count(*) as totalNotification'))
                ->where('teacher_id', '=', $teacher->id)
                ->get();

            // Total Students
            $totalStudentInClassroom = DetailClassroom::join('classrooms', 'detail_classrooms.classroom_id', '=', 'classrooms.id')
                ->where('classrooms.teacher_code', $teacher->id)
                ->groupBy('detail_classrooms.classroom_id')
                ->select(DB::raw('COUNT(*) AS count'));

            $sum_count = DB::table(DB::raw("({$totalStudentInClassroom->toSql()}) as subquery"))
                ->select(DB::raw('SUM(subquery.count) as sum_count'))
                ->mergeBindings($totalStudentInClassroom->getQuery())
                ->first();
            $totalStudent = (int) $sum_count->sum_count;

            $data = [
                'data' => [
                    'totalClassroom' => $totalClassroom[0]->totalclassroom,
                    'totalPermission' =>  $totalPermission[0]->totalpermission,
                    'totalNotification' =>  $totalNotification[0]->totalnotification,
                    'totalStudent' =>  $totalStudent
                ],
                'message' => 'Get dashboard successfully',
                'status' => 200
            ];
        } else {
            $data = [
                'message' => 'Get dashboard unsuccessfully',
                'status' => 403
            ];
        }
        return $data;
    }

    // Tỉ lệ chuyên cần
    public function getAttendanceRatio($request)
    {
        $teacher = Auth::user();
        if ($teacher) {
            $queryClassroomDetail = DB::table(DB::raw("(
            SELECT dc.classroom_id,c.class_name, COUNT(*) AS countStudent, max_week
            FROM (
                SELECT a.classroom_id, MAX(a.week) AS max_week
                FROM classrooms c, attendances a
                WHERE c.teacher_code =  $teacher->id AND c.id = a.classroom_id
                GROUP BY c.class_code, a.classroom_id
            ) AS subquery
            JOIN classrooms c ON subquery.classroom_id = c.id
            JOIN detail_classrooms dc ON dc.classroom_id = c.id
            WHERE c.teacher_code = $teacher->id
            GROUP BY dc.classroom_id, max_week,c.class_name
        ) AS subquery2"))
                ->select('subquery2.classroom_id', 'subquery2.countstudent', 'subquery2.max_week', 'subquery2.class_name')
                ->get();

            $dt = [];
            foreach ($queryClassroomDetail as $result) {
                // dd($result);
                $queryAttendance = DB::table(DB::raw("(
                        SELECT a.week, COUNT(DISTINCT a.student_code) AS studentAttendance
                        FROM attendances a
                        WHERE a.classroom_id = $result->classroom_id AND a.status = '0'
                        GROUP BY a.week
                    ) AS subquery3"))
                    ->select(
                        'subquery3.week',
                        'subquery3.studentattendance',
                        DB::raw('(subquery3.studentattendance * 100) / ' . $result->countstudent . ' AS ratio')
                    )
                    ->get();
                // dd($queryAttendance);
                $classroomData = [
                    'classroom_id' => $result->classroom_id,
                    'classroom_name' => $result->class_name,
                    'data' => $queryAttendance->toArray(),
                    'countStudent' => $result->countstudent,
                    'max_week' => $result->max_week,
                ];
                // foreach ($queryAttendance as $attendance) {
                //     $attendance->classroom_id = $result->classroom_id;
                //     $attendance->countStudent = $result->countstudent;
                //     $attendance->max_week = $result->max_week;
                // }

                $dt[] = $classroomData;

                // Xử lý kết quả
                // ...
            }

            $data = [
                'data' => $dt,
                'message' => 'Get dashboard successfully',
                'status' => 200
            ];
        } else {
            $data = [
                'message' => 'Get dashboard unsuccessfully',
                'status' => 403
            ];
        }
        return $data;
    }
}
