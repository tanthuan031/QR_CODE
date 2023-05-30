<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class HistoryAskPermission extends Model
{
    use HasFactory;
    protected $table = "history_ask_permissions";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $fillable = [
        "class_code",
        "teacher_id",
        "student_code",
        "number_roll_call",
        "number_lesson_week",
        "reason",
        "status"
    ];

    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class, 'class_code', 'class_code');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'student_code', 'student_code');
    }

    public function scopeSearch($query, $request)
    {
        return $query
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->query('search');
                $query
                    ->where("class_code", "LIKE", "%{$search}%")
                    ->orWhere("student_code", "LIKE", "%{$search}%");
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
