import { Link, router } from "@inertiajs/react";
import AppLayout from "@layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

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
            <div>
              <label htmlFor="name" className="label">
                Project Name
              </label>
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
                  <input
                    {...field}
                    id="name"
                    type="text"
                    className="input"
                    autoFocus
                  />
                )}
              />
              {(errors.name || serverErrors.name) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name?.message || serverErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="label">
                Description (Optional)
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="description"
                    className="input"
                    rows="4"
                    placeholder="Describe your project..."
                  />
                )}
              />
              {(errors.description || serverErrors.description) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description?.message || serverErrors.description}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="label">
                Status
              </label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <select {...field} id="status" className="input">
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                )}
              />
              {(errors.status || serverErrors.status) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.status?.message || serverErrors.status}
                </p>
              )}
            </div>

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
