<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Classroom extends Model
{
    use HasFactory;
    // use SoftDeletes;

    protected $table = "classrooms";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $fillable = [
        "class_name",
        "number_roll_call",
        "number_lesson_week",
        "teacher_code",
        "class_code"
    ];

    public function teachers(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_code');
    }

    public function joinClassrooms(): HasMany
    {
        return $this->hasMany(JoinClassroom::class, 'classroom_code', 'class_code');
    }

    public function scopeSearch($query, $request)
    {
        return $query
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->query('search');
                $query
                    ->where("class_code", "LIKE", "%{$search}%");
            });
    }
    public function scopeSort($query, $request)
    {

        return $query
            ->when($request->has("sort"), function ($query) use ($request) {
                $sortBy = '';
                $sortValue = '';

                foreach ($request->query("sort") as $key => $value) {
                    $sortBy = $key;
                    $sortValue = $value;
                }

                $query->orderBy($sortBy, $sortValue);
            });
    }
}
