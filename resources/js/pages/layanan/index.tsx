import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Layanan',
        href: '/layanan',
    },
];

interface Layanan {
    id: number;
    nama_layanan: string;
    deskripsi_layanan: string;
}

interface Props {
    layanans: Layanan[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function LayananIndex({ flash, layanans }: Props) {
    const [open, setOpen] = useState(false);
    const [layananDelete, setRoleToDelete] = useState<number | null>(null);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setRoleToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (layananDelete) {
            destroy(`/layanan/${layananDelete}`, {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layanan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Layanan</h1>
                    <Link href="/layanan/create">
                        <Button className="bg-primary">Create Layanan</Button>
                    </Link>
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
                        {layanans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={100} className="text-center">
                                    No layanans available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            layanans.map((layanan) => (
                                <TableRow key={layanan.id}>
                                    <TableCell className="w-[30%]">{layanan.nama_layanan}</TableCell>
                                    <TableCell className="w-[50%]">{layanan.deskripsi_layanan}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        <Link href={`/layanan/${layanan.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            color="destructive"
                                            onClick={() => handleDelete(layanan.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
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
                            <h3 className="text-lg font-semibold">Delete Layanan</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Are you sure you want to delete this layanan?</p>
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
