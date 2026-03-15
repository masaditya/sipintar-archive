<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuratKeluarController;
use Laravel\Fortify\Features;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [SuratKeluarController::class, 'dashboard'])->name('dashboard');
    Route::get('surat/create/{kategori}', [SuratKeluarController::class, 'create'])->name('sipintar.create');
    Route::post('surat', [SuratKeluarController::class, 'store'])->name('sipintar.store');
    Route::get('surat/{id}/edit', [SuratKeluarController::class, 'edit'])->name('sipintar.edit');
    Route::patch('surat/{id}', [SuratKeluarController::class, 'update'])->name('sipintar.update');
    Route::delete('surat/{id}', [SuratKeluarController::class, 'destroy'])->name('sipintar.destroy');
    Route::get('surat/agenda/{kategori?}', [SuratKeluarController::class, 'agenda'])->name('sipintar.agenda');
});

require __DIR__.'/settings.php';
