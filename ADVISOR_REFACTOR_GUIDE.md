# ADVISOR REFACTOR GUIDE

## Mục tiêu
- Sử dụng components từ `/shared/ui/core/`
- Sử dụng CSS variables từ `globals.css`
- Giữ nguyên style hiện tại
- Thêm custom styles vào `globals.css` khi cần

## Bước 1: Thêm Styles vào globals.css

Copy nội dung từ file `ADVISOR_STYLES_TO_ADD.css` vào cuối file `src/app/globals.css`

## Bước 2: Mapping Components

### Button Component
**Trước:**
```tsx
<button className="px-6 py-3 bg-primary text-white rounded-lg">
  Duyệt ngay
</button>
```

**Sau:**
```tsx
<Button variant="primary" size="md">
  Duyệt ngay
</Button>
```

### Card Component
**Trước:**
```tsx
<Card className="p-6">
  Content
</Card>
```

**Sau:**
```tsx
<Card className="p-6">
  Content  
</Card>
```
*Card đã OK, không cần thay đổi*

## Bước 3: Mapping CSS Classes

### Background Colors
- `bg-white` → `bg` (var(--bg))
- `bg-gray-50` → `bg-secondary` (var(--bg-secondary))
- `bg-gray-100` → `bg-secondary`
- `bg-gray-200` → `bg-tertiary`
- `bg-blue-500` → sử dụng `advisor-category-btn.active` class
- `bg-green-500` → sử dụng `advisor-sample-meal` class
- `bg-orange-500` → sử dụng `advisor-sample-workout` class

### Text Colors
- `text-gray-500` → `text-secondary`
- `text-gray-600` → `text-secondary`
- `text-gray-700` → `text`
- `text-white` → `text-inverse`
- `text-blue-600` → `text-[var(--info)]`
- `text-green-600` → `text-[var(--success)]`
- `text-orange-600` → `text-[var(--warning)]`

### Border Colors
- `border-gray-200` → `border` với `border-color: var(--border)`
- `border-gray-300` → `border-secondary`

### Gradients
- `bg-gradient-to-r from-blue-500 to-purple-600` → `advisor-category-btn active` class
- `bg-gradient-to-r from-green-500 to-emerald-500` → `advisor-sample-meal` class
- `bg-gradient-to-r from-orange-500 to-red-500` → `advisor-sample-workout` class

## Bước 4: Ví dụ Refactor AIPlansList Component

### Category Filter Buttons
**Trước:**
```tsx
<button
  onClick={() => setCategoryFilter('all')}
  className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
    categoryFilter === 'all'
      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  }`}
>
  🤖 Tất cả AI Plans
</button>
```

**Sau:**
```tsx
<button
  onClick={() => setCategoryFilter('all')}
  className={`advisor-category-btn ${categoryFilter === 'all' ? 'active' : ''}`}
>
  🤖 Tất cả AI Plans
</button>
```

### Status Badge
**Trước:**
```tsx
<span className="px-3 py-1 rounded-full text-xs font-semibold border bg-orange-100 text-orange-700 border-orange-300">
  {statusBadge.label}
</span>
```

**Sau:**
```tsx
<span className={`advisor-status-badge advisor-status-${plan.status}`}>
  {statusBadge.label}
</span>
```

### Plan Card
**Trước:**
```tsx
<div className="bg-gradient-to-r from-white to-gray-50 border rounded-lg p-6 hover:shadow-lg transition-all">
  Content
</div>
```

**Sau:**
```tsx
<div className="advisor-plan-card">
  Content
</div>
```

### Avatar
**Trước:**
```tsx
<div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
  {plan.userName.charAt(0)}
</div>
```

**Sau:**
```tsx
<div className="advisor-avatar">
  {plan.userName.charAt(0)}
</div>
```

### Sample Dishes Badges
**Trước:**
```tsx
<span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full">
  {dish}
</span>
```

**Sau:**
```tsx
<span className="advisor-sample-badge advisor-sample-meal">
  {dish}
</span>
```

### Sample Exercises Badges
**Trước:**
```tsx
<span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full">
  {exercise}
</span>
```

**Sau:**
```tsx
<span className="advisor-sample-badge advisor-sample-workout">
  {exercise}
</span>
```

### Info Card
**Trước:**
```tsx
<div className="bg-white p-3 rounded-lg border">
  <p className="text-xs text-gray-500 mb-1">Thời gian</p>
  <p className="font-semibold">{plan.duration}</p>
