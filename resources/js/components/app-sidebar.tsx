import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ClipboardPlus, FilePlus, Files, FileStack, Key, LayoutGrid, Mail, Send, ShieldAlert, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: '/user',
        icon: User,
    },
    {
        title: 'Permission',
        href: '/permission',
        icon: Key,
    },
    {
        title: 'Role',
        href: '/role',
        icon: ShieldAlert,
    },
    {
        title: 'Layanan',
        href: '/layanan',
        icon: Mail,
    },
    {
        title: 'Jenis Berkas',
        href: '/jenis_berkas',
        icon: Files,
    },
    {
        title: 'Layanan Berkas',
        href: '/layanan_berkas',
        icon: FileStack,
    },
    {
        title: 'Pengajuan',
        href: '/pengajuan',
        icon: ClipboardPlus,
    },
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
