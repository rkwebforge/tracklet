import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Button from "@/Components/UI/Button";
import Input from "@/Components/UI/Input";
import { useForm, Controller } from "react-hook-form";

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
            <div>
              <label
                htmlFor="organization_id"
                className="block text-sm font-medium text-gray-700"
              >
                Organization *
              </label>
              <Controller
                name="organization_id"
                control={control}
                rules={{ required: "Organization is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="organization_id"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select an organization</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {(errors.organization_id || serverErrors.organization_id) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.organization_id?.message ||
                    serverErrors.organization_id}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Project Name *
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
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="e.g., Website Redesign"
                    error={errors.name?.message || serverErrors.name}
                  />
                )}
              />
            </div>

            <div>
              <label
                htmlFor="key"
                className="block text-sm font-medium text-gray-700"
              >
                Project Key *
              </label>
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
                  <Input
                    {...field}
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    id="key"
                    type="text"
                    placeholder="e.g., WEB"
                    maxLength={10}
                    error={errors.key?.message || serverErrors.key}
                  />
                )}
              />
              <p className="mt-1 text-sm text-gray-500">
                Short identifier for the project (2-10 characters)
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="description"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Brief description of the project..."
                  />
                )}
              />
              {(errors.description || serverErrors.description) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description?.message || serverErrors.description}
                </p>
              )}
            </div>

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