</div>
```

**Sau:**
```tsx
<div className="advisor-info-card">
  <p className="text-xs text-secondary mb-1">Thời gian</p>
  <p className="font-semibold">{plan.duration}</p>
</div>
```

### Confidence Bar
**Trước:**
```tsx
<div className="flex-1 bg-gray-200 rounded-full h-2">
  <div
    className={`h-2 rounded-full ${
      plan.aiConfidence >= 90 ? 'bg-green-500' :
      plan.aiConfidence >= 80 ? 'bg-yellow-500' : 'bg-orange-500'
    }`}
    style={{ width: `${plan.aiConfidence}%` }}
  ></div>
</div>
```

**Sau:**
```tsx
<div className="advisor-confidence-bar">
  <div
    className={`advisor-confidence-fill ${
      plan.aiConfidence >= 90 ? 'advisor-confidence-high' :
      plan.aiConfidence >= 80 ? 'advisor-confidence-medium' : 
      'advisor-confidence-low'
    }`}
    style={{ width: `${plan.aiConfidence}%` }}
  ></div>
</div>
```

### Macros Display
**Trước:**
```tsx
<div className="flex gap-3 mb-4">
  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
    <span className="text-xs text-gray-600">Protein:</span>
    <span className="font-semibold text-blue-600">{plan.macros.protein}g</span>
  </div>
</div>
```

**Sau:**
```tsx
<div className="advisor-macros">
  <div className="advisor-macro-item advisor-macro-protein">
    <span className="text-xs text-secondary">Protein:</span>
    <span className="font-semibold text-[var(--info)]">{plan.macros.protein}g</span>
  </div>
</div>
```

### Special Notes
**Trước:**
```tsx
<div className="bg-purple-50 border-l-4 border-purple-400 p-3 mb-4">
  <p className="text-sm text-gray-700">
    <span className="font-semibold">Ghi chú đặc biệt:</span> {plan.specialNotes}
  </p>
</div>
```

**Sau:**
```tsx
<div className="advisor-special-note">
  <p className="text-sm text">
    <span className="font-semibold">Ghi chú đặc biệt:</span> {plan.specialNotes}
  </p>
</div>
```

### Action Buttons
**Trước:**
```tsx
<Button
  variant="primary"
  onClick={() => handleReview(plan)}
>
  <Icon name="mdi:file-document-edit-outline" className="mr-2" />
  {plan.status === 'pending' ? 'Duyệt ngay' : 'Xem chi tiết'}
</Button>
```

**Sau:** (Không cần thay đổi, đã đúng)

## Bước 5: Import Components

Thêm vào đầu file:
```tsx
import { Button, Card, Badge, Progress } from '@/shared/ui/core';
```

## Bước 6: Checklist Refactor

### AIPlansList.tsx
- [ ] Thay category filter buttons thành `advisor-category-btn`
- [ ] Thay status badges thành `advisor-status-badge`
- [ ] Thay plan cards thành `advisor-plan-card`
- [ ] Thay avatars thành `advisor-avatar`
- [ ] Thay sample badges thành `advisor-sample-badge`
- [ ] Thay info cards thành `advisor-info-card`
- [ ] Thay confidence bars thành `advisor-confidence-*`
- [ ] Thay macros display thành `advisor-macros`
- [ ] Thay special notes thành `advisor-special-note`

### PlanReviewModal.tsx
- [ ] Thay modal header
- [ ] Thay day selector buttons
- [ ] Thay meal cards
- [ ] Thay workout cards
- [ ] Thay video preview
- [ ] Thay exercise stats

### AIPlansStats.tsx
- [ ] Thay stat cards nếu có

## Lưu ý quan trọng

1. **Không xóa CSS cũ** trong globals.css
2. **Test dark mode** sau khi refactor
3. **Kiểm tra responsive** trên mobile
4. **Giữ nguyên functionality**, chỉ thay đổi CSS
5. **Commit từng component** một để dễ rollback nếu có lỗi

## Hỗ trợ

Nếu gặp vấn đề, có thể:
- Kiểm tra `COLOR_MAPPING.md` để xem mapping màu
- Xem `ADVISOR_STYLES_TO_ADD.css` để biết các class mới
- Test từng component một trước khi merge

