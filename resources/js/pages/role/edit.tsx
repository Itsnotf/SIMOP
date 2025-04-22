import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Props {
    role: Role;
    permissions: Permission[];
}

const formSchema = z.object({
    name: z.string().min(1, 'Role name is required'),
    permissions: z.array(z.number()).min(1, 'Select at least one permission'),
});

export default function EditRole({ role, permissions }: Props) {
    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: role.name,
            permissions: role.permissions.map((p) => p.id),
        },
    });

    const { handleSubmit, watch, setValue } = methods;
    const selectedPermissions = watch('permissions');

    const togglePermission = (id: number) => {
        const updated = selectedPermissions.includes(id) ? selectedPermissions.filter((pid) => pid !== id) : [...selectedPermissions, id];

        setValue('permissions', updated);
    };

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        router.put(`/role/${role.id}`, data);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Role', href: '/role' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit Role" />
            <div className="m-10 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Edit Role</h1>
                <FormProvider {...methods}>
                    <Form {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="permissions"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Select Permissions</FormLabel>
                                        <div className="grid grid-cols-2 gap-2">
                                            {permissions.map((permission) => (
                                                <FormControl key={permission.id}>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`permission-${permission.id}`}
                                                            checked={selectedPermissions.includes(permission.id)}
                                                            onCheckedChange={() => togglePermission(permission.id)}
                                                        />
                                                        <label htmlFor={`permission-${permission.id}`} className="text-sm">
                                                            {permission.name}
                                                        </label>
                                                    </div>
                                                </FormControl>
                                            ))}
                                        </div>
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
