import React from 'react'
import { IconPlus } from "@tabler/icons-react" // 添加 IconPlus
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    id: z.string().min(18, {
        message: '账号长度是18'
    }).max(18, {
        message: '账号长度是18'
    }),
    name: z.string().min(2, {
        message: '名称最少2位'
    }).max(100, {
        message: '名称最多50位'
    }),
})

export default function NewTenant() {
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            name: "",
        },
    })
    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <>


            <Dialog>
                <DialogTrigger>
                    <Button>
                        <IconPlus className="mr-1" size={18} />
                        新增
                    </Button>
                </DialogTrigger>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>新增租户</DialogTitle>
                            <DialogDescription>

                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>账号</FormLabel>
                                            <FormControl>
                                                <Input placeholder="xxxx" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>名称</FormLabel>
                                            <FormControl>
                                                <Input placeholder="xxxx" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">提交</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </DialogPortal>

            </Dialog>
        </>
    );
}