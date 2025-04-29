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
        title: 'Users',
        href: '/user',
    },
];

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface Props {
    users: User[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function UserIndex({ users, flash }: Props) {
    const [open, setOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setUserToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            destroy(`/user/${userToDelete}`, {
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
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Users</h1>
                    {can('create-user', auth) && (
                        <Link href="/user/create">
                            <Button className="bg-primary">Create User</Button>
                        </Link>
                    )}
                </div>

                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    No users available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="w-[30%]">{user.name}</TableCell>
                                    <TableCell className="w-[30%]">{user.email}</TableCell>
                                    <TableCell className="w-[20%]">{user.roles[0]?.name}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        {can('edit-user', auth) && (
                                            <Link href={`/user/${user.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {can('delete-user', auth) && (
                                            <Button variant="outline" size="sm" color="destructive" onClick={() => handleDelete(user.id)}>
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
                            <h3 className="text-lg font-semibold">Delete User</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Are you sure you want to delete this user?</p>
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
