"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterInput, registerSchema } from "@/lib/validations/auth";
import { useRegister } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng ký</CardTitle>
        <CardDescription>
          Tạo tài khoản mới để bắt đầu sử dụng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nguyễn Văn A"
              {...register("name")}
              disabled={registerMutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register("email")}
              disabled={registerMutation.isPending}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={registerMutation.isPending}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              disabled={registerMutation.isPending}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng ký
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Đã có tài khoản? </span>
            <Link href="/login" className="text-primary hover:underline">
              Đăng nhập
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
