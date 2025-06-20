import AppLayout from '@/layouts/app-layout';
import { EditSettingFormData, NewSettingFormData, Setting, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Check, PencilLine, PlusCircle, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Shadcn UI Components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button'; // Menggunakan Button shadcn/ui
import { Input } from '@/components/ui/input'; // Menggunakan Input shadcn/ui
import { Label } from '@/components/ui/label'; // Menggunakan Label shadcn/ui
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Import AlertDialog components

// Komponen InputError yang disesuaikan dengan styling shadcn/ui
const InputError = ({ message }: { message?: string }) => {
    return message ? <p className="mt-1 text-sm text-destructive">{message}</p> : null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/admin/settings',
    },
];

// Daftar pilihan tipe yang tersedia
const SETTING_TYPES = ['string', 'number', 'boolean', 'json', 'array', 'object'] as const;

export default function Index({ settings }: { settings: Setting[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [settingToDelete, setSettingToDelete] = useState<Setting | null>(null);

    // useForm untuk EDITING
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEditForm,
        clearErrors: clearEditErrors,
    } = useForm<EditSettingFormData>({
        id: null,
        name: '',
        value: '',
        type: SETTING_TYPES[0],
        description: '',
    });

    // useForm untuk ADDING NEW SETTING
    const {
        data: newData,
        setData: setNewData,
        post,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAddForm,
        clearErrors: clearAddErrors,
    } = useForm<NewSettingFormData>({
        name: '',
        value: '',
        type: SETTING_TYPES[0],
        description: '',
    });

    useEffect(() => {
        if (editingId !== null) {
            const settingToEdit = settings.find((s) => s.id === editingId);
            if (settingToEdit) {
                setEditData({
                    id: settingToEdit.id,
                    name: settingToEdit.name,
                    value: settingToEdit.value,
                    type: settingToEdit.type,
                    description: settingToEdit.description,
                });
            }
        } else {
            resetEditForm();
            clearEditErrors();
        }
    }, [editingId, settings, setEditData, resetEditForm, clearEditErrors]);

    const startEdit = (setting: Setting) => {
        setEditingId(setting.id);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = () => {
        put(`/admin/settings/${editData.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
                toast.success('Setting updated successfully!');
            },
            onError: (formErrors) => {
                console.error('Validation errors:', formErrors);
                toast.error('Failed to update setting. Please check the form.');
            },
        });
    };

    const saveNewSetting = () => {
        post('/admin/settings', {
            preserveScroll: true,
            onSuccess: () => {
                resetAddForm();
                clearAddErrors();
                toast.success('Setting added successfully!');
            },
            onError: (formErrors) => {
                console.error('Validation errors:', formErrors);
                toast.error('Failed to add setting. Please check the form.');
            },
        });
    };

    // Fungsi untuk membuka modal konfirmasi hapus
    const confirmDelete = (setting: Setting) => {
        setSettingToDelete(setting); // Simpan data setting yang akan dihapus
        setIsDeleteDialogOpen(true); // Buka modal
    };

    // Fungsi yang akan dipanggil saat konfirmasi hapus di modal
    const executeDelete = () => {
        if (settingToDelete) {
            router.delete(`/admin/settings/${settingToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Setting deleted successfully!');
                    setIsDeleteDialogOpen(false); // Tutup modal setelah sukses
                    setSettingToDelete(null); // Reset data setting yang akan dihapus
                },
                onError: (error) => {
                    console.error('Error deleting setting:', error);
                    toast.error('Failed to delete setting.');
                    setIsDeleteDialogOpen(false); // Tutup modal meskipun ada error
                    setSettingToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Settings" />
            <div className="p-4">
                {/* --- Form Tambah Pengaturan Baru --- */}
                <h2 className="mb-4 text-2xl font-bold">Add New Setting</h2>
                <div className="mb-8 grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm md:grid-cols-5">
                    <div>
                        <Label htmlFor="newName">Key Name</Label>
                        <Input id="newName" value={newData.name} onChange={(e) => setNewData('name', e.target.value)} />
                        <InputError message={addErrors.name} />
                    </div>
                    <div>
                        <Label htmlFor="newValue">Value</Label>
                        <Input id="newValue" value={newData.value || ''} onChange={(e) => setNewData('value', e.target.value)} />
                        <InputError message={addErrors.value} />
                    </div>
                    <div>
                        <Label htmlFor="newType">Type</Label>
                        <Select value={newData.type} onValueChange={(value) => setNewData('type', value as NewSettingFormData['type'])}>
                            <SelectTrigger id="newType">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                {SETTING_TYPES.map((typeOption) => (
                                    <SelectItem key={`add-${typeOption}`} value={typeOption}>
                                        {typeOption}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={addErrors.type} />
                    </div>
                    <div>
                        <Label htmlFor="newDescription">Description</Label>
                        <Input id="newDescription" value={newData.description || ''} onChange={(e) => setNewData('description', e.target.value)} />
                        <InputError message={addErrors.description} />
                    </div>
                    <div className="flex items-end justify-end">
                        <Button onClick={saveNewSetting} disabled={addProcessing}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Setting
                        </Button>
                    </div>
                </div>

                {/* --- Tabel Pengaturan yang Ada --- */}
                <h2 className="mb-4 text-2xl font-bold">Existing Settings</h2>
                <Table>
                    <TableCaption>A list of your application settings.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Key Name</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className="w-[120px]">Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px] text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {settings?.map((setting) => (
                            <TableRow key={setting.id}>
                                <TableCell className="font-medium">
                                    {editingId === setting.id ? (
                                        <>
                                            <Input value={editData.name} onChange={(e) => setEditData('name', e.target.value)} />
                                            <InputError message={editErrors.name} />
                                        </>
                                    ) : (
                                        setting.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === setting.id ? (
                                        <>
                                            <Input value={editData.value || ''} onChange={(e) => setEditData('value', e.target.value)} />
                                            <InputError message={editErrors.value} />
                                        </>
                                    ) : (
                                        setting.value
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === setting.id ? (
                                        <>
                                            <Select
                                                value={editData.type}
                                                onValueChange={(value) => setEditData('type', value as EditSettingFormData['type'])}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SETTING_TYPES.map((typeOption) => (
                                                        <SelectItem key={`edit-${typeOption}`} value={typeOption}>
                                                            {typeOption}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={editErrors.type} />
                                        </>
                                    ) : (
                                        setting.type
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === setting.id ? (
                                        <>
                                            <Input value={editData.description || ''} onChange={(e) => setEditData('description', e.target.value)} />
                                            <InputError message={editErrors.description} />
                                        </>
                                    ) : (
                                        setting.description
                                    )}
                                </TableCell>
                                <TableCell className="flex justify-center gap-2">
                                    {editingId === setting.id ? (
                                        <>
                                            <Button onClick={saveEdit} disabled={editProcessing} variant="outline" size="icon" title="Save">
                                                <Check className="h-4 w-4 text-green-600" />
                                            </Button>
                                            <Button onClick={cancelEdit} disabled={editProcessing} variant="outline" size="icon" title="Cancel">
                                                <X className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => startEdit(setting)} variant="outline" size="icon" title="Edit">
                                                <PencilLine className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button onClick={() => confirmDelete(setting)} variant="destructive" size="icon" title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* --- AlertDialog Konfirmasi Hapus --- */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the setting{' '}
                            {settingToDelete && <span className="font-semibold text-foreground">"{settingToDelete.name}"</span>} from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={executeDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
