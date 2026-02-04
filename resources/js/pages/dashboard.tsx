

import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Course } from '@/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, CheckCircle } from 'lucide-react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

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
    const [activeTab, setActiveTab] = useState<'in_progress' | 'completed'>('in_progress');

    const filteredCourses = courses.filter((course) => {
        const isCompleted = (course.progress || 0) === 100;
        return activeTab === 'completed' ? isCompleted : !isCompleted;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold">My Courses</h2>
                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                    >
                        Browse Courses
                    </Link>
                </div>

                <div className="flex space-x-1 rounded-lg bg-muted p-1 w-fit">
                    <button
                        onClick={() => setActiveTab('in_progress')}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            activeTab === 'in_progress'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                        )}
                    >
                        <BookOpen className="h-4 w-4" />
                        In Progress
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            activeTab === 'completed'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                        )}
                    >
                        <CheckCircle className="h-4 w-4" />
                        Completed
                    </button>
                </div>

                {filteredCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-sidebar/30 relative overflow-hidden">
                        <PlaceholderPattern className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" />
                        <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto px-4 text-center">
                            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 ring-8 ring-muted/20">
                                {activeTab === 'in_progress' ? (
                                    <BookOpen className="h-8 w-8 text-muted-foreground/70" />
                                ) : (
                                    <CheckCircle className="h-8 w-8 text-muted-foreground/70" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {activeTab === 'in_progress' ? 'No courses in progress' : 'No completed courses'}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                                {activeTab === 'in_progress'
                                    ? "You haven't enrolled in any courses yet. Start your learning journey today by browsing our catalog."
                                    : "You haven't completed any courses yet. Keep learning and you'll get there soon!"}
                            </p>
                            {activeTab === 'in_progress' && (
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    Browse Courses
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                                <Link href={`/courses/${course.slug}/learn`} className="absolute inset-0 z-10">
                                    <span className="sr-only">View course</span>
                                </Link>
                                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary/50">
                                            <BookOpen className="h-10 w-10 opacity-20" />
                                        </div>
                                    )}
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-semibold tracking-tight text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                        {course.description}
                                    </p>

                                    <div className="mt-auto flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                            <span>{course.progress || 0}% Complete</span>
                                            <span>
                                                {course.completed_lessons_count || 0}/{course.lessons_count || 0} Lessons
                                            </span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/50">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-500 ease-out",
                                                    (course.progress || 0) === 100 ? "bg-green-500" : "bg-primary"
                                                )}
                                                style={{ width: `${course.progress || 0}%` }}
                                            />
                                        </div>
                                        {(course.progress || 0) === 100 && (
                                            <a
                                                href={`/courses/${course.id}/certificate`}
                                                target="_blank"
                                                className="mt-2 text-center text-xs text-primary hover:underline font-medium"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Download Certificate
                                            </a>
                                        )}
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
