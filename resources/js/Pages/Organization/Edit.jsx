import { Link, router } from "@inertiajs/react";
import AppLayout from "@layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

export default function EditOrganization({ organization }) {
  const [processing, setProcessing] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: organization.name || "",
      slug: organization.slug || "",
      description: organization.description || "",
    },
  });

  const onSubmit = (data) => {
    setProcessing(true);
    setServerErrors({});
    router.put(`/organizations/${organization.id}`, data, {
      onError: (errors) => {
        setServerErrors(errors);
        setProcessing(false);
      },
      onSuccess: () => setProcessing(false),
    });
  };

  return (
    <AppLayout>
      <Head title={`Edit ${organization.name}`} />

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/organizations/${organization.id}`}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Organization
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Organization
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="label">
                Organization Name
              </label>
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
              <label htmlFor="slug" className="label">
                Organization Slug
              </label>
              <Controller
                name="slug"
                control={control}
                rules={{
                  required: "Slug is required",
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message:
                      "Slug can only contain lowercase letters, numbers, and hyphens",
                  },
                }}
                render={({ field }) => (
                  <input {...field} id="slug" type="text" className="input" />
                )}
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be used in URLs. Only lowercase letters, numbers, and
                hyphens allowed.
              </p>
              {(errors.slug || serverErrors.slug) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.slug?.message || serverErrors.slug}
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
                  />
                )}
              />
              {(errors.description || serverErrors.description) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description?.message || serverErrors.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Link
                href={`/organizations/${organization.id}`}
                className="btn-secondary"
              >
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
