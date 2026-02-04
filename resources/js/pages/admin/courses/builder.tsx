import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';
import { Plus, GripVertical, Trash2, Video, FileText, CheckCircle2 } from 'lucide-react';
import type { BreadcrumbItem, Course as BaseCourse } from '@/types';

interface Lesson {
    id: number;
    title: string;
    slug: string;
    type: 'video' | 'article' | 'quiz' | 'file';
    video_url?: string;
    content?: string;
    duration_minutes: number;
    is_preview: boolean;
    sort_order: number;
}

interface Module {
    id: number;
    title: string;
    sort_order: number;
    lessons: Lesson[];
}

interface Course extends BaseCourse {
    modules: Module[];
}

interface BuilderProps {
    course: Course;
}

export default function Builder({ course }: BuilderProps) {
    const [expandedModules, setExpandedModules] = useState<number[]>([]);
    const [editingLesson, setEditingLesson] = useState<{ moduleId: number; lessonId: number } | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Courses', href: '/admin/courses' },
        { title: course.title, href: `/admin/courses/${course.id}/builder` },
    ];

    const moduleForm = useForm({
        title: '',
    });

    const lessonForm = useForm({
        title: '',
        type: 'video' as 'video' | 'article' | 'quiz' | 'file',
        content: '',
        video: null as File | null,
        video_url: '',
        duration_minutes: 0,
        is_preview: false,
    });

    const toggleModule = (moduleId: number) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleAddModule = (e: React.FormEvent) => {
        e.preventDefault();
        moduleForm.post(`/admin/courses/${course.id}/modules`, {
            preserveScroll: true,
            onSuccess: () => {
                moduleForm.reset();
            },
        });
    };

    const handleAddLesson = (moduleId: number, e: React.FormEvent) => {
        e.preventDefault();
        lessonForm.post(`/admin/courses/${course.id}/modules/${moduleId}/lessons`, {
            preserveScroll: true,
            onSuccess: () => {
                lessonForm.reset();
                setEditingLesson(null);
            },
        });
    };

    const handleDeleteModule = (moduleId: number) => {
        if (confirm('Are you sure you want to delete this module? All lessons will be deleted.')) {
            router.delete(`/admin/courses/${course.id}/modules/${moduleId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteLesson = (moduleId: number, lessonId: number) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            router.delete(`/admin/courses/${course.id}/modules/${moduleId}/lessons/${lessonId}`, {
                preserveScroll: true,
            });
        }
    };

    // Helper to count total lessons safely
    const totalLessons = course.modules?.reduce((sum, module) => sum + (module.lessons?.length || 0), 0) || 0;

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Build: ${course.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 pt-0">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <p className="text-muted-foreground mt-1">
                            Build your course structure by adding modules and lessons
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-muted-foreground">
                            {course.modules?.length || 0} modules • {totalLessons} lessons
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                            {course.status}
                        </span>
                    </div>
                </div>

                {/* Add Module Form */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Add New Module</h2>
                    <form onSubmit={handleAddModule} className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Module title (e.g., Introduction to React)"
                            className="flex-1 px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            value={moduleForm.data.title}
                            onChange={e => moduleForm.setData('title', e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={moduleForm.processing}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 font-medium"
                        >
                            <Plus className="h-4 w-4" />
                            Add Module
                        </button>
                    </form>
                    {moduleForm.errors.title && (
                        <p className="text-red-500 text-sm mt-2">{moduleForm.errors.title}</p>
                    )}
                </div>

                {/* Modules List */}
                <div className="space-y-4">
                    {course.modules?.length === 0 ? (
                        <div className="text-center py-12 bg-card border border-border rounded-lg">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">No modules yet</h3>
                            <p className="text-muted-foreground mt-1">
                                Start by adding your first module above
                            </p>
                        </div>
                    ) : (
                        course.modules?.map((module, moduleIndex) => (
                            <div key={module.id} className="bg-card border border-border rounded-lg overflow-hidden">
                                {/* Module Header */}
                                <div className="flex items-center gap-3 p-4 bg-muted/50">
                                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">
                                            Module {moduleIndex + 1}: {module.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {module.lessons?.length || 0} lesson{(module.lessons?.length || 0) !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleModule(module.id)}
                                        className="px-4 py-2 text-sm bg-background border border-border rounded-md hover:bg-accent"
                                    >
                                        {expandedModules.includes(module.id) ? 'Collapse' : 'Expand'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteModule(module.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Module Content */}
                                {expandedModules.includes(module.id) && (
                                    <div className="p-4 space-y-4">
                                        {/* Add Lesson Form */}
                                        <div className="bg-muted/30 rounded-lg p-4">
                                            <h4 className="font-medium mb-3">Add Lesson to this Module</h4>
                                            <form onSubmit={(e) => handleAddLesson(module.id, e)} className="space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Lesson title"
                                                        className="px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                        value={lessonForm.data.title}
                                                        onChange={e => lessonForm.setData('title', e.target.value)}
                                                        required
                                                    />
                                                    <select
                                                        className="px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                        value={lessonForm.data.type}
                                                        onChange={e => lessonForm.setData('type', e.target.value as any)}
                                                    >
                                                        <option value="video">Video</option>
                                                        <option value="article">Article</option>
                                                        <option value="quiz">Quiz</option>
                                                        <option value="file">File</option>
                                                    </select>
                                                </div>

                                                {lessonForm.data.type === 'video' && (
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium">
                                                            Upload Video or Enter URL
                                                        </label>
                                                        <input
                                                            type="file"
                                                            accept="video/*"
                                                            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                                            onChange={e => lessonForm.setData('video', e.target.files?.[0] || null)}
                                                        />
                                                        <div className="text-center text-sm text-muted-foreground">or</div>
                                                        <input
                                                            type="url"
                                                            placeholder="Video URL (YouTube, Vimeo, etc.)"
                                                            className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                            value={lessonForm.data.video_url}
                                                            onChange={e => lessonForm.setData('video_url', e.target.value)}
                                                        />
                                                    </div>
                                                )}

                                                {lessonForm.data.type === 'article' && (
                                                    <textarea
                                                        placeholder="Article content (supports markdown)"
                                                        className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px]"
                                                        value={lessonForm.data.content}
                                                        onChange={e => lessonForm.setData('content', e.target.value)}
                                                    />
                                                )}

                                                <div className="flex items-center gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-border"
                                                            checked={lessonForm.data.is_preview}
                                                            onChange={e => lessonForm.setData('is_preview', e.target.checked)}
                                                        />
                                                        <span className="text-sm">Free preview</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="Duration (minutes)"
                                                        className="w-32 px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                        value={lessonForm.data.duration_minutes || ''}
                                                        onChange={e => lessonForm.setData('duration_minutes', parseInt(e.target.value) || 0)}
                                                        min="0"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={lessonForm.processing}
                                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Add Lesson
                                                </button>
                                            </form>
                                        </div>

                                        {/* Lessons List */}
                                        {module.lessons?.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                No lessons yet. Add your first lesson above.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {module.lessons?.map((lesson, lessonIndex) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="flex items-center gap-3 p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors"
                                                    >
                                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                {lesson.type === 'video' && <Video className="h-4 w-4 text-primary" />}
                                                                {lesson.type === 'article' && <FileText className="h-4 w-4 text-blue-500" />}
                                                                <span className="font-medium">
                                                                    {lessonIndex + 1}. {lesson.title}
                                                                </span>
                                                                {lesson.is_preview && (
                                                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">
                                                                        Preview
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {lesson.duration_minutes > 0 && `${lesson.duration_minutes} min`}
                                                                {lesson.video_url && ' • Has video'}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Action Buttons */}
                {course.modules?.length > 0 && (
                    <div className="flex justify-between items-center pt-6 border-t border-border mt-6">
                        <a
                            href={`/admin/courses/${course.id}/edit`}
                            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium"
                        >
                            Edit Course Details
                        </a>
                        <div className="flex gap-3">
                            <a
                                href="/admin/courses"
                                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium"
                            >
                                Back to Courses
                            </a>
                            {course.status === 'draft' && totalLessons > 0 && (
                                <button
                                    onClick={() => {
                                        router.put(`/admin/courses/${course.id}`, {
                                            title: course.title,
                                            description: course.description || '',
                                            price: course.price,
                                            level: course.level,
                                            status: 'published',
                                        });
                                    }}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium flex items-center gap-2"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Publish Course
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
