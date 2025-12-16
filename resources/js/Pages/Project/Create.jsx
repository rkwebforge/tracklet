import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';

export default function Create({ organizations }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        key: '',
        description: '',
        organization_id: organizations[0]?.id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Project" />

            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href={route('projects.index')} className="text-primary-600 hover:text-primary-700">
                        ← Back to Projects
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h1>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="organization_id" className="block text-sm font-medium text-gray-700">
                                Organization *
                            </label>
                            <select
                                id="organization_id"
                                value={data.organization_id}
                                onChange={e => setData('organization_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                required
                            >
                                <option value="">Select an organization</option>
                                {organizations.map(org => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                            {errors.organization_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.organization_id}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Project Name *
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g., Website Redesign"
                                error={errors.name}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="key" className="block text-sm font-medium text-gray-700">
                                Project Key *
                            </label>
                            <Input
                                id="key"
                                type="text"
                                value={data.key}
                                onChange={e => setData('key', e.target.value.toUpperCase())}
                                placeholder="e.g., WEB"
                                maxLength={10}
                                error={errors.key}
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Short identifier for the project (2-10 characters)
                            </p>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Brief description of the project..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link href={route('projects.index')}>
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Project'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
