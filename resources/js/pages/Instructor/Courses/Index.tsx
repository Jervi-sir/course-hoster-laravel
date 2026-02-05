import { Head, Link } from '@inertiajs/react';
import InstructorLayout from '@/pages/instructor/instructor-layout';
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
        <InstructorLayout breadcrumbs={breadcrumbs}>
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
                        <div className="flex flex-col gap-4">
                            {courses.data.map((course) => (
                                <div
                                    key={course.id}
                                    className="group relative flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
                                >
                                    {/* Thumbnail - Left Side */}
                                    <div className="w-full sm:w-64 aspect-video sm:aspect-auto relative shrink-0">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                                <BookOpen className="h-12 w-12" />
                                            </div>
                                        )}
                                        {/* Status Badge */}
                                        <span className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold ${course.status === 'published'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : course.status === 'archived'
                                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {course.status}
                                        </span>
                                    </div>

                                    {/* Content - Right Side */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <div>
                                                <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                                                    {course.title}
                                                </h3>
                                                {course.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1 max-w-2xl">
                                                        {course.description.length > 100
                                                            ? `${course.description.substring(0, 100)}...`
                                                            : course.description}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0 ${course.level === 'beginner'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-transparent'
                                                : course.level === 'intermediate'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-transparent'
                                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-transparent'
                                                }`}>
                                                {course.level}
                                            </span>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-6 text-sm text-muted-foreground my-3">
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{course.modules_count} Modules</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Video className="h-4 w-4" />
                                                <span>{course.lessons_count} Lessons</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="h-4 w-4" />
                                                <span>{course.students_count} Students</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                                            <div className="font-bold text-lg">
                                                {parseFloat(course.price) === 0 ? 'Free' : `${course.price} DZD`}
                                            </div>

                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/instructor/courses/${course.id}/builder`}
                                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
                                                >
                                                    Manage Content
                                                </Link>
                                                <Link
                                                    href={`/instructor/courses/${course.id}/students`}
                                                    className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                                                    title="View Students"
                                                >
                                                    <Users className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/instructor/courses/${course.id}/edit`}
                                                    className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                                                    title="Edit Settings"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </div>
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
        </InstructorLayout>
    );
}
