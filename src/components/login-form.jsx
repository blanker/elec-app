import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2, LogIn } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useShallow } from 'zustand/react/shallow'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router";

import useUserStore from "@/store/useUserStore"

const FormSchema = z.object({
  phone: z.string().min(11, {
    message: "手机号是11位.",
  }).max(11, {
    message: "手机号是11位.",
  }),
  password: z.string().min(6, {
    message: "密码至少6位.",
  }),
})

export function LoginForm({
  className,
  ...props
}) {
  let navigate = useNavigate();

  const { user, login, error, loading } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      login: state.login,
      error: state.error,
      loading: state.loading,
    }))
  );

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  })

  async function onSubmit(data) {
    if (await login(data)) {
      navigate("/");
    }
  }

  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle
            className='flex flex-row items-center gap-2'
          >登录<LogIn className="h-5 w-5" /></CardTitle>

          {/* 放一个合适的图标 */}

          <CardAction>
            <img src='/electricity-icon.svg' alt='electricity' className='h-5 w-5' />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>手机号</FormLabel>
                    <FormControl>
                      <Input placeholder="139xxxx" {...field} />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="密码" {...field} />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin" />}
                登录
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          {/* 文字居中 */}

          <div className='w-full text-center text-red-600'>{error}</div>
        </CardFooter>
      </Card>
    </div>)
  );
}
