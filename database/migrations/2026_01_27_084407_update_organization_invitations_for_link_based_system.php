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
        Schema::table('organization_invitations', function (Blueprint $table) {
            // Remove accepted columns (links can be used multiple times)
            if (Schema::hasColumn('organization_invitations', 'accepted_at')) {
                $table->dropColumn('accepted_at');
            }
            if (Schema::hasColumn('organization_invitations', 'accepted_by')) {
                $table->dropColumn('accepted_by');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organization_invitations', function (Blueprint $table) {
            // Restore email column
            $table->string('email')->after('invited_by');
            
            // Remove new columns
            $table->dropColumn(['max_uses', 'uses_count']);
            
            // Restore expires_at as required
            $table->timestamp('expires_at')->nullable(false)->change();
            
            // Restore accepted columns
            $table->timestamp('accepted_at')->nullable()->after('expires_at');
            $table->foreignId('accepted_by')->nullable()->constrained('users')->onDelete('set null')->after('accepted_at');
        });
    }
};
