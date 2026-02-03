import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Course } from '@/types';

interface CourseWithError extends Course {
    modules?: {
        id: number;
        title: string;
        lessons: {
            id: number;
            title: string;
            duration_minutes: number;
        }[];
    }[];
    lessons_count?: number;
}

interface CourseShowProps {
    course: CourseWithError;
    isEnrolled: boolean;
}

export default function CourseShow({ course, isEnrolled }: CourseShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: course.title,
            href: `/courses/${course.slug}`,
        },
    ];

    const { post, processing } = useForm();

    const handleEnroll = () => {
        post(`/courses/${course.id}/enroll`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />
            <div className="flex flex-col gap-8 p-4 md:p-8 max-w-5xl mx-auto w-full">

                {/* Hero Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <div className="space-y-2">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 capitalize">
                                {course.level}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.title}</h1>
                            <p className="text-lg text-muted-foreground">{course.description}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{course.lessons_count} Lessons</span>
                            <span>•</span>
                            <span>Updated {new Date(course.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden sticky top-4">
                            <div className="aspect-video w-full bg-muted">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                        No Thumbnail
                                    </div>
                                )}
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="text-3xl font-bold">
                                    {isEnrolled ? (
                                        <span className="text-green-600">Enrolled</span>
                                    ) : (
                                        parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`
                                    )}
                                </div>

                                {isEnrolled ? (
                                    <Link
                                        href={`/courses/${course.slug}/learn`}
                                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                                    >
                                        Continue Learning
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={processing}
                                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                                    >
                                        {processing ? 'Enrolling...' : 'Enroll Now'}
                                    </button>
                                )}

                                <p className="text-xs text-muted-foreground text-center">
                                    30-day money-back guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                        <div className="space-y-4">
                            {course.modules?.map((module) => (
                                <div key={module.id} className="border rounded-lg overflow-hidden">
                                    <div className="bg-muted/50 p-4 font-medium border-b flex justify-between items-center">
                                        <span>{module.title}</span>
                                        <span className="text-xs text-muted-foreground">{module.lessons.length} lessons</span>
                                    </div>
                                    <div className="divide-y">
                                        {module.lessons.map(lesson => (
                                            <div key={lesson.id} className="p-4 flex items-center gap-3 text-sm">
                                                <div className="h-6 w-6 rounded-full border flex items-center justify-center shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-muted-foreground">
                                                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span>{lesson.title}</span>
                                                <span className="ml-auto text-muted-foreground text-xs">{lesson.duration_minutes}m</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
