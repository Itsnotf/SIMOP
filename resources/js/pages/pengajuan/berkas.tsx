import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

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
    jenis_berkas: JenisBerkas;
  }


interface Props {
  pengajuan: Pengajuan;
  layananBerkas: LayananBerkas[];
  pengajuanBerkas: PengajuanBerkas[];
}

export default function PengajuanBerkasPage({
  pengajuan,
  layananBerkas,
  pengajuanBerkas,
}: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const pengajuanBerkasMap = pengajuanBerkas.reduce<
    Record<number, PengajuanBerkas>
  >((acc, item) => {
    acc[item.jenis_berkas_id] = item;
    return acc;
  }, {});

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    jenisBerkasId: number
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoadingId(jenisBerkasId);

    router.post(
      `/pengajuan/${pengajuan.id}/berkas/${jenisBerkasId}`,
      formData,
      {
        onFinish: () => setLoadingId(null),
        preserveScroll: true,
      }
    );
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Pengajuan', href: '/pengajuan' },
        { title: 'Berkas', href: '#' },
      ]}
    >
      <Head title="Berkas" />

      <div className="p-4 space-y-4">
        {layananBerkas.map((item) => {
          const existing = pengajuanBerkasMap[item.jenis_berkas_id];

          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-base">
                  <span>{item.jenis_berkas.kode} - {item.jenis_berkas.nama_berkas}</span>
                  {item.template && (
                    <a
                      href={`/storage/${item.template}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Lihat Template
                    </a>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {existing && (
                  <div className="mb-4 text-sm space-y-1">
                    <div>
                      <strong>Status</strong> <Badge>{existing.status}</Badge>
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
                    <Separator className="my-2" />
                  </div>
                )}

                <form
                  onSubmit={(e) => handleSubmit(e, item.jenis_berkas_id)}
                  className="space-y-3"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`file-${item.id}`}>Upload File</Label>
                    <Input
                      type="file"
                      name="file"
                      id={`file-${item.id}`}
                      required
                      accept="application/pdf,image/*"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loadingId === item.jenis_berkas_id}
                  >
                    {loadingId === item.jenis_berkas_id
                      ? 'Mengunggah...'
                      : 'Upload'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
