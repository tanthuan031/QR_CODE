<?php

namespace App\Http\Resources\Classrooms;

use Illuminate\Http\Resources\Json\JsonResource;

class ClassroomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [


            'student_code' => $this->student_code,
            "number_roll_call" => $this->number_roll_call,
            "number_lesson_week" => $this->number_lesson_week,
            "status" => $this->status,
            "created_at" => $this->created_at,
            "classrooms" => $this->classrooms->class_name

        ];
    }
}
