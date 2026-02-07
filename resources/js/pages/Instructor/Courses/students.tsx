import { Head, Link } from '@inertiajs/react';
import InstructorLayout from '@/pages/instructor/layouts/instructor-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PaginatedResponse, Course, User } from '@/types';
import Pagination from '@/components/pagination';
import { Users, BookOpen } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface StudentWithProgress extends User {
    completed_lessons_count: number;
    pivot: {
        enrolled_at: string;
    };
}

interface StudentsProps {
    course: Course;
    students: PaginatedResponse<StudentWithProgress>;
    totalLessons: number;
}

export default function Students({ course, students, totalLessons }: StudentsProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Instructor', href: '/instructor/courses' },
        { title: 'Courses', href: '/instructor/courses' },
        { title: course.title, href: `/instructor/courses/${course.id}/builder` },
        { title: 'Students', href: `/instructor/courses/${course.id}/students` },
    ];

    return (
        <InstructorLayout breadcrumbs={breadcrumbs}>
            <Head title={`Students: ${course.title}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <p className="text-muted-foreground mt-1">
                            Student progress and enrollment details
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/instructor/courses/${course.id}/builder`}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium text-sm"
                        >
                            Back to Builder
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{students.total}</div>
                            <p className="text-xs text-muted-foreground">
                                Enrolled in this course
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalLessons}</div>
                            <p className="text-xs text-muted-foreground">
                                Lessons in this course
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Enrolled Students</h3>
                    <div className="rounded-md border bg-card text-card-foreground shadow">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Date Enrolled</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead className="text-right">Completed</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                            No students enrolled yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    students.data.map((student) => {
                                        const progress = totalLessons > 0 ? Math.round((student.completed_lessons_count / totalLessons) * 100) : 0;
                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{student.name}</span>
                                                        <span className="text-sm text-muted-foreground">{student.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(student.pivot.enrolled_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="w-[30%]">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={progress} className="h-2" />
                                                        <span className="text-xs text-muted-foreground w-10">{progress}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {student.completed_lessons_count} / {totalLessons} Lessons
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <Pagination links={students.links} />
                </div>
            </div>
        </InstructorLayout>
    );
}
