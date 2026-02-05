import { Head, useForm, router } from '@inertiajs/react';
import InstructorLayout from '@/pages/instructor/instructor-layout';
import { useState } from 'react';
import { Plus, GripVertical, Pencil, Trash2, Video, FileText, Upload, CheckCircle2, Play, X } from 'lucide-react';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import type { BreadcrumbItem } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

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

interface Course {
    id: number;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    price: string;
    status: 'draft' | 'published' | 'archived';
    level: string;
    modules: Module[];
}

interface BuilderProps {
    course: Course;
}

export default function Builder({ course }: BuilderProps) {
    const [expandedModules, setExpandedModules] = useState<number[]>([]);
    const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
    const [videoSource, setVideoSource] = useState<'upload' | 'url'>('upload');
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Instructor', href: '/instructor/courses' },
        { title: 'Courses', href: '/instructor/courses' },
        { title: course.title, href: `/instructor/courses/${course.id}/builder` },
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
        moduleForm.post(`/instructor/courses/${course.id}/modules`, {
            preserveScroll: true,
            onSuccess: () => {
                moduleForm.reset();
            },
        });
    };

    const handleAddLesson = (moduleId: number, e: React.FormEvent) => {
        e.preventDefault();
        lessonForm.post(`/instructor/courses/${course.id}/modules/${moduleId}/lessons`, {
            preserveScroll: true,
            onSuccess: () => {
                lessonForm.reset();
                setVideoSource('upload');
                setVideoPreview(null);
            },
        });
    };

    const handleDeleteModule = (moduleId: number) => {
        if (confirm('Are you sure you want to delete this module? All lessons will be deleted.')) {
            router.delete(`/instructor/courses/${course.id}/modules/${moduleId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteLesson = (moduleId: number, lessonId: number) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            router.delete(`/instructor/courses/${course.id}/modules/${moduleId}/lessons/${lessonId}`, {
                preserveScroll: true,
            });
        }
    };

    const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);

    return (
        <InstructorLayout breadcrumbs={breadcrumbs}>
            <Head title={`Build: ${course.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
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
                            {course.modules.length} modules • {totalLessons} lessons
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
                    {course.modules.length === 0 ? (
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
                        course.modules.map((module, moduleIndex) => (
                            <div key={module.id} className="bg-card border border-border rounded-lg overflow-hidden">
                                {/* Module Header */}
                                <div className="flex items-center gap-3 p-4 bg-muted/50">
                                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">
                                            Module {moduleIndex + 1}: {module.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
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
                                                <div className="grid grid-cols-1 gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Lesson title"
                                                        className="px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                        value={lessonForm.data.title}
                                                        onChange={e => lessonForm.setData('title', e.target.value)}
                                                        required
                                                    />

                                                    <div className="flex gap-4">
                                                        <select
                                                            className="px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring w-40"
                                                            value={lessonForm.data.type}
                                                            onChange={e => lessonForm.setData('type', e.target.value as any)}
                                                        >
                                                            <option value="video">Video</option>
                                                            <option value="article">Article</option>
                                                            <option value="quiz">Quiz</option>
                                                            <option value="file">File</option>
                                                        </select>

                                                        <input
                                                            type="number"
                                                            placeholder="Duration (min)"
                                                            className="w-48 px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                            value={lessonForm.data.duration_minutes || ''}
                                                            onChange={e => lessonForm.setData('duration_minutes', parseInt(e.target.value) || 0)}
                                                            min="0"
                                                        />

                                                        <label className="flex items-center gap-2 cursor-pointer border border-border px-3 rounded-md bg-background hover:bg-accent/50">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded border-border"
                                                                checked={lessonForm.data.is_preview}
                                                                onChange={e => lessonForm.setData('is_preview', e.target.checked)}
                                                            />
                                                            <span className="text-sm">Free Preview</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {lessonForm.data.type === 'video' && (
                                                    <div className="space-y-3 border border-border rounded-md p-3 bg-background">
                                                        <div className="flex gap-4 border-b border-border pb-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setVideoSource('upload');
                                                                    lessonForm.setData('video_url', '');
                                                                }}
                                                                className={`text-sm font-medium pb-1 transition-colors ${videoSource === 'upload'
                                                                    ? 'text-primary border-b-2 border-primary'
                                                                    : 'text-muted-foreground hover:text-foreground'}`}
                                                            >
                                                                Upload Video
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setVideoSource('url');
                                                                    lessonForm.setData('video', null);
                                                                    setVideoPreview(null);
                                                                }}
                                                                className={`text-sm font-medium pb-1 transition-colors ${videoSource === 'url'
                                                                    ? 'text-primary border-b-2 border-primary'
                                                                    : 'text-muted-foreground hover:text-foreground'}`}
                                                            >
                                                                External URL
                                                            </button>
                                                        </div>

                                                        {videoSource === 'upload' ? (
                                                            <div className="space-y-3">
                                                                <input
                                                                    type="file"
                                                                    accept="video/*"
                                                                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                                                    onChange={e => {
                                                                        const file = e.target.files?.[0] || null;
                                                                        lessonForm.setData('video', file);
                                                                        if (file) {
                                                                            setVideoPreview(URL.createObjectURL(file));
                                                                        } else {
                                                                            setVideoPreview(null);
                                                                        }
                                                                    }}
                                                                />

                                                                {videoPreview && (
                                                                    <div className="relative rounded-md overflow-hidden bg-black aspect-video">
                                                                        <video
                                                                            src={videoPreview}
                                                                            controls
                                                                            className="w-full h-full"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                lessonForm.setData('video', null);
                                                                                setVideoPreview(null);
                                                                            }}
                                                                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                {lessonForm.progress && (
                                                                    <div className="space-y-1">
                                                                        <div className="flex justify-between text-xs text-muted-foreground">
                                                                            <span>Uploading...</span>
                                                                            <span>{lessonForm.progress.percentage}%</span>
                                                                        </div>
                                                                        <Progress value={lessonForm.progress.percentage} className="h-2" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="url"
                                                                placeholder="Video URL (YouTube, Vimeo, etc.)"
                                                                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                                                value={lessonForm.data.video_url}
                                                                onChange={e => lessonForm.setData('video_url', e.target.value)}
                                                            />
                                                        )}
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

                                                <button
                                                    type="submit"
                                                    disabled={lessonForm.processing}
                                                    className="w-full sm:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium active:scale-95 transition-transform"
                                                >
                                                    {lessonForm.processing ? (
                                                        <>Uploading...</>
                                                    ) : (
                                                        <>
                                                            <Plus className="h-4 w-4" />
                                                            Add Lesson
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </div>

                                        {/* Lessons List */}
                                        {module.lessons.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                No lessons yet. Add your first lesson above.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {module.lessons.map((lesson, lessonIndex) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="group flex items-center gap-3 p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors"
                                                    >
                                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                                        <div
                                                            className="flex-1 cursor-pointer"
                                                            onClick={() => setPreviewLesson(lesson)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {lesson.type === 'video' && <Video className="h-4 w-4 text-primary" />}
                                                                {lesson.type === 'article' && <FileText className="h-4 w-4 text-blue-500" />}
                                                                <span className="font-medium group-hover:text-primary transition-colors">
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
                                                            onClick={() => setPreviewLesson(lesson)}
                                                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"
                                                            title="Preview"
                                                        >
                                                            <Play className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                                            title="Delete"
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
                {course.modules.length > 0 && (
                    <div className="flex justify-between items-center pt-6 border-t border-border">
                        <a
                            href={`/instructor/courses/${course.id}/edit`}
                            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium"
                        >
                            Edit Course Details
                        </a>
                        <div className="flex gap-3">
                            <a
                                href="/instructor/courses"
                                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium"
                            >
                                Back to Courses
                            </a>
                            <a
                                href={`/instructor/courses/${course.id}/students`}
                                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium"
                            >
                                View Students
                            </a>
                            {course.status === 'draft' && totalLessons > 0 && (
                                <button
                                    onClick={() => {
                                        router.put(`/instructor/courses/${course.id}`, {
                                            title: course.title,
                                            description: course.description,
                                            price: course.price,
                                            level: course.level,
                                            status: 'published',
                                        } as any);
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

            {/* Preview Modal */}
            <Dialog open={!!previewLesson} onOpenChange={(open) => !open && setPreviewLesson(null)}>
                <DialogContent className="sm:max-w-2xl px-2 sm:px-6">
                    {/*  Modified padding for mobile friendliness if needed, ensuring DialogContent props are standard */}
                    <DialogHeader>
                        <DialogTitle>{previewLesson?.title}</DialogTitle>
                        <DialogDescription>
                            {previewLesson?.type === 'video' ? 'Video Lesson Preview' : 'Lesson Content Preview'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        {previewLesson?.type === 'video' ? (
                            previewLesson.video_url ? (
                                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                                    {previewLesson.video_url.includes('youtube.com') || previewLesson.video_url.includes('youtu.be') ? (
                                        <iframe
                                            src={previewLesson.video_url.replace('watch?v=', 'embed/')}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <MediaPlayer
                                            src={previewLesson.video_url}
                                            viewType="video"
                                            streamType="on-demand"
                                            logLevel="warn"
                                            crossOrigin
                                            playsInline
                                            title={previewLesson.title}
                                            className="w-full h-full aspect-video bg-black rounded-lg overflow-hidden" // ensure size and rounding
                                        >
                                            <MediaProvider />
                                            <DefaultVideoLayout icons={defaultLayoutIcons} />
                                        </MediaPlayer>
                                    )}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-muted rounded-lg">
                                    No video URL available
                                </div>
                            )
                        ) : (
                            <div className="prose dark:prose-invert max-w-none">
                                {previewLesson?.content}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </InstructorLayout>
    );
}
