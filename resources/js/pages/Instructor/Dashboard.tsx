import { Head } from '@inertiajs/react';
import InstructorLayout from './instructor-layout';
import type { Course, User } from '@/types';
import { Users } from 'lucide-react';

interface Student extends User {
    progress: number;
}

interface InstructorCourse extends Course {
    lessons_count: number;
    students: Student[];
}

interface Props {
    courses: InstructorCourse[];
}

export default function InstructorDashboard({ courses }: Props) {
    return (
        <InstructorLayout breadcrumbs={[{ title: 'Instructor Dashboard', href: '/instructor/dashboard' }]}>
            <Head title="Instructor Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Instructor Dashboard</h2>
                </div>

                {courses.length === 0 ? (
                    <div className="p-8 text-center border border-dashed rounded-xl">
                        <p className="text-muted-foreground">You haven't created any courses yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {courses.map(course => (
                            <div key={course.id} className="border rounded-xl bg-card p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold">{course.title}</h3>
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Users className="w-4 h-4" /> {course.students.length} Students
                                    </span>
                                </div>

                                {course.students.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No students enrolled yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {course.students.map(student => (
                                            <div key={student.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                        {student.name.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground">{student.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 w-1/3">
                                                    <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all duration-500"
                                                            style={{ width: `${student.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium w-8 text-right">{student.progress}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </InstructorLayout>
    );
}
