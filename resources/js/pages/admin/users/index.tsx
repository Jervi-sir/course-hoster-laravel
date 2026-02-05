import { Head, Link } from '@inertiajs/react';
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
import { Edit, Trash2 } from 'lucide-react';
import { PaginatedResponse, User } from '@/types';
import Pagination from '@/components/pagination';

interface UsersIndexProps {
    users: PaginatedResponse<User>;
}

export default function UsersIndex({ users }: UsersIndexProps) {
    const breadcrumbs = [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Users',
            href: '/admin/users',
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />
            <div className="flex flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Users
                    </h2>
                    <Button asChild>
                        <Link href="/admin/users/create">Add User</Link>
                    </Button>
                </div>

                <div className="rounded-md border bg-card text-card-foreground shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role?.code === 'admin' ? 'destructive' : user.role?.code === 'instructor' ? 'default' : 'secondary'}>
                                            {user.role?.code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/users/${user.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Pagination links={users.links} />
            </div>
        </AdminLayout>
    );
}
