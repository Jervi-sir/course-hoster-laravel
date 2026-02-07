import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState, useEffect } from 'react';
import {
    MessageSquareDashed,
    ChevronsLeft,
    ChevronsRight,
    PlayCircle,
    FileText,
    CheckCircle,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Search
} from 'lucide-react';
import PlyrPlayer from '@/components/video-players/plyr-player';
import VideoJsPlayer from '@/components/video-players/video-js-player';
import MediaChromePlayer from '@/components/video-players/media-chrome-player';
import VidstackPlayer from '@/components/video-players/vidstack-player';
import { cn } from '@/lib/utils'; // Assuming cn exists, if not I'll just use template literals but standard shadcn uses it. I'll stick to template literals if unsure, or check if '@/lib/utils' exists. checking imports shows it's not imported often. I will check for it first or just use standard class strings.

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
    video_hls_path?: string;
    secure_hls_url?: string;
    video_processing_status?: 'pending' | 'processing' | 'completed' | 'failed';
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

    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }, []);

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

    return (
        <AppLayout hideHeader={true}>
            <Head title={`${lesson.title} - ${course.title}`} />

            <div className="flex bg-background h-[calc(100vh)] relative overflow-hidden">
                {/* Mobile Sidebar Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={() => setSidebarOpen(false)}
                />

                {/* Sidebar */}
                <div
                    className={`
                        fixed md:relative z-50 h-full flex-shrink-0 bg-card border-r border-border
                        transition-all duration-300 ease-in-out flex flex-col
                        ${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0 md:border-none'}
                    `}
                >
                    <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur sticky top-0 z-10">
                        <h3 className="font-semibold truncate pr-2" title={course.title}>
                            {sidebarOpen && course.title}
                        </h3>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-muted rounded-md bg-background border">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className={`overflow-y-auto flex-1 p-4 space-y-6 ${!sidebarOpen && 'hidden'}`}>
                        {course.modules?.map((module, mIdx) => (
                            <div key={module.id}>
                                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        Module {mIdx + 1}
                                    </span>
                                    <span className="h-px bg-border flex-1"></span>
                                </div>
                                <h4 className="text-sm font-medium mb-3 text-foreground px-1">
                                    {module.title}
                                </h4>
                                <ul className="space-y-1">
                                    {module.lessons?.map((l) => {
                                        const isActive = l.id === lesson.id;
                                        return (
                                            <li key={l.id}>
                                                <Link
                                                    href={`/courses/${course.slug}/lessons/${l.slug}`}
                                                    className={`
                                                        group flex items-start gap-3 p-2 rounded-lg text-sm transition-all duration-200
                                                        ${isActive
                                                            ? 'bg-primary/10 text-primary font-medium'
                                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                        }
                                                    `}
                                                >
                                                    <div className="mt-0.5 flex-shrink-0">
                                                        {l.is_completed ? (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            l.type === 'video' ? <PlayCircle className={`w-4 h-4 ${isActive ? 'text-primary' : 'opacity-50'}`} /> :
                                                                <FileText className={`w-4 h-4 ${isActive ? 'text-primary' : 'opacity-50'}`} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="leading-snug truncate">{l.title}</p>
                                                        {l.duration_minutes > 0 && (
                                                            <p className="text-[10px] opacity-70 mt-0.5">
                                                                {l.duration_minutes} min
                                                            </p>
                                                        )}
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                    {/* Header */}
                    <header className="pl-4 h-16 border-b border-border bg-background/95 backdrop-blur flex items-center px-4 md:px-6 gap-4 sticky top-0 z-30 flex-shrink-0">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-muted rounded-md border border-border transition-colors text-muted-foreground hover:text-foreground"
                            aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                        >
                            {sidebarOpen ? <ChevronsLeft className="w-5 h-5" /> : <ChevronsRight className="w-5 h-5" />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg md:text-xl font-bold truncate leading-tight">{lesson.title}</h1>
                            <p className="text-xs text-muted-foreground truncate hidden md:block">
                                {course.title}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={`/courses/${course.slug}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">
                                Course Overview
                            </Link>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full pb-20">
                            {/* Video Player */}
                            {lesson.type === 'video' && (
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-border/50 mb-8 relative group">
                                    {lesson.video_processing_status === 'processing' || lesson.video_processing_status === 'pending' ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900 z-10">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4 opacity-75"></div>
                                            <p className="font-medium animate-pulse">Processing Video...</p>
                                            <p className="text-xs text-zinc-500 mt-2">This may take a few minutes.</p>
                                        </div>
                                    ) : (
                                        (lesson.video_url || lesson.video_hls_path) ? (
                                            <div
                                                className='relative w-full h-full'
                                                onContextMenu={(e) => e.preventDefault()}
                                            >
                                                <VidstackPlayer
                                                    title={lesson.title}
                                                    videoUrl={lesson.video_url}
                                                    hlsUrl={lesson.secure_hls_url || (lesson.video_hls_path && lesson.video_processing_status === 'completed'
                                                        ? `/video-stream/${lesson.id}/${lesson.id}.m3u8`
                                                        : undefined)
                                                    }
                                                    processingStatus={lesson.video_processing_status}
                                                />
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
                                                <div className="text-center">
                                                    <PlayCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                                    <p>Video source not available</p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Content & Actions */}
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Article Content */}
                                    {(lesson.content || lesson.type === 'article') && (
                                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                                            {lesson.content ? (
                                                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                                            ) : (
                                                <p className="text-muted-foreground italic">No text content available.</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Bar */}
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border shadow-sm">
                                        <div className="text-sm text-muted-foreground">
                                            {isCompleted ? 'You have completed this lesson.' : 'Ready to move on?'}
                                        </div>
                                        <button
                                            onClick={handleComplete}
                                            disabled={processingComplete}
                                            className={`
                                                flex items-center gap-2 px-6 py-2.5 rounded-md font-medium text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary
                                                ${isCompleted
                                                    ? 'bg-green-100/50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800'
                                                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg'
                                                }
                                            `}
                                        >
                                            {isCompleted ? (
                                                <>Completed <CheckCircle className="w-4 h-4" /></>
                                            ) : (
                                                'Mark as Complete'
                                            )}
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="mt-12 pt-8 border-t border-border">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                <MessageSquareDashed className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-xl font-bold">Discussion</h3>
                                            <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                                {lesson.comments?.length || 0}
                                            </span>
                                        </div>

                                        <form onSubmit={handleCommentSubmit} className="mb-10">
                                            <div className="flex gap-4">
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-background">
                                                    <div className="bg-gradient-to-br from-gray-300 to-gray-400 w-full h-full"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <textarea
                                                            value={data.content}
                                                            onChange={(e) => setData('content', e.target.value)}
                                                            placeholder="Ask a question or share your thoughts..."
                                                            className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[120px] resize-y shadow-sm transition-shadow focus:shadow-md"
                                                            required
                                                        />
                                                        <div className="absolute bottom-3 right-3">
                                                            <button
                                                                type="submit"
                                                                disabled={processingComment || !data.content}
                                                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-md text-xs font-medium disabled:opacity-50 transition-all transform active:scale-95 shadow-sm"
                                                            >
                                                                Post Comment
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

                                        <div className="space-y-6">
                                            {lesson.comments && lesson.comments.length > 0 ? (
                                                lesson.comments.map(comment => (
                                                    <div key={comment.id} className="group flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                                                        <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0 overflow-hidden ring-2 ring-background group-hover:ring-muted-foreground/20 transition-all">
                                                            {comment.user.profile_photo_url ? (
                                                                <img src={comment.user.profile_photo_url} alt={comment.user.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                                                    {comment.user.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1.5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-sm text-foreground">{comment.user.name}</span>
                                                                    {/* Simple approach for "time ago" since we don't have a library handy, just date */}
                                                                    <span className="text-xs text-muted-foreground hidden sm:inline-block">•</span>
                                                                    <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm text-foreground/90 leading-relaxed">
                                                                {comment.content}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-16 rounded-xl border border-dashed border-border/60 bg-muted/5">
                                                    <MessageSquareDashed className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                                    <h3 className="text-sm font-medium text-foreground mb-1">No comments yet</h3>
                                                    <p className="text-xs text-muted-foreground">Start the conversation!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar for desktop "More in this module" or similar could go here if we wanted a 3-col layout, but keeping it 2-col with main content taking space */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


