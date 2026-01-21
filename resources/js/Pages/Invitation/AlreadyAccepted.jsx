import { Link } from "@inertiajs/react";
import AuthLayout from "@layouts/AuthLayout";
import { CheckCircle2 } from "lucide-react";

export default function InvitationAlreadyAccepted({ organization }) {
  return (
    <AuthLayout>
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Already Accepted
        </h2>

        <p className="text-gray-600 mb-6">
          This invitation to join <strong>{organization}</strong> has already
          been accepted.
        </p>

        <div className="space-x-4">
          <Link href="/login" className="btn-primary inline-flex">
            Sign In
          </Link>
          <Link href="/" className="btn-secondary inline-flex">
            Back to Home
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
