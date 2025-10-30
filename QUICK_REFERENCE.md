# Quick Reference - Sidebar States

## 🖥️ Desktop View

### Expanded (Default)
- **Width**: 288px (18rem)
- **Logo**: Icon + "Linguist Hub" text
- **Profile**: Avatar + Name + "Profile Settings"
- **Menu**: Icon + Full label + Active indicator
- **Footer**: "© 2025 Linguist Hub"
- **Toggle**: Chevron Left icon (top right)

### Collapsed
- **Width**: 80px (5rem)
- **Logo**: Icon only (centered)
- **Profile**: Avatar only (centered)
- **Menu**: Icon only (centered) + Tooltip on hover
- **Footer**: "©" symbol only
- **Toggle**: Chevron Right icon (top right corner)

## 📱 Mobile View

### Hidden (Default)
- Sidebar completely off-screen
- Hamburger menu button in header
- No overlay

### Open (Drawer)
- **Width**: 288px (18rem)
- **Position**: Slides in from left
- **Overlay**: Dark backdrop (50% opacity)
- **Content**: Same as desktop expanded
- **Close**: Tap overlay or menu item

## 🎯 Key Features

| Feature | Expanded | Collapsed | Mobile |
|---------|----------|-----------|--------|
| Logo Text | ✅ Visible | ❌ Hidden | ✅ Visible |
| Profile Name | ✅ Visible | ❌ Hidden | ✅ Visible |
| Menu Labels | ✅ Visible | ❌ Hidden | ✅ Visible |
| Tooltips | ❌ No | ✅ On Hover | ❌ No |
| Active Indicator | ✅ White Bar | ❌ Hidden | ✅ White Bar |
| Footer Text | ✅ Full | ❌ Symbol | ✅ Full |

## 🎨 Animations

### Toggle Animation
- **Duration**: 300ms
- **Easing**: ease-in-out
- **Properties**: width, opacity, padding

### Tooltip Animation
- **Duration**: 200ms
- **Easing**: ease-out
- **Properties**: opacity, visibility

### Menu Hover
- **Duration**: 200-300ms
- **Effects**: scale, background, shadow

## 🔘 Interactive Elements

### Toggle Button (Desktop)
- **Location**: Top right of sidebar
- **Icon**: Chevron (changes direction)
- **Hover**: White background + shadow
- **Action**: Expand/collapse sidebar

### Hamburger Menu (Mobile)
- **Location**: Top left of header
- **Icon**: Menu (three lines)
- **Hover**: Blue background
- **Action**: Open drawer

### Profile Section
- **Click**: Navigate to /profile
- **Hover**: Avatar scales, white background
- **Visible**: Always (icon in collapsed)

### Menu Items
- **Click**: Navigate to page
- **Hover**: Tooltip (collapsed), scale effect
- **Active**: Blue gradient background

## 💡 Usage Tips

1. **Desktop Users**: Click chevron to toggle
2. **Mobile Users**: Tap hamburger to open
3. **Collapsed Mode**: Hover icons for labels
4. **Profile Access**: Click avatar anytime
5. **Quick Navigation**: Active page highlighted

## 🎨 Color Reference

- **Primary Blue**: #2563eb (blue-600)
- **Dark Blue**: #1d4ed8 (blue-700)
- **Background**: #f9fafb (gray-50) to #f3f4f6 (gray-100)
- **Active Shadow**: rgba(59, 130, 246, 0.3)
- **Tooltip**: #111827 (gray-900)

## 📐 Dimensions

- **Expanded Width**: 288px
- **Collapsed Width**: 80px
- **Mobile Width**: 288px
- **Icon Size**: 20px (w-5 h-5)
- **Avatar Size**: 40px (w-10 h-10)
- **Logo Size**: 48px (w-12 h-12)

## 🚀 Performance Notes

- All animations use CSS transforms (GPU accelerated)
- No JavaScript animations for smoothness
- Minimal DOM updates during toggle
- Optimized for 60fps on all devices
