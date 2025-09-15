# Fit AI - Next.js Project

## Cấu trúc Project

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Route group cho admin
│   │   ├── admin/         # Admin routes
│   │   │   ├── dashboard/ # /admin/dashboard
│   │   │   ├── plans/     # /admin/plans
│   │   │   ├── users/     # /admin/users
│   │   │   └── settings/  # /admin/settings
│   │   └── layout.tsx     # Admin layout
│   ├── (marketing)/       # Route group cho marketing
│   │   ├── home/          # /home
│   │   ├── features/      # /features
│   │   ├── pricing/       # /pricing
│   │   ├── download/      # /download
│   │   ├── feedback/      # /feedback
│   │   └── layout.tsx     # Marketing layout
│   └── page.tsx           # Root page (redirect to /home)
├── features/              # Feature-based architecture
│   ├── plans/             # Plans feature
│   │   ├── components/    # UI components
│   │   └── index.tsx      # Page component
│   ├── users/             # Users feature
│   │   ├── components/    # UI components
│   │   └── index.tsx      # Page component
│   ├── home/              # Home feature
│   │   ├── components/    # UI components
│   │   └── index.tsx      # Page component
│   └── feedback/          # Feedback feature
│       ├── components/    # UI components
│       └── index.tsx      # Page component
├── tanstack/              # TanStack Query (React Query)
│   ├── services/          # API Services
│   │   ├── plans/         # Plan service
│   │   ├── users/         # User service
│   │   ├── home/          # Home service
│   │   └── feedback/      # Feedback service
│   ├── hooks/             # React Query Hooks
│   │   ├── plans/         # Plan hooks + query keys
│   │   ├── users/         # User hooks + query keys
│   │   ├── home/          # Home hooks + query keys
│   │   └── feedback/      # Feedback hooks + query keys
│   └── index.ts           # Export tất cả
├── stores/                # Zustand stores
│   ├── app.store.ts       # Main app store
│   ├── modal.store.ts     # Modal state
│   ├── filter.store.ts    # Filter state
│   ├── plans.ts           # Plans store
│   ├── users.ts           # Users store
│   ├── home.ts            # Home store
│   ├── feedback.ts        # Feedback store
│   └── index.ts           # Export tất cả
├── shared/                # Shared utilities
│   ├── api/               # HTTP client
│   ├── ui/                # UI components
│   └── lib/                # Utility functions
└── lib/                   # Library configurations
    └── queryClient.ts     # TanStack Query client
```

## Tính năng

- ✅ **Next.js 15** với App Router
- ✅ **Route Groups** cho admin và marketing
- ✅ **Feature-based Architecture** 
- ✅ **TanStack Query** cho data fetching
- ✅ **Zustand** cho state management
- ✅ **TypeScript** cho type safety
- ✅ **Tailwind CSS** cho styling
- ✅ **Responsive Design**

## Cách sử dụng

### Chạy development
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Chạy production
```bash
npm start
```

## Cấu trúc trang

Tất cả các trang hiện tại chỉ hiển thị tên trang đơn giản để bạn có thể tự phát triển nội dung:

- **Admin**: Dashboard, Plans, Users, Settings
- **Marketing**: Home, Features, Pricing, Download, Feedback

## Lưu ý

- Tất cả component phức tạp đã được xóa, chỉ giữ lại khung sườn
- TanStack Query hooks đã được setup sẵn trong `src/tanstack/`
- Zustand stores đã được setup sẵn trong `src/stores/`
- Types đã được định nghĩa trong `src/features/*/types/`