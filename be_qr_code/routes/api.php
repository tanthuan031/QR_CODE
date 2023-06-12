<?php

use App\Http\Controllers\Admin\AuthAdminController;
use App\Http\Controllers\Admin\ClassroomController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HistoryAskPermission;
use App\Http\Controllers\Admin\HistoryAskPermissionController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Client\AttendanceController;
use App\Http\Controllers\Client\AuthClientController;
use App\Http\Controllers\Client\ClassroomClientController;
use App\Http\Controllers\Client\HistoryAskPermissionClientController;
use App\Http\Controllers\Client\NotificationClientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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

Route::group(['as' => 'api.', 'middleware' => ['cors']], function () {
    Route::get('/calculate-distance', function () {
        $lat1 = request('lat1');
        $lon1 = request('lon1');
        $lat2 = request('lat2');
        $lon2 = request('lon2');
        $apiKey = env('API_KEY_GOOGLE_MAP');

        // $response = Http::get("https://maps.googleapis.com/maps/api/directions/json", [
        //     'origin' => "$lat1,$lon1",
        //     'destination' => "$lat2,$lon2",
        //     'key' => $apiKey,
        // ]);
        $response = Http::withOptions(['verify' => false])->get("https://maps.googleapis.com/maps/api/directions/json", [
            'origin' => "$lat1,$lon1",
            'destination' => "$lat2,$lon2",
            'key' => $apiKey,
        ]);
        return $response->json();
    });
});






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
    Route::resource('history-permission', HistoryAskPermissionController::class);
    Route::resource('notification', NotificationController::class);
    Route::resource('dashboard', DashboardController::class);
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
    Route::put('profile', [AuthClientController::class, 'updateUser']);

    Route::resource('classroom', ClassroomClientController::class);
    Route::resource('attendance', AttendanceController::class);
    Route::post('face_verify', [AttendanceController::class, 'verifyFace']);
    Route::resource('history-permission', HistoryAskPermissionClientController::class);
    Route::resource('notification', NotificationClientController::class);
});
