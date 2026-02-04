import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Course } from '@/types';

interface CheckoutProps {
    course: Course;
}

export default function Checkout({ course }: CheckoutProps) {
    const breadcrumbs = [
        { title: 'Courses', href: '/courses' },
        { title: course.title, href: `/courses/${course.slug}` },
        { title: 'Checkout', href: `/courses/${course.slug}/checkout` },
    ];

    const { post, processing } = useForm();

    const handleConfirm = () => {
        post(`/courses/${course.id}/pay`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Checkout - ${course.title}`} />
            <div className="flex flex-col gap-8 p-4 md:p-8 max-w-3xl mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>Review your purchase details before proceeding to payment.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-4 border-b">
                            <span className="font-medium text-lg">{course.title}</span>
                            <span className="font-bold text-lg">${course.price}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                            <span>Subtotal</span>
                            <span>${course.price}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-xl pt-4 border-t mt-4">
                            <span>Total</span>
                            <span>${course.price}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full text-lg py-6"
                            size="lg"
                            onClick={handleConfirm}
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : 'Confirm & Pay with Chargily'}
                        </Button>
                    </CardFooter>
                </Card>
                <div className="text-center text-sm text-muted-foreground">
                    Secured by Chargily Payment Gateway
                </div>
            </div>
        </AppLayout>
    );
}
