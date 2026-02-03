import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Course, PaginatedResponse } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/courses',
    },
];

interface CoursesIndexProps {
    courses: PaginatedResponse<Course>;
}

export default function CoursesIndex({ courses }: CoursesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Browse Courses" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Browse Courses</h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {courses.data.map((course) => (
                        <div key={course.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                            <Link href={`/courses/${course.slug}`} className="absolute inset-0 z-10">
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

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-lg font-bold">
                                        {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
                                    </div>
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                        {course.level}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simple Pagination */}
                <div className="mt-8 flex justify-center gap-2">
                    {courses.links.map((link, index) => (
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                className={`px-4 py-2 text-sm rounded-md ${link.active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'} `}
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
            </div>
        </AppLayout>
    );
}
