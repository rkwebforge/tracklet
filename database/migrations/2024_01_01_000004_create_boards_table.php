<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('type')->default('kanban'); // kanban, scrum
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('board_columns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('color')->default('#3b82f6');
            $table->integer('position')->default(0);
            $table->integer('wip_limit')->nullable(); // Work In Progress limit
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('board_columns');
        Schema::dropIfExists('boards');
    }
};
