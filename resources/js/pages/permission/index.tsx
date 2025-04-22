import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
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
            toast.success(flash.success); // Show success toast if available
        }

        if (flash.error) {
            toast.error(flash.error); // Show error toast if available
        }
    }, [flash]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Permissions</h1>
                    <Link href="/permission/create">
                        <Button className="bg-primary">Create Permission</Button>
                    </Link>
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
                                    <TableCell className='w-[80%]'>{permission.name}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        <Link href={`/permission/${permission.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            color="destructive"
                                            onClick={() => handleDelete(permission.id)}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Dialog for confirming delete */}
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
