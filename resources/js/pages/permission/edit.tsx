import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

interface Props {
    permission: {
        id: number;
        name: string;
    };
}

// Validasi pakai zod
const formSchema = z.object({
    name: z.string().min(1, 'Permission name is required'),
});

export default function EditPermission({ permission }: Props) {
    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: permission.name,
        },
    });

    const { handleSubmit } = methods;

    const onSubmit = (data: { name: string }) => {
        router.put(`/permission/${permission.id}`, data);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Permissions', href: '/permission' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit Permission" />

            <div className="m-10 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border-[1px] p-4">
                <h1 className="text-xl font-semibold">Edit Permission</h1>
                <FormProvider {...methods}>
                    <Form {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="name">Permission Name</Label>
                                        <FormControl>
                                            <Input id="name" {...field} />
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
