import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PaginatedResponse, Course, User } from '@/types';
import { Progress } from '@/components/ui/progress';

interface StudentWithProgress extends User {
    completed_lessons_count: number;
    pivot: {
        enrolled_at: string;
    };
}

interface CourseShowProps {
    course: Course;
    students: PaginatedResponse<StudentWithProgress>;
    totalLessons: number;
}

export default function CourseShow({ course, students, totalLessons }: CourseShowProps) {
    const breadcrumbs = [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Courses',
            href: '/admin/courses',
        },
        {
            title: course.title,
            href: `/admin/courses/${course.id}`,
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Course: ${course.title}`} />
            <div className="flex flex-col gap-6 p-4 pt-0">

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div><span className="font-semibold">Title:</span> {course.title}</div>
                            <div><span className="font-semibold">Instructor:</span> {course.creator?.name}</div>
                            <div><span className="font-semibold">Price:</span> {course.price} DZD</div>
                            <div><span className="font-semibold">Status:</span>
                                <Badge className="ml-2" variant={course.status === 'published' ? 'default' : 'secondary'}>
                                    {course.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div><span className="font-semibold">Total Lessons:</span> {totalLessons}</div>
                            <div><span className="font-semibold">Enrolled Students:</span> {students.total}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Enrolled Students</h3>
                    <div className="rounded-md border bg-card text-card-foreground shadow">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Enrolled At</TableHead>
                                    <TableHead>Progress</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                            No students enrolled.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    students.data.map((student) => {
                                        const progress = totalLessons > 0 ? Math.round((student.completed_lessons_count / totalLessons) * 100) : 0;
                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-medium">{student.name}</TableCell>
                                                <TableCell>{student.email}</TableCell>
                                                <TableCell>{new Date(student.pivot.enrolled_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="w-[200px]">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={progress} className="h-2" />
                                                        <span className="text-xs text-muted-foreground">{progress}%</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
