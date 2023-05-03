<?php

use App\Http\Controllers\Admin\AuthAdminController;
use App\Http\Controllers\Admin\ClassroomController;
use App\Http\Controllers\Client\AttendanceController;
use App\Http\Controllers\Client\AuthClientController;
use App\Http\Controllers\Client\ClassroomClientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});
// Admin routes
Route::post('admin/login', [AuthAdminController::class, 'login']);
Route::post('admin/register', [AuthAdminController::class, 'register']);
Route::group([
    'prefix' => 'admin',
    'middleware' => ['auth:sanctum'],
], function () {
    Route::get('getme', [AuthAdminController::class, 'getMeAdmin']);
    Route::post('logout', [AuthAdminController::class, 'logoutAdmin']);
    Route::resource('classroom', ClassroomController::class);
});

// Client routes
Route::post('client/login', [AuthClientController::class, 'login']);
Route::post('client/register', [AuthClientController::class, 'register']);

Route::group([
    'prefix' => 'client',
    'middleware' => ['auth:sanctum'],
], function () {
    Route::get('getme', [AuthClientController::class, 'getMeClient']);
    Route::post('logout', [AuthClientController::class, 'logoutClient']);
    Route::resource('classroom', ClassroomClientController::class);
    Route::resource('attendance', AttendanceController::class);
});
