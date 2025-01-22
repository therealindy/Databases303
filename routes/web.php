<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// หน้าที่คือการเรียกใช้ข้อมูลจาก EmployeeController

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// สร้าง middleware ให้ products เพื่อให้ไปเช็คว่าเข้าสู่ระบบแล้วหรือยัง ถ้าเข้าสู่ระบบแล้วจะสามารถดูได้ ถ้าไม่จะนำไปสู่หน้ารายการไม่ได้
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/employee', [EmployeeController::class, 'index'])->name('employee.index');
    Route::get('/employee/create', [EmployeeController::class, 'create'])->name('employee.create'); // เส้นทางเพื่อแสดงฟอร์มสำหรับเพิ่มข้อมูลพนักงาน จะไปแสดงในหน้า employee
    Route::post('/employee', [EmployeeController::class, 'store'])->name('employee.store'); // เส้นทางเพื่อบันทึกข้อมูลพนักงาน โดยจะไปแสดงในหน้า employee
});

require __DIR__.'/auth.php';
