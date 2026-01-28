import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Button from "@/Components/UI/Button";
import { useForm, Controller } from "react-hook-form";
import CustomSelectInput from "@/Components/UI/custom-select";
import CustomTextInput from "@/Components/UI/custom-text-input";
import CustomTextAreaAutoResize from "@/Components/UI/textarea-resizable";

export default function Create({ organizations }) {
  const [processing, setProcessing] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      key: "",
      description: "",
      organization_id: organizations[0]?.id || "",
    },
  });

  const onSubmit = (data) => {
    setProcessing(true);
    setServerErrors({});
    router.post(route("projects.store"), data, {
      onError: (errors) => {
        setServerErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => setProcessing(false),
    });
  };

  return (
    <AppLayout>
      <Head title="Create Project" />

      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={route("projects.index")}
            className="text-primary-600 hover:text-primary-700"
          >
            ← Back to Projects
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Project
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="organization_id"
              control={control}
              rules={{ required: "Organization is required" }}
              render={({ field }) => (
                <CustomSelectInput
                  label="Organization *"
                  options={organizations.map((org) => ({
                    id: org.id,
                    name: org.name,
                  }))}
                  value={
                    organizations.find((org) => org.id === field.value)
                      ? {
                          id: field.value,
                          name: organizations.find(
                            (org) => org.id === field.value,
                          ).name,
                        }
                      : null
                  }
                  onChange={(option) => field.onChange(option.id)}
                  placeholder="Select an organization"
                  errorMessage={
                    errors.organization_id?.message ||
                    serverErrors.organization_id
                  }
                  translateOptions={false}
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              rules={{
                required: "Project name is required",
                minLength: {
                  value: 2,
                  message: "Project name must be at least 2 characters",
                },
              }}
              render={({ field }) => (
                <CustomTextInput
                  {...field}
                  label="Project Name *"
                  inputId="name"
                  placeholder="e.g., Website Redesign"
                  errorMessage={errors.name?.message || serverErrors.name}
                />
              )}
            />

            <div>
              <Controller
                name="key"
                control={control}
                rules={{
                  required: "Project key is required",
                  minLength: {
                    value: 2,
                    message: "Project key must be at least 2 characters",
                  },
                  maxLength: {
                    value: 10,
                    message: "Project key must not exceed 10 characters",
                  },
                  pattern: {
                    value: /^[A-Z0-9]+$/,
                    message:
                      "Project key must contain only uppercase letters and numbers",
                  },
                }}
                render={({ field: { onChange, ...field } }) => (
                  <CustomTextInput
                    {...field}
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    label="Project Key *"
                    inputId="key"
                    placeholder="e.g., WEB"
                    errorMessage={errors.key?.message || serverErrors.key}
                  />
                )}
              />
              <p className="mt-1 text-sm text-gray-500">
                Short identifier for the project (2-10 characters)
              </p>
            </div>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <CustomTextAreaAutoResize
                  {...field}
                  label="Description"
                  inputId="description"
                  placeholder="Brief description of the project..."
                  minRows={4}
                  maxRows={8}
                  errorMessage={
                    errors.description?.message || serverErrors.description
                  }
                />
              )}
            />

            <div className="flex justify-end gap-3">
              <Link href={route("projects.index")}>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={processing}>
                {processing ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
