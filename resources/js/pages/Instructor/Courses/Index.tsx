import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, BookOpen, Users, Video, Edit, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Instructor', href: '/instructor/courses' },
    { title: 'Courses', href: '/instructor/courses' },
];

interface Course {
    id: number;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    price: string;
    status: 'draft' | 'published' | 'archived';
    level: string;
    modules_count: number;
    lessons_count: number;
    students_count: number;
    created_at: string;
}

interface PaginatedCourses {
    data: Course[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface IndexProps {
    courses: PaginatedCourses;
}

export default function Index({ courses }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Courses" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">My Courses</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your courses and track student progress
                        </p>
                    </div>
                    <Link
                        href="/instructor/courses/create"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Create New Course
                    </Link>
                </div>

                {/* Courses Grid */}
                {courses.data.length === 0 ? (
                    <div className="text-center py-16 bg-card border border-border rounded-lg">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                            <BookOpen className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">No courses yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Start creating your first course and share your knowledge with students around the world.
                        </p>
                        <Link
                            href="/instructor/courses/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
                        >
                            <Plus className="h-5 w-5" />
                            Create Your First Course
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                            {courses.data.map((course) => (
                                <div
                                    key={course.id}
                                    className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video w-full overflow-hidden bg-muted relative">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                <BookOpen className="h-16 w-16" />
                                            </div>
                                        )}
                                        {/* Status Badge */}
                                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${course.status === 'published'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : course.status === 'archived'
                                                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {course.status}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                                            {course.title}
                                        </h3>
                                        {course.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                {course.description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-border">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                                    <BookOpen className="h-4 w-4" />
                                                </div>
                                                <div className="font-semibold">{course.modules_count}</div>
                                                <div className="text-xs text-muted-foreground">Modules</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                                    <Video className="h-4 w-4" />
                                                </div>
                                                <div className="font-semibold">{course.lessons_count}</div>
                                                <div className="text-xs text-muted-foreground">Lessons</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                                    <Users className="h-4 w-4" />
                                                </div>
                                                <div className="font-semibold">{course.students_count}</div>
                                                <div className="text-xs text-muted-foreground">Students</div>
                                            </div>
                                        </div>

                                        {/* Price & Level */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-lg font-bold">
                                                {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
                                            </div>
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${course.level === 'beginner'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-transparent'
                                                    : course.level === 'intermediate'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-transparent'
                                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-transparent'
                                                }`}>
                                                {course.level}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-auto">
                                            <Link
                                                href={`/instructor/courses/${course.id}/builder`}
                                                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-center text-sm font-medium"
                                            >
                                                Manage Content
                                            </Link>
                                            <Link
                                                href={`/instructor/courses/${course.id}/edit`}
                                                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 text-center"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {courses.data.length > 0 && (
                            <div className="mt-6 flex justify-center gap-2">
                                {courses.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-4 py-2 text-sm rounded-md ${link.active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-4 py-2 text-sm text-muted-foreground"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
