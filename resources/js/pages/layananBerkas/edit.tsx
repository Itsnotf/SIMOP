import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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


interface Props {
    layanan: Layanan;
}

const formSchema = z.object({
    nama_layanan: z.string().min(1, 'Layanan name is required'),
    deskripsi_layanan: z.string().min(1, 'Layanan deskripsi is required'),
});

export default function EditLayananBerkas({ layanan }: Props) {
    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama_layanan: layanan.nama_layanan,
            deskripsi_layanan: layanan.deskripsi_layanan,
        },
    });

    const { handleSubmit } = methods;


    const onSubmit = (data: z.infer<typeof formSchema>) => {
        router.put(`/layanan/${layanan.id}`, data);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan', href: '/layanan' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit layanan" />
            <div className="m-10 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Edit layanan</h1>
                <FormProvider {...methods}>
                    <Form {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="nama_layanan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Layanan</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="deskripsi_layanan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi Layanan</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-2">
                                <Button type="submit" className="w-fit">
                                    Update
                                </Button>
                                <Button type="button" onClick={() => router.visit(document.referrer)}>
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
