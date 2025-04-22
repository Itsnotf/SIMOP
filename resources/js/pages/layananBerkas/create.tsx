import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRef } from 'react';

interface Layanan {
    id: number;
    nama_layanan: string;
    deskripsi_layanan: string;
}

interface JenisBerkas {
    id: number;
    nama_berkas: string;
    kode: string;
}

interface Props {
    layanans: Layanan[];
    jenisBerkas: JenisBerkas[];
}

const formSchema = z.object({
    layanan_id: z.string().min(1, 'Pilih layanan'),
    jenis_berkas_id: z.string().min(1, 'Pilih jenis berkas'),
    template: z.any().refine((file) => file instanceof File || file?.[0] instanceof File, {
        message: 'File template wajib diunggah',
    }),
});

export default function CreateLayananBerkas({ jenisBerkas, layanans }: Props) {
    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            layanan_id: '',
            jenis_berkas_id: '',
            template: undefined,
        },
    });

    const { handleSubmit, setValue } = methods;
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('layanan_id', data.layanan_id);
        formData.append('jenis_berkas_id', data.jenis_berkas_id);
        formData.append('template', data.template[0]);

        router.post('/layanan_berkas', formData);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan Berkas', href: '/layanan_berkas' },
                { title: 'Create', href: '#' },
            ]}
        >
            <Head title="Create Layanan Berkas" />
            <div className="m-10 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Create Layanan Berkas</h1>
                <FormProvider {...methods}>
                    <Form {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
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
                                                    <SelectItem key={layanan.id} value={layanan.id.toString()}>
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
                                control={methods.control}
                                name="jenis_berkas_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pilih Jenis Berkas</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jenis berkas" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {jenisBerkas.map((berkas) => (
                                                    <SelectItem key={berkas.id} value={berkas.id.toString()}>
                                                        {berkas.kode} - {berkas.nama_berkas}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={methods.control}
                                name="template"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Template (PDF/DOCX)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                ref={fileInputRef}
                                                onChange={(e) => setValue('template', e.target.files)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-2">
                                <Button type="submit">Simpan</Button>
                                <Button type="button" onClick={() => router.visit(document.referrer)}>
                                    Kembali
                                </Button>
                            </div>
                        </form>
                    </Form>
                </FormProvider>
            </div>
        </AppLayout>
    );
}
