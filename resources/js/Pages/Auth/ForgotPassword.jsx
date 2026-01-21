import { Link, router } from "@inertiajs/react";
import AuthLayout from "@layouts/AuthLayout";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

export default function ForgotPassword({ status }) {
  const [processing, setProcessing] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    setProcessing(true);
    setServerErrors({});
    router.post("/forgot-password", data, {
      onError: (errors) => {
        setServerErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => setProcessing(false),
    });
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Forgot your password?
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        No problem. Just let us know your email address and we will email you a
        password reset link that will allow you to choose a new one.
      </p>

      {status && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{status}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                id="email"
                type="email"
                className="input"
                autoFocus
              />
            )}
          />
          {(errors.email || serverErrors.email) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email?.message || serverErrors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={processing}
          className="btn-primary w-full"
        >
          Email Password Reset Link
        </button>

        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
