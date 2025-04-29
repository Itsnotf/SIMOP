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
        title: 'Role',
        href: '/role',
    },
];

interface Role {
    id: number;
    name: string;
}

interface Props {
    roles: Role[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function RoleIndex({ roles, flash }: Props) {
    const [open, setOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setRoleToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (roleToDelete) {
            destroy(`/role/${roleToDelete}`, {
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
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Roles</h1>
                    {can('create-role', auth) && (
                        <Link href="/role/create">
                            <Button className="bg-primary">Create Role</Button>
                        </Link>
                    )}
                </div>

                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">
                                    No roles available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            roles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="w-[80%]">{role.name}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        {can('edit-role', auth) && (
                                            <Link href={`/role/${role.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {can('delete-role', auth) && (
                                            <Button variant="outline" size="sm" color="destructive" onClick={() => handleDelete(role.id)}>
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
                            <h3 className="text-lg font-semibold">Delete Role</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Are you sure you want to delete this role?</p>
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
