import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

// Import ShadCN Select components
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number; // Make sure you have role_id as a number for selection
}

interface Props {
    user: User;
    roles: Role[];
    currentRole: number; // The role that should be pre-selected
}

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role_id: z.number().min(1, 'Role is required'),
});

export default function EditUser({ user, roles, currentRole }: Props) {
    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            role_id: currentRole, // Default the role to the current user's role
        },
    });

    const { handleSubmit } = methods;

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        router.put(`/user/${user.id}`, data); // Assuming PUT request to update user
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Users', href: '/user' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit User" />
            <div className="m-10 flex max-h-fit max-w-full flex-1 flex-col gap-4 rounded-xl border p-4">
                <h1 className="text-xl font-semibold">Edit User</h1>
                <FormProvider {...methods}>
                    <Form {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name Field */}
                            <FormField
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email Field */}
                            <FormField
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="role_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Role</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value ? field.value.toString() : ''} // Check if field.value is null or undefined
                                                onValueChange={(value) => field.onChange(Number(value))} // Convert value to number before updating the form state
                                            >
                                                <SelectTrigger className="input">
                                                    <span>{roles.find((role) => role.id === field.value)?.name || 'Select Role'}</span>
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.id.toString()}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
