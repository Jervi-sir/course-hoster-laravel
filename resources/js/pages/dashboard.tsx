

import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Course } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardCourse extends Course {
    lessons_count?: number;
    completed_lessons_count?: number;
    progress?: number;
}

interface DashboardProps {
    courses: DashboardCourse[];
}

export default function Dashboard({ courses }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">My Courses</h2>
                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Browse Courses
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-xl border-border bg-sidebar/50">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-foreground">No courses enrolled</h3>
                            <p className="text-muted-foreground mt-1 mb-4">You haven't enrolled in any courses yet.</p>
                            <Link
                                href="/courses"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <div key={course.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                                <Link href={`/courses/${course.slug}/learn`} className="absolute inset-0 z-10">
                                    <span className="sr-only">View course</span>
                                </Link>
                                <div className="aspect-video w-full overflow-hidden bg-muted">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            No Thumbnail
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col p-4">
                                    <h3 className="font-semibold tracking-tight text-lg line-clamp-1">{course.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>

                                    <div className="mt-4 flex flex-col gap-2">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Progress</span>
                                            <span>{course.progress || 0}%</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                            <div
                                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                                style={{ width: `${course.progress || 0}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground text-right mt-1">
                                            {course.completed_lessons_count || 0} / {course.lessons_count || 0} Lessons
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
