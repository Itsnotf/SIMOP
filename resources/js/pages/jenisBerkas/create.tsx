import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

interface JenisBerkas {
    id: number;
    nama_berkas: string;
    kode: string;
}

interface Props {
    layanans: JenisBerkas[];
}

const formSchema = z.object({
    nama_berkas: z.string().min(1, 'Jenis Berkas Name is required'),
    kode: z.string().min(1, 'Jenis Berkas kode is required'),
});

export default function CreateLayanan() {
    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama_berkas: '',
            kode: '',
        },
    });

    const { handleSubmit } = methods;

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        router.post('/jenis_berkas', data);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Jenis Berkas', href: '/jenis_berkas' },
                { title: 'Create', href: '#' },
            ]}
        >
            <Head title="Create Jenis Berkas" />
            <div className="m-10 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Create Jenis Berkas</h1>
                <FormProvider {...methods}>
                    <Form {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="nama_berkas"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Berkas</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="kode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kode Berkas</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-2">
                                <Button type="submit">Save</Button>
                                <Button type='button' onClick={() => router.visit(document.referrer)}>Back</Button>{' '}
                            </div>
                        </form>
                    </Form>
                </FormProvider>
            </div>
        </AppLayout>
    );
}
