<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JoinClassroom extends Model
{
    use HasFactory;

    protected $table ="join_classrooms";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $fillable=[
        "student_code",
        "classroom_code",
    ];

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class,'student_code');

    }
    public function classroom():BelongsTo
    {
        return $this->belongsTo(Classroom::class,'classroom_code');
    }



}
