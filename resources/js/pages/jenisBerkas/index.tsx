import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { can } from '@/utils/permission';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jenis Berkas',
        href: '/jenis_berkas',
    },
];

interface JenisBerkas {
    id: number;
    nama_berkas: string;
    kode: string;
}

interface Props {
    JenisBerkas: JenisBerkas[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function LayananIndex({ flash, JenisBerkas }: Props) {
    const [open, setOpen] = useState(false);
    const [jenisBerkasDelete, setRoleToDelete] = useState<number | null>(null);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setRoleToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (jenisBerkasDelete) {
            destroy(`/jenis_berkas/${jenisBerkasDelete}`, {
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
            <Head title="Jenis Berkas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Jenis Berkas</h1>
                    {can('create-jenisBerkas', auth) && (
                        <Link href="/jenis_berkas/create">
                            <Button className="bg-primary">Create Jenis Berkas</Button>
                        </Link>
                    )}
                </div>

                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {JenisBerkas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={100} className="text-center">
                                    Tidak ada Jenis Berkas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            JenisBerkas.map((jenis_berkas) => (
                                <TableRow key={jenis_berkas.id}>
                                    <TableCell className="w-[30%]">{jenis_berkas.nama_berkas}</TableCell>
                                    <TableCell className="w-[50%]">{jenis_berkas.kode}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        {can('edit-jenisBerkas', auth) && (
                                            <Link href={`/jenis_berkas/${jenis_berkas.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}

                                        {can('delete-jenisBerkas', auth) && (
                                            <Button variant="outline" size="sm" color="destructive" onClick={() => handleDelete(jenis_berkas.id)}>
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
                            <h3 className="text-lg font-semibold">Delete Jenis Berkas</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Are you sure you want to delete this jenis berkas?</p>
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
