import { Fragment, useEffect, useState, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { router } from "@inertiajs/react";
import Button from "@/Components/UI/Button";
import Input from "@/Components/UI/Input";
import { useForm, Controller } from "react-hook-form";

const TaskModal = memo(function TaskModal({
  isOpen,
  onClose,
  project,
  board,
  task = null,
  users = [],
}) {
  const [processing, setProcessing] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "task",
      priority: "medium",
      status: "todo",
      assignee_id: "",
      project_id: project.id,
      board_id: board?.id || "",
    },
  });

  // Update form data when modal opens or task changes
  useEffect(() => {
    if (!isOpen) return; // Only run when modal is open

    if (task) {
      reset({
        title: task.title || "",
        description: task.description || "",
        type: task.type || "task",
        priority: task.priority || "medium",
        status: task.status || "todo",
        assignee_id: task.assignee_id || "",
        project_id: project.id,
        board_id: board?.id || "",
      });
    } else {
      reset({
        title: "",
        description: "",
        type: "task",
        priority: "medium",
        status: "todo",
        assignee_id: "",
        project_id: project.id,
        board_id: board?.id || "",
      });
    }
  }, [task?.id, isOpen]); // Only reset when task ID or modal open state changes

  const onSubmit = (data) => {
    setProcessing(true);
    setServerErrors({});

    const url = task ? route("tasks.update", task.id) : route("tasks.store");
    const method = task ? "put" : "post";

    router[method](url, data, {
      preserveScroll: true,
      onSuccess: () => {
        setProcessing(false);
        reset();
        onClose();
      },
      onError: (errors) => {
        setServerErrors(errors);
        setProcessing(false);
        console.error("Task errors:", errors);
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      router.delete(route("tasks.destroy", task.id), {
        preserveScroll: true,
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-6"
                >
                  {task ? "Edit Task" : "Create New Task"}
                </Dialog.Title>

                {(Object.keys(errors).length > 0 ||
                  Object.keys(serverErrors).length > 0) && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm font-medium text-red-800">
                      Please fix the following errors:
                    </p>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {Object.values({ ...errors, ...serverErrors }).map(
                        (error, index) => (
                          <li key={index}>{error?.message || error}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title *
                    </label>
                    <Controller
                      name="title"
                      control={control}
                      rules={{
                        required: "Title is required",
                        minLength: {
                          value: 3,
                          message: "Title must be at least 3 characters",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="title"
                          type="text"
                          placeholder="Enter task title"
                          error={errors.title?.message || serverErrors.title}
                        />
                      )}
                    />
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
                          placeholder="Describe the task..."
                        />
                      )}
                    />
                    {(errors.description || serverErrors.description) && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description?.message ||
                          serverErrors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Type *
                      </label>
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: "Type is required" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            id="type"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          >
                            <option value="story">Story</option>
                            <option value="task">Task</option>
                            <option value="bug">Bug</option>
                            <option value="epic">Epic</option>
                          </select>
                        )}
                      />
                      {(errors.type || serverErrors.type) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.type?.message || serverErrors.type}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="priority"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Priority *
                      </label>
                      <Controller
                        name="priority"
                        control={control}
                        rules={{ required: "Priority is required" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            id="priority"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        )}
                      />
                      {(errors.priority || serverErrors.priority) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.priority?.message || serverErrors.priority}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status *
                      </label>
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: "Status is required" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            id="status"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          >
                            <option value="backlog">Backlog</option>
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="in_review">In Review</option>
                            <option value="done">Done</option>
                          </select>
                        )}
                      />
                      {(errors.status || serverErrors.status) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.status?.message || serverErrors.status}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="assignee_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Assignee
                      </label>
                      <Controller
                        name="assignee_id"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            id="assignee_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          >
                            <option value="">Unassigned</option>
                            {users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {(errors.assignee_id || serverErrors.assignee_id) && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.assignee_id?.message ||
                            serverErrors.assignee_id}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    {task && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Delete Task
                      </button>
                    )}
                    <div className="flex gap-3 ml-auto">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={processing}>
                        {processing
                          ? "Saving..."
                          : task
                            ? "Update Task"
                            : "Create Task"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
});

export default TaskModal;
