import { router } from "@inertiajs/react";
import AuthLayout from "@layouts/AuthLayout";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

export default function ResetPassword({ token, email }) {
  const [processing, setProcessing] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      token: token,
      email: email || "",
      password: "",
      password_confirmation: "",
    },
  });

  const password = watch("password");

  const onSubmit = (data) => {
    setProcessing(true);
    setServerErrors({});
    router.post("/reset-password", data, {
      onError: (errors) => {
        setServerErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => setProcessing(false),
    });
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Reset your password
      </h2>

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

        <div>
          <label htmlFor="password" className="label">
            New Password
          </label>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                id="password"
                type="password"
                className="input"
              />
            )}
          />
          {(errors.password || serverErrors.password) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password?.message || serverErrors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password_confirmation" className="label">
            Confirm Password
          </label>
          <Controller
            name="password_confirmation"
            control={control}
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <input
                {...field}
                id="password_confirmation"
                type="password"
                className="input"
              />
            )}
          />
          {(errors.password_confirmation ||
            serverErrors.password_confirmation) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password_confirmation?.message ||
                serverErrors.password_confirmation}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={processing}
          className="btn-primary w-full"
        >
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
}
