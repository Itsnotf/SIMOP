import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Edit, FileUp, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'; // Add this import
import { can } from '@/utils/permission';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan',
        href: '/pengajuan',
    },
];

interface Pengajuan {
    id: number;
    user: {
        id: number;
        name: string;
    };
    layanan: {
        id: number;
        nama_layanan: string;
        deskripsi_layanan: string;
    };
    status: string;
    perusahaan: string;
    nohp: string;
}

interface Props {
    pengajuan: Pengajuan[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function PengajuanIndex({ pengajuan: initialPengajuan, flash }: Props) {
    const [open, setOpen] = useState(false);
    const [pengajuanToDelete, setPengajuanToDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPengajuan, setFilteredPengajuan] = useState<Pengajuan[]>(initialPengajuan);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        setPengajuanToDelete(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (pengajuanToDelete) {
            destroy(`/pengajuan/${pengajuanToDelete}`, {
                onSuccess: () => {
                    setOpen(false);
                    toast.success('Pengajuan berhasil dihapus');
                },
            });
        }
    };

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        const results = initialPengajuan.filter(item => {
            return (
                item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.layanan.nama_layanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.nohp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredPengajuan(results);
    }, [searchTerm, initialPengajuan]);

    const page = usePage().props as {
        auth?: {
            permissions: string[];
            roles?: string[];
        };
    };

    const auth = page.auth ?? { permissions: [] };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Daftar Pengajuan</h1>
                    {can('create-pengajuan', auth) && (
                        <Link href="/pengajuan/create">
                            <Button className="bg-primary">Create Pengajuan</Button>
                        </Link>
                    )}
                </div>

                <div className="w-full md:w-1/3">
                    <Input
                        type="text"
                        placeholder="Cari pengajuan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama User</TableHead>
                            <TableHead>Nama Layanan</TableHead>
                            <TableHead>Perusahaan</TableHead>
                            <TableHead>No HP</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPengajuan.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    {searchTerm ? 'Tidak ada hasil pencarian' : 'Tidak ada data pengajuan.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPengajuan.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.user.name}</TableCell>
                                    <TableCell>{item.layanan.nama_layanan}</TableCell>
                                    <TableCell>{item.perusahaan}</TableCell>
                                    <TableCell>{item.nohp}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.status}</Badge>
                                    </TableCell>
                                    <TableCell className="flex space-x-2">
                                        {can('edit-pengajuan', auth) && (
                                            <Link href={`/pengajuan/${item.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {can('berkas-pengajuan', auth) && (
                                            <Link href={`/pengajuan/${item.id}/berkas`}>
                                                <Button variant="outline" size="sm">
                                                    <FileUp className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {can('delete-pengajuan', auth) && (
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
                            <h3 className="text-lg font-semibold">Hapus Pengajuan</h3>
                        </DialogHeader>
                        <div className="mt-4">
                            <p>Apakah Anda yakin ingin menghapus pengajuan ini?</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Batal
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
