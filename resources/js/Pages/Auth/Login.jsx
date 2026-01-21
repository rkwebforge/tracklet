import { Link, router } from "@inertiajs/react";
import AuthLayout from "@layouts/AuthLayout";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

export default function Login() {
  const [processing, setProcessing] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data) => {
    setProcessing(true);
    setServerErrors({});
    router.post("/login", data, {
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
        Sign in to your account
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
            Password
          </label>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Controller
              name="remember"
              control={control}
              render={({ field: { value, onChange } }) => (
                <input
                  id="remember"
                  type="checkbox"
                  checked={value}
                  onChange={onChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              )}
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="btn-primary w-full"
        >
          Sign in
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Create one
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
