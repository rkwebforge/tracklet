import AppLayout from "@layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import Card from "@components/UI/Card";
import { ClipboardList, Users, FileText } from "lucide-react";
import { memo } from "react";

const ProjectIndex = memo(function ProjectIndex({ projects }) {
  return (
    <AppLayout>
      <Head title="Projects" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your projects and track progress
            </p>
          </div>
          <Link href="/projects/create" className="btn-primary">
            Create Project
          </Link>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-sm">
                          {project.key}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500">{project.key}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {project.description && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ClipboardList className="w-4 h-4" />
                      <span>{project.tasks_count} tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{project.members_count} members</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No projects
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new project.
            </p>
            <div className="mt-6">
              <Link href="/projects/create" className="btn-primary">
                Create Project
              </Link>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
});

export default ProjectIndex;
