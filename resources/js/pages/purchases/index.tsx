import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Order, PaginatedResponse } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Calendar, CreditCard, ExternalLink } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase History',
        href: '/purchases',
    },
];

interface PurchasesIndexProps {
    orders: PaginatedResponse<Order>;
}

export default function PurchasesIndex({ orders }: PurchasesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase History" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">Purchase History</h2>
                    <p className="text-muted-foreground">
                        View your past orders and download invoices.
                    </p>
                </div>

                <div className="flex flex-1 flex-col">
                    {orders.data.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <CreditCard className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">No orders found</h3>
                            <p className="text-muted-foreground mb-4 max-w-sm">
                                You haven't made any purchases yet. Once you enroll in a course, your order details will appear here.
                            </p>
                            <Link
                                href="/courses"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                            >
                                Browse Courses
                            </Link>
                        </Card>
                    ) : (
                        <div className="rounded-md border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                #{order.id.toString().padStart(6, '0')}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {order.course ? (
                                                    <div className="flex flex-col">
                                                        <span>{order.course.title}</span>
                                                        <span className="text-xs text-muted-foreground hidden sm:inline">Transaction: {order.transaction_id}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic">Course Unavailable</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-mono">
                                                    {order.amount_paid} {order.currency}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        order.status === 'completed'
                                                            ? 'default' // We might need a generic success variant, for now default/secondary
                                                            : order.status === 'pending'
                                                                ? 'secondary'
                                                                : 'destructive'
                                                    }
                                                    className={
                                                        order.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200' : ''
                                                    }
                                                >
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {order.course && (
                                                        <Link
                                                            href={`/courses/${order.course.slug}`}
                                                            className="text-muted-foreground hover:text-foreground"
                                                            title="View Course"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                            <span className="sr-only">View Course</span>
                                                        </Link>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
