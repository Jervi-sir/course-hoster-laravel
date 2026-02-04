import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Upload } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Instructor', href: '/instructor/courses' },
    { title: 'Courses', href: '/instructor/courses' },
    { title: 'Create', href: '/instructor/courses/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: '',
        level: 'beginner',
        thumbnail: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/instructor/courses');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Course" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold">Create New Course</h1>
                    <p className="text-muted-foreground mt-2">
                        Fill in the basic details. You'll add modules and lessons in the next step.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Course Title */}
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-2">
                                Course Title *
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="e.g., Complete Web Development Bootcamp"
                                className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                required
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                placeholder="Describe what students will learn in this course..."
                                className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px]"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Course Details */}
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Course Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium mb-2">
                                    Price (USD) *
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    required
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                    Set to 0 for a free course
                                </p>
                            </div>

                            <div>
                                <label htmlFor="level" className="block text-sm font-medium mb-2">
                                    Difficulty Level *
                                </label>
                                <select
                                    id="level"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={data.level}
                                    onChange={e => setData('level', e.target.value)}
                                    required
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                {errors.level && (
                                    <p className="text-red-500 text-sm mt-1">{errors.level}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Course Thumbnail</h2>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Upload Thumbnail Image
                            </label>
                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                                    onChange={e => setData('thumbnail', e.target.files?.[0] || null)}
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Recommended: 1280x720px, max 2MB
                                </p>
                            </div>
                            {errors.thumbnail && (
                                <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-border">
                        <a
                            href="/instructor/courses"
                            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium"
                        >
                            {processing ? 'Creating...' : 'Create Course & Add Content'}
                        </button>
                    </div>
                </form>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Next Steps:</strong> After creating your course, you'll be taken to the course builder
                        where you can add modules, lessons, and upload videos.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
