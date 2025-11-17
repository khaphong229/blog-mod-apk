import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, LoginData, RegisterData } from "@/services/auth.service";
import toast from "react-hot-toast";

/**
 * Hook for user login
 */
export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: () => {
      toast.success("Đăng nhập thành công!");
      router.push("/admin/dashboard");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đăng nhập thất bại");
    },
  });
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login?registered=true");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đăng ký thất bại");
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      toast.success("Đã đăng xuất");
      router.push("/login");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đăng xuất thất bại");
    },
  });
}
