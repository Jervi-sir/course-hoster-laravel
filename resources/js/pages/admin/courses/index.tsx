import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/admin-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2, Hammer } from 'lucide-react';
import { PaginatedResponse, Course } from '@/types';
import Pagination from '@/components/pagination';

interface CoursesIndexProps {
    courses: PaginatedResponse<Course>;
}

export default function CoursesIndex({ courses }: CoursesIndexProps) {
    const breadcrumbs = [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Courses',
            href: '/admin/courses',
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses Management" />
            <div className="flex flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Courses
                    </h2>
                    <Button asChild>
                        <Link href="/admin/courses/create">Add Course</Link>
                    </Button>
                </div>

                <div className="rounded-md border bg-card text-card-foreground shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Instructor</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.data.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">{course.title}</TableCell>
                                    <TableCell>{course.creator?.name}</TableCell>
                                    <TableCell>{course.price} DZD</TableCell>
                                    <TableCell>
                                        <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                                            {course.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/courses/${course.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild title="Course Builder">
                                            <Link href={`/admin/courses/${course.id}/builder`}>
                                                <Hammer className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild title="Edit Course">
                                            <Link href={`/admin/courses/${course.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this course?')) {
                                                    router.delete(`/admin/courses/${course.id}`);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Pagination links={courses.links} />
            </div>
        </AdminLayout>
    );
}
