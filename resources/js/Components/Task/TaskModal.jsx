import { Fragment, useEffect, useState, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { router } from "@inertiajs/react";
import Button from "@/Components/UI/Button";
import { useForm, Controller } from "react-hook-form";
import CustomTextInput from "@/Components/UI/custom-text-input";
import CustomTextAreaAutoResize from "@/Components/UI/textarea-resizable";
import CustomSelectInput from "@/Components/UI/custom-select";

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
                      <CustomTextInput
                        {...field}
                        label="Title *"
                        inputId="title"
                        placeholder="Enter task title"
                        errorMessage={
                          errors.title?.message || serverErrors.title
                        }
                      />
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <CustomTextAreaAutoResize
                        {...field}
                        label="Description"
                        inputId="description"
                        placeholder="Describe the task..."
                        minRows={4}
                        maxRows={8}
                        errorMessage={
                          errors.description?.message ||
                          serverErrors.description
                        }
                      />
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: "Type is required" }}
                      render={({ field }) => (
                        <CustomSelectInput
                          label="Type *"
                          options={[
                            { id: "story", name: "Story" },
                            { id: "task", name: "Task" },
                            { id: "bug", name: "Bug" },
                            { id: "epic", name: "Epic" },
                          ]}
                          value={{
                            id: field.value,
                            name:
                              field.value.charAt(0).toUpperCase() +
                              field.value.slice(1),
                          }}
                          onChange={(option) => field.onChange(option.id)}
                          placeholder="Select type"
                          errorMessage={
                            errors.type?.message || serverErrors.type
                          }
                          translateOptions={false}
                        />
                      )}
                    />

                    <Controller
                      name="priority"
                      control={control}
                      rules={{ required: "Priority is required" }}
                      render={({ field }) => (
                        <CustomSelectInput
                          label="Priority *"
                          options={[
                            { id: "low", name: "Low" },
                            { id: "medium", name: "Medium" },
                            { id: "high", name: "High" },
                            { id: "critical", name: "Critical" },
                          ]}
                          value={{
                            id: field.value,
                            name:
                              field.value.charAt(0).toUpperCase() +
                              field.value.slice(1),
                          }}
                          onChange={(option) => field.onChange(option.id)}
                          placeholder="Select priority"
                          errorMessage={
                            errors.priority?.message || serverErrors.priority
                          }
                          translateOptions={false}
                        />
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="status"
                      control={control}
                      rules={{ required: "Status is required" }}
                      render={({ field }) => {
                        const statusLabels = {
                          backlog: "Backlog",
                          todo: "To Do",
                          in_progress: "In Progress",
                          in_review: "In Review",
                          done: "Done",
                        };
                        return (
                          <CustomSelectInput
                            label="Status *"
                            options={[
                              { id: "backlog", name: "Backlog" },
                              { id: "todo", name: "To Do" },
                              { id: "in_progress", name: "In Progress" },
                              { id: "in_review", name: "In Review" },
                              { id: "done", name: "Done" },
                            ]}
                            value={{
                              id: field.value,
                              name: statusLabels[field.value] || field.value,
                            }}
                            onChange={(option) => field.onChange(option.id)}
                            placeholder="Select status"
                            errorMessage={
                              errors.status?.message || serverErrors.status
                            }
                            translateOptions={false}
                          />
                        );
                      }}
                    />

                    <Controller
                      name="assignee_id"
                      control={control}
                      render={({ field }) => {
                        const assigneeOptions = [
                          { id: "", name: "Unassigned" },
                          ...users.map((user) => ({
                            id: user.id,
                            name: user.name,
                          })),
                        ];
                        const selectedUser =
                          assigneeOptions.find(
                            (opt) => opt.id === field.value,
                          ) || assigneeOptions[0];
                        return (
                          <CustomSelectInput
                            label="Assignee"
                            options={assigneeOptions}
                            value={selectedUser}
                            onChange={(option) => field.onChange(option.id)}
                            placeholder="Select assignee"
                            errorMessage={
                              errors.assignee_id?.message ||
                              serverErrors.assignee_id
                            }
                            translateOptions={false}
                          />
                        );
                      }}
                    />
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
