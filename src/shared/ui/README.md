# UI System - Color & Theme

## 🎨 Color System

Dựa trên bảng màu từ Figma, hệ thống màu sắc được thiết kế để hỗ trợ cả light theme và dark theme.

### Primary Colors
- `--color-primary`: #FF8C00 (Orange - Brand color)
- `--color-primary-dark`: #E67A00 (Darker orange for hover states)
- `--color-primary-light`: #FFB84D (Lighter orange for subtle accents)

### Neutral Colors
- `--color-white`: #FFFFFF (Light) / #1A1A1A (Dark)
- `--color-gray-50`: #F5F5F5 (Light) / #2A2A2A (Dark)
- `--color-gray-100`: #E0E0E0 (Light) / #3A3A3A (Dark)
- `--color-gray-200`: #B0B0B0 (Light) / #4A4A4A (Dark)
- `--color-gray-300`: #999999 (Light) / #6A6A6A (Dark)
- `--color-gray-400`: #666666 (Light) / #8A8A8A (Dark)
- `--color-gray-500`: #333333 (Light) / #B0B0B0 (Dark)
- `--color-gray-600`: #1A1A1A (Light) / #D0D0D0 (Dark)
- `--color-gray-700`: #0A0A0A (Light) / #F0F0F0 (Dark)

### Status Colors
- `--color-success`: #10B981 (Green)
- `--color-warning`: #F59E0B (Yellow)
- `--color-error`: #EF4444 (Red)
- `--color-info`: #3B82F6 (Blue)

## 🌓 Theme System

### Light Theme (Default)
- Background: White (#FFFFFF)
- Text: Dark gray (#333333)
- Borders: Light gray (#E0E0E0)

### Dark Theme
- Background: Dark (#F0F0F0)
- Text: Light gray (#D0D0D0)
- Borders: Medium gray (#4A4A4A)

## 🎯 Usage

### CSS Variables
```css
.my-component {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}
```

### Utility Classes
```html
<!-- Text Colors -->
<div class="text-primary">Primary text</div>
<div class="text-secondary">Secondary text</div>
<div class="text-brand">Brand text</div>

<!-- Background Colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-secondary">Secondary background</div>
<div class="bg-brand">Brand background</div>

<!-- Status Colors -->
<div class="text-success">Success text</div>
<div class="bg-error">Error background</div>
```

### Component Classes
```html
<!-- Buttons -->
<button class="btn-primary">Primary Button</button>
<button class="btn-secondary">Secondary Button</button>
<button class="btn-ghost">Ghost Button</button>

<!-- Cards -->
<div class="card">Card content</div>
<div class="card-hover">Hoverable card</div>

<!-- Inputs -->
<input class="input" placeholder="Input field" />
<input class="input-error" placeholder="Error input" />

<!-- Sidebar -->
<div class="sidebar">
  <div class="sidebar-item">Menu item</div>
  <div class="sidebar-item-active">Active menu item</div>
</div>
```

## 🔧 Theme Management

### useTheme Hook
```typescript
import { useTheme } from '@/shared/lib';

function MyComponent() {
  const { 
    theme, 
    toggleTheme, 
    setLightTheme, 
    setDarkTheme,
    isLight,
    isDark 
  } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {isLight ? 'dark' : 'light'} theme
      </button>
    </div>
  );
}
```

### ThemeToggle Component
```typescript
import { ThemeToggle } from '@/shared/ui';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

## 📱 Responsive Design

Tất cả các màu sắc và theme đều được thiết kế để hoạt động tốt trên mọi thiết bị:

- **Mobile**: Tối ưu cho màn hình nhỏ
- **Tablet**: Cân bằng giữa mobile và desktop
- **Desktop**: Trải nghiệm đầy đủ

## 🎨 Customization

### Thêm màu mới
```css
:root {
  --color-custom: #your-color;
}

[data-theme="dark"] {
  --color-custom: #your-dark-color;
}
```

### Thêm utility class
```css
@layer utilities {
  .text-custom { color: var(--color-custom); }
  .bg-custom { background-color: var(--color-custom); }
}
```

## 🔍 Best Practices

1. **Luôn sử dụng CSS variables** thay vì hardcode màu sắc
2. **Sử dụng utility classes** cho các trường hợp phổ biến
3. **Test trên cả light và dark theme** trước khi deploy
4. **Sử dụng semantic naming** (primary, secondary, success, error)
5. **Đảm bảo contrast ratio** đủ cao cho accessibility
