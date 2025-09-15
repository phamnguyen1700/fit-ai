# TanStack Query Structure

Cấu trúc tập trung cho TanStack Query (React Query) trong project.

## Cấu trúc

```
src/tanstack/
├── services/           # API Services
│   ├── plans/         # Plan service
│   ├── users/         # User service  
│   ├── home/          # Home service
│   └── feedback/      # Feedback service
├── hooks/             # React Query Hooks
│   ├── plans/         # Plan hooks + query keys
│   ├── users/         # User hooks + query keys
│   ├── home/          # Home hooks + query keys
│   └── feedback/      # Feedback hooks + query keys
└── index.ts           # Export tất cả
```

## Cách sử dụng

### Import Services
```typescript
import { planService, userService } from '@/tanstack';
```

### Import Hooks
```typescript
import { usePlans, useCreatePlanMutation } from '@/tanstack';
```

## Lợi ích

1. **Tập trung**: Tất cả logic TanStack Query ở một nơi
2. **Tái sử dụng**: Dễ dàng import và sử dụng ở bất kỳ đâu
3. **Bảo trì**: Dễ dàng quản lý và cập nhật
4. **Tách biệt**: Tách biệt logic data fetching khỏi UI components
