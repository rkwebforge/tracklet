<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Models\OrganizationInvitation;
use Domain\Organization\Models\OrganizationMember;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     * If invite_token is provided, automatically add user to organization.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'invite_token' => ['nullable', 'string'],
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);

        // Handle invitation if token is provided
        if (isset($input['invite_token'])) {
            $this->acceptInvitation($user, $input['invite_token']);
        }

        return $user;
    }

    /**
     * Accept organization invitation and add user as member
     */
    protected function acceptInvitation(User $user, string $token): void
    {
        $invitation = OrganizationInvitation::where('token', $token)
            ->where('email', $user->email)
            ->first();

        if ($invitation && $invitation->isValid()) {
            // Add user to organization with assigned role
            OrganizationMember::create([
                'organization_id' => $invitation->organization_id,
                'user_id' => $user->id,
                'role' => $invitation->role,
            ]);

            // Mark invitation as accepted
            $invitation->markAsAccepted($user);
        }
    }
}
