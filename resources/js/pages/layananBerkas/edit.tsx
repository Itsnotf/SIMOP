import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

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

interface LayananBerkas {
    id: number;
    layanan_id: number;
    jenis_berkas_id: number;
    template: string;
    layanan: {
        nama_layanan: string;
    };
    jenis_berkas: {
        nama_berkas: string;
    };
}

interface Props {
    layanans: Layanan[];
    jenisBerkas: JenisBerkas[];
    layananBerkas: LayananBerkas;
}

const formSchema = z.object({
    layanan_id: z.string().min(1, 'Pilih layanan'),
    jenis_berkas_id: z.string().min(1, 'Pilih jenis berkas'),
    template: z
        .any()
        .optional()
        .superRefine((files, ctx) => {
            if (!files || files.length === 0) return;

            const file = files[0];
            if (!file) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'File template wajib diunggah',
                });
                return;
            }

            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (!allowedTypes.includes(file.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Hanya file PDF atau Word yang diperbolehkan',
                });
            }
        }),
});

export default function EditLayananBerkas({ layanans, jenisBerkas, layananBerkas }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            layanan_id: layananBerkas?.layanan_id.toString() || '',
            jenis_berkas_id: layananBerkas?.jenis_berkas_id.toString() || '',
            template: undefined,
        },
    });

    console.log(layananBerkas);

    const { handleSubmit } = methods;

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('layanan_id', data.layanan_id);
        formData.append('jenis_berkas_id', data.jenis_berkas_id);

        if (data.template && data.template.length > 0) {
            formData.append('template', data.template[0]);
        }

        router.post(`/layanan_berkas/${layananBerkas.id}`, formData, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan Berkas', href: '/layanan_berkas' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit Layanan Berkas" />
            <div className="m-10 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Edit Layanan Berkas</h1>
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
                                render={({ field }) => {
                                    const value = methods.watch('template');
                                    return (
                                        <FormItem>
                                            <FormLabel>Upload Template (PDF/DOCX)</FormLabel>
                                            {layananBerkas.template && (
                                                <div className="mb-2">
                                                    <p className="text-muted-foreground text-sm">Template saat ini:</p>
                                                    <a
                                                        href={`/storage/${layananBerkas.template}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Lihat Template
                                                    </a>
                                                </div>
                                            )}
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.files || undefined);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <div className="flex justify-end space-x-2">
                                <Button type="submit" className="w-fit">
                                    Update
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.visit('/layanan_berkas')}>
                                    Back
                                </Button>
                            </div>
                        </form>
                    </Form>
                </FormProvider>
            </div>
        </AppLayout>
    );
}
