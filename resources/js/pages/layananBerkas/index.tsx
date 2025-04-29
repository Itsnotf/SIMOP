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
        title: 'Layanan Berkas',
        href: '/layanan_berkas',
    },
];

interface LayananBerkas {
    id: number;
    layanan: {
        id: number;
        nama_layanan: string;
    };
    jenis_berkas: {
        id: number;
        nama_berkas: string;
        kode: string;
    };
    template: string;
}

interface Props {
    layananBerkas: LayananBerkas[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function LayananBerkasIndex({ layananBerkas, flash }: Props) {
    const [open, setOpen] = useState(false);
    const [berkasToDelete, setBerkasToDelete] = useState<number | null>(null);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setBerkasToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (berkasToDelete) {
            destroy(`/layanan_berkas/${berkasToDelete}`, {
                onSuccess: () => {
                    setOpen(false);
                    toast.success('Layanan Berkas berhasil dihapus');
                },
            });
        }
    };

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
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
            <Head title="Layanan Berkas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Layanan Berkas</h1>
                    {can('create-layananBerkas', auth) && (
                        <Link href="/layanan_berkas/create">
                            <Button className="bg-primary">Create Layanan Berkas</Button>
                        </Link>
                    )}
                </div>

                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Layanan</TableHead>
                            <TableHead>Jenis Berkas</TableHead>
                            <TableHead>Template</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {layananBerkas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    Tidak ada data Layanan Berkas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            layananBerkas.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.layanan?.nama_layanan}</TableCell>
                                    <TableCell>
                                        {item.jenis_berkas?.kode} - {item.jenis_berkas?.nama_berkas}
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={`/storage/${item.template}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            Lihat Template
                                        </a>
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        {can('edit-layananBerkas', auth) && (
                                            <Link href={`/layanan_berkas/${item.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}

                                        {can('delete-layananBerkas', auth) && (
                                            <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
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
                            <h3 className="text-lg font-semibold">Hapus Layanan Berkas</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Apakah kamu yakin ingin menghapus data ini?</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Batal
                            </Button>
                            <Button className="bg-red-600 text-white" onClick={confirmDelete}>
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
