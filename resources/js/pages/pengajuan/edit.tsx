import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

interface Layanan {
    id: number;
    nama_layanan: string;
    deskripsi_layanan: string;
}

interface Pengajuan {
    id: number;
    layanan_id: number;
    perusahaan: string;
    nohp: string;
}

interface Props {
    layanans: Layanan[];
    pengajuan: Pengajuan;
}

const formSchema = z.object({
    layanan_id: z.string().min(1, 'Pilih layanan'),
    perusahaan: z.string().min(1, 'Perusahaan harus diisi'),
    nohp: z.string().min(1, 'No HP harus diisi'),
});

export default function EditPengajuan({ layanans, pengajuan }: Props) {
    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            layanan_id: pengajuan.layanan_id.toString(),
            perusahaan: pengajuan.perusahaan,
            nohp: pengajuan.nohp,
        },
    });

    const { handleSubmit } = methods;

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        router.put(`/pengajuan/${pengajuan.id}`, data);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Pengajuan', href: '/pengajuan' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit Pengajuan" />
            <div className="m-10 flex max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Edit Pengajuan</h1>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={methods.control}
                            name="layanan_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pilih Layanan</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih layanan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {layanans.map((layanan) => (
                                                <SelectItem
                                                    key={layanan.id}
                                                    value={layanan.id.toString()}
                                                >
                                                    {layanan.nama_layanan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="perusahaan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Perusahaan</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="nohp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nomor HP</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button type="submit">Update</Button>
                            <Button type="button" variant="outline" onClick={() => router.visit('/pengajuan')}>
                                Kembali
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </AppLayout>
    );
}
