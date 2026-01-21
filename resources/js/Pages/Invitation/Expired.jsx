import { Link } from "@inertiajs/react";
import AuthLayout from "@layouts/AuthLayout";
import { AlertCircle } from "lucide-react";

export default function InvitationExpired({ organization }) {
  return (
    <AuthLayout>
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Invitation Expired
        </h2>

        <p className="text-gray-600 mb-6">
          This invitation to join <strong>{organization}</strong> has expired.
          Please contact the organization admin to send you a new invitation.
        </p>

        <Link href="/" className="btn-primary inline-flex">
          Back to Home
        </Link>
      </div>
    </AuthLayout>
  );
}
