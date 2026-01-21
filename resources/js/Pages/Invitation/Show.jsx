import { Link } from "@inertiajs/react";
import AuthLayout from "@layouts/AuthLayout";
import { Mail } from "lucide-react";

export default function InvitationShow({ invitation }) {
  return (
    <AuthLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            You're Invited!
          </h2>
          <p className="text-gray-600">
            {invitation.inviter.name} has invited you to join
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {invitation.organization.name}
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {invitation.role.charAt(0).toUpperCase() +
                invitation.role.slice(1)}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Invited as:</dt>
                <dd className="font-medium text-gray-900">{invitation.role}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Invited by:</dt>
                <dd className="font-medium text-gray-900">
                  {invitation.inviter.name}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Email:</dt>
                <dd className="font-medium text-gray-900">
                  {invitation.email}
                </dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            <Link
              href={`/register?invite=${invitation.token}`}
              className="btn-primary w-full text-center"
            >
              Accept Invitation & Create Account
            </Link>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
