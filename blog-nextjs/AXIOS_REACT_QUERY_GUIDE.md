# 📡 Axios & React Query Integration Guide

## Tổng quan

Dự án đã được refactor để sử dụng:
- **Axios** - HTTP client với interceptors
- **React Query (TanStack Query)** - Data fetching & caching
- **react-hot-toast** - Notifications

### Lợi ích:

✅ **Axios:**
- Request/Response interceptors
- Automatic JSON parsing
- Better error handling
- Request cancellation
- Base URL configuration

✅ **React Query:**
- Automatic caching
- Background refetching
- Optimistic updates
- Retry logic
- Loading & error states
- DevTools for debugging

---

## 📁 Cấu trúc Files

```
src/
├── lib/
│   └── axios.ts                    # Axios instance với interceptors
├── services/
│   └── auth.service.ts             # Auth API service functions
├── hooks/
│   ├── useAuth.ts                  # Custom React Query hooks
│   └── useCurrentUser.ts           # Session hook
├── components/
│   ├── providers/
│   │   ├── QueryProvider.tsx       # React Query Provider
│   │   └── ToastProvider.tsx       # Toast notifications
│   └── auth/
│       ├── LoginForm.tsx          # Refactored with useLogin
│       └── RegisterForm.tsx       # Refactored with useRegister
```

---

## 🔧 Axios Configuration

### lib/axios.ts

```typescript
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || "Đã có lỗi xảy ra";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
```

---

## 📦 Service Layer Pattern

### services/auth.service.ts

```typescript
import axios from "@/lib/axios";
import { signIn, signOut } from "next-auth/react";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  async register(data: RegisterData) {
    const response = await axios.post("/api/register", data);
    return response.data;
  }

  async login(data: LoginData) {
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    return { ok: result?.ok || false };
  }

  async logout() {
    await signOut({ redirect: false });
  }
}

export const authService = new AuthService();
```

**Pattern:**
- Mỗi service là một class
- Export singleton instance
- Tất cả API calls qua axios instance
- Return typed responses

---

## 🎣 Custom Hooks với React Query

### hooks/useAuth.ts

```typescript
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: () => {
      toast.success("Đăng nhập thành công!");
      router.push("/admin/dashboard");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data) => authService.register(data),
    onSuccess: () => {
      toast.success("Đăng ký thành công!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
```

**Benefits:**
- Centralized mutation logic
- Automatic loading states
- Built-in error handling
- Toast notifications
- Type-safe

---

## 💻 Sử dụng trong Components

### Before (fetch API):

```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");

const onSubmit = async (data) => {
  setIsLoading(true);
  setError("");

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error);
      return;
    }

    router.push("/login");
  } catch (error) {
    setError("Error occurred");
  } finally {
    setIsLoading(false);
  }
};
```

### After (React Query + Axios):

```typescript
const registerMutation = useRegister();

const onSubmit = (data) => {
  registerMutation.mutate(data);
};

// In JSX:
<Button disabled={registerMutation.isPending}>
  {registerMutation.isPending && <Loader2 className="animate-spin" />}
  Đăng ký
</Button>
```

**Improvements:**
- ✅ No manual loading state
- ✅ No manual error state
- ✅ Automatic toast notifications
- ✅ Less code
- ✅ Better UX

---

## 🎨 React Query Configuration

### components/providers/QueryProvider.tsx

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute
      gcTime: 5 * 60 * 1000,       // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

**Options:**
- `staleTime`: Data considered fresh for 1 minute
- `gcTime`: Cache kept for 5 minutes
- `refetchOnWindowFocus`: Disabled (prevent unnecessary refetches)
- `retry`: Retry failed requests once

---

## 🔔 Toast Notifications

### components/providers/ToastProvider.tsx

```typescript
<Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    success: { iconTheme: { primary: "#10B981" } },
    error: { iconTheme: { primary: "#EF4444" } },
  }}
/>
```

