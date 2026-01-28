import { Link, router } from "@inertiajs/react";
import AuthLayout from "@layouts/AuthLayout";
import { useState } from "react";
import { PartyPopper } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import CustomTextInput from "@/Components/UI/custom-text-input";
import CustomPasswordInput from "@/Components/UI/custom-password-input";

export default function Register() {
  // Get invite token from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const inviteToken = urlParams.get("invite");

  const [processing, setProcessing] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      invite_token: inviteToken || "",
    },
  });

  const password = watch("password");

  const onSubmit = (data) => {
    setProcessing(true);
    setServerErrors({});
    router.post("/register", data, {
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
        Create your account
      </h2>

      {inviteToken && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <PartyPopper className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              You've been invited to join an organization! Complete your
              registration to get started.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="name"
          control={control}
          rules={{
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          }}
          render={({ field }) => (
            <CustomTextInput
              {...field}
              label="Full Name"
              inputId="name"
              placeholder="Enter your full name"
              errorMessage={errors.name?.message || serverErrors.name}
            />
          )}
        />

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
            <CustomTextInput
              {...field}
              label="Email address"
              inputId="email"
              placeholder="Enter your email"
              errorMessage={errors.email?.message || serverErrors.email}
            />
          )}
        />

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
            <CustomPasswordInput
              {...field}
              label="Password"
              inputId="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              errorMessage={errors.password?.message || serverErrors.password}
            />
          )}
        />

        <Controller
          name="password_confirmation"
          control={control}
          rules={{
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          }}
          render={({ field }) => (
            <CustomPasswordInput
              {...field}
              label="Confirm Password"
              inputId="password_confirmation"
              placeholder="Confirm your password"
              autoComplete="new-password"
              errorMessage={
                errors.password_confirmation?.message ||
                serverErrors.password_confirmation
              }
            />
          )}
        />

        <button
          type="submit"
          disabled={processing}
          className="btn-primary w-full"
        >
          Create Account
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
