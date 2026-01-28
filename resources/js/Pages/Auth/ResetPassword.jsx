import { router } from "@inertiajs/react";
import AuthLayout from "@layouts/AuthLayout";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import CustomTextInput from "@/Components/UI/custom-text-input";
import CustomPasswordInput from "@/Components/UI/custom-password-input";

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
              label="New Password"
              inputId="password"
              placeholder="Enter new password"
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
              placeholder="Confirm new password"
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
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
}
