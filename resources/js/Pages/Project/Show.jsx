import { useState } from 'react';
import AppLayout from '@layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import TaskModal from '@/Components/Task/TaskModal';
import { ChevronLeft, CheckSquare, Bug, Target, BookOpen } from 'lucide-react';

export default function ProjectShow({ project, board, users = [], can = {} }) {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    
    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-blue-100 text-blue-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800',
        };
        return colors[priority] || colors.medium;
    };

    const getTypeIcon = (type) => {
        const icons = {
            story: BookOpen,
            task: CheckSquare,
            bug: Bug,
            epic: Target,
        };
        return icons[type] || CheckSquare;
    };

    const handleDeleteProject = () => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            router.delete(`/projects/${project.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title={project?.name || 'Project'} />

            <div className="space-y-6">
                {/* Project Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/projects" className="text-gray-500 hover:text-gray-700">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-bold bg-primary-100 text-primary-600 rounded">
                                    {project?.key}
                                </span>
                                <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
                            </div>
                            {project?.description && (
                                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {can.update && (
                            <Link 
                                href={`/projects/${project.id}/edit`}
                                className="btn-secondary"
                            >
                                Edit Project
                            </Link>
                        )}
                        
                        {can.createTask && (
                            <button 
                                onClick={() => {
                                    setSelectedTask(null);
                                    setIsTaskModalOpen(true);
                                }}
                                className="btn-primary"
                            >
                                Create Task
                            </button>
                        )}

                        {can.delete && (
                            <button 
                                onClick={handleDeleteProject}
                                className="btn-danger"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {board?.name || 'Board'}
                    </h2>
                    
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {board?.columns?.map((column) => (
                            <div key={column.id} className="flex-shrink-0 w-80">
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-3 pb-2 border-b-2" style={{ borderColor: column.color }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }}></div>
                                        <h3 className="font-semibold text-gray-900">{column.name}</h3>
                                        <span className="text-sm text-gray-500">
                                            {Object.values(column.tasks || {}).length}
                                        </span>
                                    </div>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-3">
                                    {Object.values(column.tasks || {}).length > 0 ? (
                                        Object.values(column.tasks).map((task) => (
                                            <div
                                                key={task.id}
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setIsTaskModalOpen(true);
                                                }}
                                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <div className="flex items-start gap-2 mb-2">
                                                    <span className="text-lg">{getTypeIcon(task.type)}</span>
                                                    <h4 className="font-medium text-gray-900 text-sm flex-1">
                                                        {task.title}
                                                    </h4>
                                                </div>

                                                {task.description && (
                                                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                                                        {task.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>

                                                    {task.assignee && (
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                                                <span className="text-xs font-medium text-primary-600">
                                                                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {task.due_date && (
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        Due: {new Date(task.due_date).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 text-sm">
                                            No tasks
                                        </div>
                                    )}
                                </div>

                                {/* Add Task Button */}
                                {can.createTask && (
                                    <button 
                                        onClick={() => {
                                            setSelectedTask(null);
                                            setIsTaskModalOpen(true);
                                        }}
                                        className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        + Add task
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {can.createTask && (
                    <TaskModal
                        isOpen={isTaskModalOpen}
                        onClose={() => setIsTaskModalOpen(false)}
                        project={project}
                        board={board}
                        task={selectedTask}
                    />
                )}
            </div>
        </AppLayout>
    );
}
