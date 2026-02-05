import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import AppLogo from '@/components/app-logo';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import type { AppLayoutProps, NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function InstructorLayout({
    children,
    breadcrumbs = [],
    title,
}: AppLayoutProps & { title?: string }) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    return (
        <AppShell variant="sidebar">
            <InstructorSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <Toaster />
        </AppShell>
    );
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/instructor/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Courses',
        href: '/instructor/courses',
        icon: BookOpen,
    },
];

function InstructorSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/instructor/dashboard" prefetch>
                                <AppLogo title="Instructor" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
