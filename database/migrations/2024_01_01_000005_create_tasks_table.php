<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('board_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('board_column_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('assignee_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            $table->string('type')->default('task'); // story, task, bug, epic
            $table->string('status')->default('todo'); // backlog, todo, in_progress, in_review, done
            $table->string('priority')->default('medium'); // low, medium, high, critical
            $table->integer('estimate')->nullable(); // Story points or hours
            $table->integer('position')->default(0);
            $table->timestamp('due_date')->nullable();
            $table->timestamps();

            $table->index(['board_id', 'board_column_id', 'position']);
        });

        Schema::create('task_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('task_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('filename');
            $table->string('path');
            $table->string('mime_type');
            $table->integer('size');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_attachments');
        Schema::dropIfExists('task_comments');
        Schema::dropIfExists('tasks');
    }
};
