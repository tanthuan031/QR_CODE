<?php

namespace App\Http\Resources\History;

use Illuminate\Http\Resources\Json\JsonResource;

class HistoryAskPermissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request): array
    {
        return [
            "id" => $this->id,
            "class_code" => $this->class_code,
            'teacher_id' => $this->teacher_id,
            'student_code' => $this->student_code,
            "number_roll_call" => $this->number_roll_call,
            "number_lesson_week" => $this->number_lesson_week,
            "status" => $this->status,
            "created_at" => $this->created_at,
            "classrooms" => $this->classrooms->class_name

        ];
    }
}
