import { Link, router } from "@inertiajs/react";
import AppLayout from "@layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import CustomTextInput from "@/Components/UI/custom-text-input";
import CustomTextAreaAutoResize from "@/Components/UI/textarea-resizable";
import CustomSelectInput from "@/Components/UI/custom-select";

export default function EditProject({ project }) {
  const [processing, setProcessing] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: project.name || "",
      description: project.description || "",
      status: project.status || "active",
    },
  });

  const onSubmit = (data) => {
    setProcessing(true);
    setServerErrors({});
    router.put(`/projects/${project.id}`, data, {
      onError: (errors) => {
        setServerErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => setProcessing(false),
    });
  };

  return (
    <AppLayout>
      <Head title={`Edit ${project.name}`} />

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/projects/${project.id}`}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Project
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Project
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  label="Project Name"
                  inputId="name"
                  placeholder="Enter project name"
                  errorMessage={errors.name?.message || serverErrors.name}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <CustomTextAreaAutoResize
                  {...field}
                  label="Description (Optional)"
                  inputId="description"
                  placeholder="Describe your project..."
                  minRows={4}
                  maxRows={8}
                  errorMessage={
                    errors.description?.message || serverErrors.description
                  }
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <CustomSelectInput
                  label="Status"
                  options={[
                    { id: "active", name: "Active" },
                    { id: "archived", name: "Archived" },
                  ]}
                  value={{
                    id: field.value,
                    name: field.value === "active" ? "Active" : "Archived",
                  }}
                  onChange={(option) => field.onChange(option.id)}
                  placeholder="Select status"
                  errorMessage={errors.status?.message || serverErrors.status}
                  translateOptions={false}
                />
              )}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Link href={`/projects/${project.id}`} className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
