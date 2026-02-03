import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    profile_photo_path?: string;
    profile_photo_url?: string;
}

interface Comment {
    id: number;
    user: User;
    content: string;
    created_at: string;
}

interface Lesson {
    id: number;
    title: string;
    slug: string;
    type: 'video' | 'article' | 'quiz' | 'file';
    content?: string;
    video_url?: string;
    video_provider?: string; // s3, vimeo, youtube
    duration_minutes: number;
    sort_order: number;
    is_completed?: boolean;
    comments?: Comment[];
}

interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
    sort_order: number;
}

interface Course {
    id: number;
    title: string;
    slug: string;
    modules: Module[];
}

interface LessonShowProps {
    course: Course;
    lesson: Lesson;
    isCompleted: boolean;
}

export default function LessonShow({ course, lesson, isCompleted }: LessonShowProps) {
    const { post, processing: processingComplete } = useForm();
    const { data, setData, post: postComment, processing: processingComment, reset } = useForm({
        content: '',
    });

    const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop default

    const handleComplete = () => {
        post(`/lessons/${lesson.id}/complete`, {
            preserveScroll: true,
        });
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postComment(`/lessons/${lesson.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => reset('content'),
        });
    };

    const isYoutube = lesson.video_provider === 'youtube';
    const isVimeo = lesson.video_provider === 'vimeo';

    return (
        <AppLayout>
            <Head title={`${lesson.title} - ${course.title}`} />

            <div className="flex bg-background min-h-[calc(100vh-4rem)]">
                {/* Sidebar */}
                <div className={`w-80 border-r bg-card flex-shrink-0 flex flex-col transition-all duration-300 ${sidebarOpen ? '' : '-ml-80'}`}>
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold truncate pr-2">{course.title}</h3>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden">
                            <span className="sr-only">Close</span>
                            X
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1 p-4 space-y-6">
                        {course.modules?.map((module, mIdx) => (
                            <div key={module.id}>
                                <h4 className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wide">
                                    Module {mIdx + 1}: {module.title}
                                </h4>
                                <ul className="space-y-1">
                                    {module.lessons?.map((l) => (
                                        <li key={l.id}>
                                            <Link
                                                href={`/courses/${course.slug}/lessons/${l.slug}`}
                                                className={`flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${l.id === lesson.id
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted text-foreground'
                                                    }`}
                                            >
                                                {l.is_completed ? (
                                                    <span className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">✓</span>
                                                ) : (
                                                    <span className={`h-4 w-4 rounded-full border border-current opacity-50 ${l.id === lesson.id ? 'border-primary-foreground' : 'border-foreground'}`} />
                                                )}
                                                <span className="truncate flex-1">{l.title}</span>
                                                {l.duration_minutes > 0 && <span className="text-xs opacity-70">{l.duration_minutes}m</span>}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="p-4 border-b flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-md border">
                            {sidebarOpen ? '<<' : '>>'} Sidebar
                        </button>
                        <h1 className="text-xl font-bold truncate">{lesson.title}</h1>
                        <Link href={`/courses/${course.slug}`} className="ml-auto text-sm text-primary hover:underline">
                            Back to Course
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
                        {/* Video Player */}
                        {lesson.type === 'video' && lesson.video_url && (
                            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg mb-8">
                                {isYoutube ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${lesson.video_url.split('v=')[1] || lesson.video_url.split('/').pop()}`}
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                ) : (
                                    <video src={lesson.video_url} controls className="w-full h-full" />
                                )}
                            </div>
                        )}

                        {/* Article Content */}
                        {(lesson.content || lesson.type === 'article') && (
                            <div className="prose dark:prose-invert max-w-none mb-8">
                                {/* Ideally render markdown or HTML */}
                                {lesson.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                                ) : (
                                    <p>No text content available.</p>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t py-6 mt-8">
                            <button
                                onClick={handleComplete}
                                disabled={processingComplete}
                                className={`px-6 py-3 rounded-md font-medium transition-colors ${isCompleted
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    }`}
                            >
                                {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-12">
                            <h3 className="text-xl font-bold mb-6">Discussion ({lesson.comments?.length || 0})</h3>

                            <form onSubmit={handleCommentSubmit} className="mb-8">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        <div className="bg-gray-400 w-full h-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            placeholder="Ask a question or share your thoughts..."
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                                            required
                                        />
                                        <div className="mt-2 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processingComment || !data.content}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                            >
                                                Post Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="space-y-6">
                                {lesson.comments && lesson.comments.length > 0 ? (
                                    lesson.comments.map(comment => (
                                        <div key={comment.id} className="flex gap-4">
                                            <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                                                {comment.user.profile_photo_url ? (
                                                    <img src={comment.user.profile_photo_url} alt={comment.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {comment.user.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-sm">{comment.user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-foreground">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center py-6">No comments yet. Be the first to start the discussion!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
