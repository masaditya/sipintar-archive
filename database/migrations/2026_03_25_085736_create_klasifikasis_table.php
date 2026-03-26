<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('klasifikasi', function (Blueprint $table) {
            $table->id();
            $table->text('name')->nullable();
            $table->string('active_retention', 256)->nullable();
            $table->string('inactive_retention', 256)->nullable();
            $table->bigInteger('final_disposition')->nullable();
            $table->bigInteger('access_rights')->nullable();
            $table->bigInteger('security_classification')->nullable();
            $table->string('status', 255)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('klasifikasi');
    }
};
