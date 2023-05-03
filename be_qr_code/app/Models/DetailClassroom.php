<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DetailClassroom extends Model
{
    use HasFactory;


    protected $table = "detail_classrooms";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $fillable = [
        "student_code",
        "first_name",
        "last_name",
        "roll_coll",
        "score",
        "classroom_id"
    ];

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'student_code', 'student_code');
    }
}
