import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/pages/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEventHandler } from 'react';
import { Course } from '@/types';

interface EditCourseProps {
    course: Course;
}

export default function EditCourse({ course }: EditCourseProps) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Courses', href: '/admin/courses' },
        { title: 'Edit', href: `/admin/courses/${course.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: course.title,
        description: course.description || '',
        price: course.price.toString(),
        status: course.status,
        level: course.level,
        thumbnail: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/courses/${course.id}`);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Course" />
            <div className="flex flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Edit Course
                    </h2>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit Details</CardTitle>
                        <CardDescription>Update information for "{course.title}"</CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Advanced Laravel"
                                    required
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Course description..."
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (DZD)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level">Level</Label>
                                    <Select value={data.level} onValueChange={(val) => setData('level', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <Input
                                    id="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('thumbnail', e.target.files ? e.target.files[0] : null)}
                                />
                                {errors.thumbnail && <p className="text-sm text-red-500">{errors.thumbnail}</p>}
                                {course.thumbnail && (
                                    <div className="mt-2">
                                        <p className="text-sm text-muted-foreground mb-1">Current Thumbnail:</p>
                                        <img src={`/storage/${course.thumbnail}`} alt="Current" className="h-20 w-auto rounded border" />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Update Course
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}
