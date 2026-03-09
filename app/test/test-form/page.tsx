"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { User, Mail, Package } from "lucide-react";
import toast from "react-hot-toast";
import {
  Button,
  FormField,
  SelectField,
  TextArea,
  TextField,
} from "@/components/ui";

// Schema validasi sederhana
const simpleProductSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  category: z.string().min(1, "Pilih kategori"),
  email: z.string().email("Email tidak valid"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

type SimpleProductForm = z.infer<typeof simpleProductSchema>;

export default function SimpleFormExample() {
  const form = useForm<SimpleProductForm>({
    resolver: zodResolver(simpleProductSchema),
    defaultValues: {
      name: "",
      category: "",
      email: "",
      description: "",
    },
  });

  const onSubmit = (data: SimpleProductForm) => {
    console.log("Data:", data);
    toast.success("Form berhasil disubmit!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Form Sederhana
        </h1>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value as string}
                  label="Nama Produk"
                  placeholder="Masukkan nama produk"
                  required
                  leftIcon={Package}
                  error={fieldState.error?.message}
                />
              )}
            />

            <FormField
              name="category"
              render={({ field, fieldState }) => (
                <SelectField
                  {...field}
                  value={field.value as string}
                  label="Kategori"
                  placeholder="Pilih kategori"
                  required
                  error={fieldState.error?.message}
                  options={[
                    { value: "electronics", label: "Elektronik" },
                    { value: "fashion", label: "Fashion" },
                    { value: "food", label: "Makanan" },
                  ]}
                />
              )}
            />

            <FormField
              name="email"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value as string}
                  type="email"
                  label="Email"
                  placeholder="email@example.com"
                  required
                  leftIcon={Mail}
                  error={fieldState.error?.message}
                />
              )}
            />

            <FormField
              name="description"
              render={({ field, fieldState }) => (
                <TextArea
                  {...field}
                  label="Deskripsi"
                  placeholder="Jelaskan produk..."
                  required
                  rows={4}
                  error={fieldState.error?.message}
                />
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" variant="primary" fullWidth>
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
