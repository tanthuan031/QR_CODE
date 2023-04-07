<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory;
//    use SoftDeletes;
    protected $table='teachers';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable=[
        "teacher_code",
        "last_name",
        "first_name",
        "email",

    ];
    protected $hidden = [
        'password',

    ];
}
