import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/utils/permission';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface JenisBerkas {
    id: number;
    nama_berkas: string;
    kode: string;
}

export interface LayananBerkas {
    id: number;
    layanan_id: number;
    jenis_berkas_id: number;
    jenis_berkas: JenisBerkas;
    template: string | null;
}

export interface Pengajuan {
    id: number;
}

export interface PengajuanBerkas {
    id: number;
    pengajuan_id: number;
    jenis_berkas_id: number;
    file: string | null;
    status: string;
    keterangan: string;
    jenis_berkas: JenisBerkas;
}

interface Props {
    pengajuan: Pengajuan;
    layananBerkas: LayananBerkas[];
    pengajuanBerkas: PengajuanBerkas[];
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function PengajuanBerkasPage({ pengajuan, layananBerkas, pengajuanBerkas, flash }: Props) {
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [validationDialogOpen, setValidationDialogOpen] = useState(false);
    const [currentBerkasId, setCurrentBerkasId] = useState<number | null>(null);
    const [keterangan, setKeterangan] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pengajuanBerkasMap = pengajuanBerkas.reduce<Record<number, PengajuanBerkas>>((acc, item) => {
        acc[item.jenis_berkas_id] = item;
        return acc;
    }, {});

    const handleValidation = (berkasId: number) => {
        setCurrentBerkasId(berkasId);
        setValidationDialogOpen(true);
    };

    const submitValidation = async (status: 'approved' | 'rejected') => {
        if (status === 'rejected' && !keterangan.trim()) {
            toast('Keterangan wajib diisi untuk penolakan');
            return;
        }

        setIsSubmitting(true);

        try {
            await router.post(
                `/pengajuan/${pengajuan.id}/berkas/${currentBerkasId}/validate`,
                {
                    status,
                    keterangan: status === 'rejected' ? keterangan : null,
                },
                {
                    preserveScroll: true,
                },
            );

            setValidationDialogOpen(false);
            setKeterangan('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, jenisBerkasId: number) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setLoadingId(jenisBerkasId);

        router.post(`/pengajuan/${pengajuan.id}/berkas/${jenisBerkasId}`, formData, {
            onFinish: () => setLoadingId(null),
            preserveScroll: true,
        });
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
        <AppLayout
            breadcrumbs={[
                { title: 'Pengajuan', href: '/pengajuan' },
                { title: 'Berkas', href: '#' },
            ]}
        >
            <Head title="Berkas" />

            <Dialog open={validationDialogOpen} onOpenChange={setValidationDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Validasi Berkas</DialogTitle>
                        <DialogDescription>Berikan keterangan validasi untuk berkas ini</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Textarea
                            placeholder="Masukkan keterangan (wajib jika ditolak)"
                            value={keterangan}
                            onChange={(e) => setKeterangan(e.target.value)}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => submitValidation('rejected')} disabled={isSubmitting}>
                                Tolak
                            </Button>
                            <Button onClick={() => submitValidation('approved')} disabled={isSubmitting}>
                                Setujui
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="space-y-4 p-4">
                {layananBerkas.map((item) => {
                    const existing = pengajuanBerkasMap[item.jenis_berkas_id];
                    const isApproved = existing?.status === 'approved';
                    const isRejected = existing?.status === 'rejected';

                    return (
                        <Card key={item.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-base">
                                    <span>
                                        {item.jenis_berkas.kode} - {item.jenis_berkas.nama_berkas}
                                    </span>
                                    <div className="space-x-5">
                                        {item.template && (
                                            <Button variant={'outline'}>
                                                <a href={`/storage/${item.template}`} target="_blank" rel="noopener noreferrer" className="text-sm">
                                                    Lihat Template
                                                </a>
                                            </Button>
                                        )}
                                        {!isApproved && can('validasi-berkas', auth) && (
                                            <Button className="text-sm" onClick={() => handleValidation(item.jenis_berkas_id)}>
                                                Validasi
                                            </Button>
                                        )}
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {existing && (
                                    <div className="mb-4 space-y-1 text-sm">
                                        <div>
                                            <strong>Status</strong>{' '}
                                            <Badge variant={isApproved ? 'default' : isRejected ? 'destructive' : 'outline'}>{existing.status}</Badge>
                                        </div>
                                        {existing.file && (
                                            <div>
                                                <strong>File:</strong>{' '}
                                                <a
                                                    href={`/storage/${existing.file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    Lihat File
                                                </a>
                                            </div>
                                        )}
                                        {isRejected && existing.keterangan && (
                                            <div>
                                                <strong>Alasan Penolakan:</strong> {existing.keterangan}
                                            </div>
                                        )}
                                        <Separator className="my-2" />
                                    </div>
                                )}

                                {!isApproved && (
                                    <form onSubmit={(e) => handleSubmit(e, item.jenis_berkas_id)} className="space-y-3">
                                        <div className="space-y-2">
                                            <Label htmlFor={`file-${item.id}`}>Upload File</Label>
                                            <Input type="file" name="file" id={`file-${item.id}`} required accept="application/pdf,image/*" />
                                        </div>

                                        <Button type="submit" disabled={loadingId === item.jenis_berkas_id}>
                                            {loadingId === item.jenis_berkas_id ? 'Mengunggah...' : 'Upload'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </AppLayout>
    );
}