**Usage in hooks:**
```typescript
toast.success("Success message!");
toast.error("Error message!");
toast.loading("Loading...");
```

---

## 📊 React Query Hooks Types

### Mutations (POST, PUT, DELETE):

```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const response = await axios.post('/api/endpoint', data);
    return response.data;
  },
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});

// Usage:
mutation.mutate({ name: "Test" });
mutation.isPending    // Loading state
mutation.isError      // Error state
mutation.isSuccess    // Success state
mutation.data         // Response data
mutation.error        // Error object
```

### Queries (GET):

```typescript
const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['posts', { page: 1 }],
  queryFn: async () => {
    const response = await axios.get('/api/posts');
    return response.data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 🚀 Ví dụ: Tạo Post Service

```typescript
// services/post.service.ts
import axios from "@/lib/axios";

export interface CreatePostData {
  title: string;
  content: string;
  categoryId: string;
}

class PostService {
  async getPosts(page = 1, limit = 10) {
    const response = await axios.get(`/api/posts`, {
      params: { page, limit },
    });
    return response.data;
  }

  async getPost(id: string) {
    const response = await axios.get(`/api/posts/${id}`);
    return response.data;
  }

  async createPost(data: CreatePostData) {
    const response = await axios.post(`/api/posts`, data);
    return response.data;
  }

  async updatePost(id: string, data: Partial<CreatePostData>) {
    const response = await axios.put(`/api/posts/${id}`, data);
    return response.data;
  }

  async deletePost(id: string) {
    await axios.delete(`/api/posts/${id}`);
  }
}

export const postService = new PostService();
```

```typescript
// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/post.service";
import toast from "react-hot-toast";

export function usePosts(page = 1) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => postService.getPosts(page),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success("Post created!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      postService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success("Post updated!");
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success("Post deleted!");
    },
  });
}
```

---

## 🎯 Best Practices

### 1. Service Layer
```typescript
// ✅ Good: Centralized API calls
const response = await authService.login(data);

// ❌ Bad: Direct fetch in components
const response = await fetch('/api/login', {...});
```

### 2. Query Keys
```typescript
// ✅ Good: Descriptive, hierarchical
queryKey: ['posts', 'list', { page: 1, status: 'published' }]

// ❌ Bad: Generic
queryKey: ['data']
```

### 3. Error Handling
```typescript
// ✅ Good: Throw typed errors
if (error.response) {
  throw new Error(error.response.data.message);
}

// ❌ Bad: Return undefined
return;
```

### 4. Optimistic Updates
```typescript
const mutation = useMutation({
  mutationFn: updatePost,
  onMutate: async (newPost) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['posts'] });

    // Snapshot previous value
    const previousPosts = queryClient.getQueryData(['posts']);

    // Optimistically update
    queryClient.setQueryData(['posts'], (old) => [...old, newPost]);

    return { previousPosts };
  },
  onError: (err, newPost, context) => {
    // Rollback on error
    queryClient.setQueryData(['posts'], context.previousPosts);
  },
});
```

---

## 🐛 Debugging

### React Query DevTools

Already included in `QueryProvider`:
```typescript
<ReactQueryDevtools initialIsOpen={false} />
```

Access at bottom of screen (development only):
- View all queries
- See loading/error states
- Check cache
- Trigger refetches
- View query details

---

## 📚 Tài liệu

- **Axios:** https://axios-http.com/docs/intro
- **React Query:** https://tanstack.com/query/latest
- **React Hot Toast:** https://react-hot-toast.com/

---

## ✅ Migration Completed

- [x] Axios installed & configured
- [x] React Query installed & configured
- [x] QueryProvider in root layout
- [x] ToastProvider added
- [x] Auth service created
- [x] Custom hooks created
- [x] LoginForm refactored
- [x] RegisterForm refactored
- [x] DevTools enabled

**Ready for BƯỚC 4!** 🚀
