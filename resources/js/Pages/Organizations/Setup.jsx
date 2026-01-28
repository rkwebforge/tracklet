import { router } from "@inertiajs/react";
import AuthLayout from "@layouts/AuthLayout";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import CustomTextInput from "@/Components/UI/custom-text-input";
import CustomTextAreaAutoResize from "@/Components/UI/textarea-resizable";

export default function Setup() {
  const [processing, setProcessing] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data) => {
    // Prevent double submission
    if (processing) {
      return;
    }

    setProcessing(true);
    setServerErrors({});

    router.post("/setup", data, {
      preserveScroll: true,
      onError: (errors) => {
        setServerErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => {
        // Don't set processing to false here, let redirect happen
      },
      onFinish: () => {
        // Request finished
      },
    });
  };

  return (
    <AuthLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Tracklet!
          </h2>
          <p className="text-gray-600">
            Let's create your first organization to get started
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200"
        >
          {/* Display all server errors */}
          {Object.keys(serverErrors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-900 mb-2">
                Please fix the following errors:
              </h3>
              <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                {Object.entries(serverErrors).map(([field, message]) => (
                  <li key={field}>
                    <strong>{field}:</strong>{" "}
                    {Array.isArray(message) ? message[0] : message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Organization name is required",
                minLength: {
                  value: 2,
                  message: "Organization name must be at least 2 characters",
                },
              }}
              render={({ field }) => (
                <CustomTextInput
                  {...field}
                  label="Organization Name *"
                  inputId="name"
                  placeholder="e.g., Acme Corporation"
                  errorMessage={errors.name?.message || serverErrors.name}
                />
              )}
            />
            <p className="mt-1 text-sm text-gray-500">
              This will be the name of your workspace
            </p>
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <CustomTextAreaAutoResize
                {...field}
                label="Description (Optional)"
                inputId="description"
                placeholder="What does your organization do?"
                minRows={4}
                maxRows={8}
                errorMessage={
                  errors.description?.message || serverErrors.description
                }
              />
            )}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ You'll be the organization owner</li>
              <li>✓ You can create projects and boards</li>
              <li>✓ You can invite team members</li>
              <li>✓ You'll have full admin access</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="btn-primary w-full"
          >
            {processing ? "Creating..." : "Create Organization"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
