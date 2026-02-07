import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FavoriteButton } from '@/components/favorite-button';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { BreadcrumbItem, Course, PaginatedResponse } from '@/types';
import StudentLayout from '../layouts/student-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Browse Courses',
        href: '/courses',
    },
];

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface CoursesIndexProps {
    courses: PaginatedResponse<Course>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
    };
}

export default function CoursesIndex({ courses, categories, filters }: CoursesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get('/courses', {
                    search: search,
                    category: selectedCategory
                }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        setSelectedCategory(category);
        router.get('/courses', {
            search: search,
            category: category
        }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <StudentLayout breadcrumbs={breadcrumbs} subInfo="Explore our wide range of courses and start learning today.">
            <Head title="Browse Courses" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row gap-4 mb-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="p-2 bg-background border border-border rounded-md min-w-[180px] text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {courses.data.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                            <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No courses found</h3>
                        <p className="text-muted-foreground mt-1">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <button
                            onClick={() => { setSearch(''); setSelectedCategory(''); router.get('/courses'); }}
                            className="mt-4 text-primary font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {courses.data.map((course) => (
                            <div key={course.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                                {/* <FavoriteButton course={course} className="absolute top-2 right-2 z-20" /> */}
                                <Link href={`/courses/${course.slug}`} className="absolute inset-0 z-10">
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
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            No Thumbnail
                                        </div>
                                    )}
                                    {/* Category Badge if available */}
                                    {course.category && (
                                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] uppercase font-bold rounded backdrop-blur-sm">
                                            {course.category.name}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col p-4">
                                    <h3 className="font-semibold tracking-tight text-lg line-clamp-1">{course.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-lg font-bold">
                                            {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
                                        </div>
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${course.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                            course.level === 'intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                            }`}>
                                            {course.level}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Simple Pagination */}
                {courses.data.length > 0 && (
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
                )}
            </div>
        </StudentLayout>
    );
}
