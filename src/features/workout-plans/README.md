# Workout Plan Management Feature

## Tổng quan
Tính năng quản lý workout plan cho admin, hiển thị danh sách các kế hoạch tập luyện và dinh dưỡng mà người dùng đã tạo thông qua AI.

## Cấu trúc thư mục

```
src/
├── types/workoutPlan/
│   └── index.ts                    # TypeScript types & interfaces
├── app/(admin)/admin/workout-plans/
│   ├── page.tsx                    # Main route: /admin/workout-plans
│   └── [id]/page.tsx              # Detail route: /admin/workout-plans/:id
└── features/workout-plans/
    ├── index.tsx                   # Main page component
    ├── components/
    │   ├── header.tsx             # Header với tabs filter
    │   ├── WorkoutPlanCard.tsx    # Card component hiển thị plan
    │   └── WorkoutPlanTable.tsx   # Table component với pagination
    └── detail/
        └── index.tsx              # Detail page component

```

## Các Components

### 1. WorkoutPlanPage (Main)
- **File**: `src/features/workout-plans/index.tsx`
- **Chức năng**: 
  - Hiển thị danh sách workout plans
  - Filter theo loại: All, Workout, Meal
  - Pagination
  - Export dữ liệu

### 2. Header Component
- **File**: `src/features/workout-plans/components/header.tsx`
- **Features**:
  - Tabs: Tất cả / Tập luyện / Dinh dưỡng
  - Button xuất dữ liệu

### 3. WorkoutPlanCard
- **File**: `src/features/workout-plans/components/WorkoutPlanCard.tsx`
- **Hiển thị**:
  - Thông tin user (avatar, tên, email)
  - Thông tin plan (tên, loại, mục tiêu)
  - Status badge (active, completed, pending, cancelled)
  - Progress bar
  - Stats (số ngày tập/ăn, đã hoàn thành)
  - Actions (View, Edit, Delete)

### 4. WorkoutPlanTable
- **File**: `src/features/workout-plans/components/WorkoutPlanTable.tsx`
- **Features**:
  - Grid layout responsive
  - Pagination (6 items/page)
  - Event handlers cho View/Edit/Delete

### 5. WorkoutPlanDetailPage
- **File**: `src/features/workout-plans/detail/index.tsx`
- **Features**:
  - Thông tin user
  - Thông tin kế hoạch chi tiết
  - Tabs: Workout / Meal
  - Chi tiết từng ngày tập luyện
  - Chi tiết từng bữa ăn
  - Progress tracking

## Types & Interfaces

### WorkoutPlan
```typescript
interface WorkoutPlan {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  planName: string;
  planType: 'workout' | 'meal' | 'combined';
  goal?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  
  // Workout fields
  workoutPlans?: DailyWorkoutPlan[];
  totalWorkoutDays?: number;
  workoutsCompleted?: number;
  
  // Meal fields
  mealPlans?: DailyMealPlan[];
  totalMealDays?: number;
  mealsCompleted?: number;
  
  // Metadata
  generatedBy: 'ai' | 'manual';
  aiModel?: string;
  generatedAt: string;
  createdAt: string;
  progress?: number;
}
```

### DailyWorkoutPlan
```typescript
interface DailyWorkoutPlan {
  day: string;
  date?: string;
  sessions: ExerciseSession[];
  totalCalories?: number;
  completed?: boolean;
}
```

### DailyMealPlan
```typescript
interface DailyMealPlan {
  day: string;
  date?: string;
  sessions: MealSession[];
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  completed?: boolean;
}
```

## Mock Data
Hiện tại sử dụng mock data với 8 workout plans mẫu bao gồm:
- 3 combined plans (cả workout & meal)
- 3 workout-only plans
- 2 meal-only plans
- Các status khác nhau: active, completed, pending, cancelled

## Routes

### Main Page
- **URL**: `/admin/workout-plans`
- **Component**: `WorkoutPlanPage`
- **Description**: Danh sách tất cả workout plans

### Detail Page
- **URL**: `/admin/workout-plans/:id`
- **Component**: `WorkoutPlanDetailPage`
- **Description**: Chi tiết một workout plan cụ thể

## Tính năng chính

### 1. Hiển thị danh sách
- ✅ Grid layout responsive (2 columns)
- ✅ Pagination (6 items/page)
- ✅ Filter theo loại plan
- ✅ Status badges với màu sắc
- ✅ Progress bar

### 2. Chi tiết plan
- ✅ Thông tin user đầy đủ
- ✅ Chi tiết kế hoạch tập luyện theo ngày
- ✅ Chi tiết kế hoạch dinh dưỡng theo ngày
- ✅ Tabs chuyển đổi giữa workout/meal
- ✅ Hiển thị exercises/meals chi tiết
- ✅ Calories tracking

### 3. Actions
- ✅ Xem chi tiết (View)
- 🔄 Chỉnh sửa (Edit) - TODO
- 🔄 Xóa (Delete) - TODO
- 🔄 Xuất dữ liệu (Export) - TODO

## Tích hợp API (TODO)

Hiện tại sử dụng mock data. Cần tích hợp với backend:

1. **GET /api/workout-plans** - Lấy danh sách
2. **GET /api/workout-plans/:id** - Lấy chi tiết
3. **PUT /api/workout-plans/:id** - Cập nhật
4. **DELETE /api/workout-plans/:id** - Xóa
5. **POST /api/workout-plans/export** - Xuất dữ liệu

## Styling
- Sử dụng CSS variables từ theme hiện có
- Responsive design
- Dark mode support
- Animations & transitions
- Ant Design components

## Next Steps
1. ✅ Tạo types & interfaces
2. ✅ Tạo components cơ bản
3. ✅ Tạo mock data
4. ✅ Implement main page
5. ✅ Implement detail page
6. 🔄 Tích hợp API backend
7. 🔄 Implement Edit functionality
8. 🔄 Implement Delete functionality
9. 🔄 Implement Export functionality
10. 🔄 Add search & advanced filters
11. 🔄 Add sorting options
