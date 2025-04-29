import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { can } from '@/utils/permission';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
];

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permissions: Permission[];
}

interface Props {
    permissions: Permission[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function Permissions({ permissions, flash }: Props) {
    const [open, setOpen] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setPermissionToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (permissionToDelete) {
            destroy(`/permission/${permissionToDelete}`, {
                onSuccess: () => {
                    setOpen(false);
                },
            });
        }
    };

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const page = usePage().props as {
        auth?: {
            permissions: string[];
            roles?: string[];
        };
    };

    const auth = page.auth ?? { permissions: [] };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Permissions</h1>
                    {can('create-permission', auth) && (
                        <Link href="/permission/create">
                            <Button className="bg-primary">Create Permission</Button>
                        </Link>
                    )}
                </div>

                {/* Table of permissions */}
                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">
                                    No permissions available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            permissions.map((permission) => (
                                <TableRow key={permission.id}>
                                    <TableCell className="w-[80%]">{permission.name}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        {can('edit-permission', auth) && (
                                            <Link href={`/permission/${permission.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {can('delete-permission', auth) && (
                                            <Button variant="outline" size="sm" color="destructive" onClick={() => handleDelete(permission.id)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger />
                    <DialogContent>
                        <DialogHeader>
                            <h3 className="text-lg font-semibold">Delete Permission</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Are you sure you want to delete this permission?</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button color="destructive" onClick={confirmDelete}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
