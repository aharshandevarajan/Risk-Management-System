# 🎨 Design System Reference

## Color Palette

### Primary Colors
```
Indigo 600:  #6366f1  ████████
Purple 600:  #a855f7  ████████
Gradient:    #6366f1 → #a855f7
```

### Success Colors
```
Emerald 600: #10b981  ████████
Teal 600:    #14b8a6  ████████
Gradient:    #10b981 → #14b8a6
```

### Warning Colors
```
Amber 600:   #f59e0b  ████████
Orange 600:  #f97316  ████████
Gradient:    #f59e0b → #f97316
```

### Danger Colors
```
Red 600:     #ef4444  ████████
Pink 600:    #ec4899  ████████
Gradient:    #ef4444 → #ec4899
```

### Background Colors
```
Slate 950:   #020617  ████████ (Darkest)
Slate 900:   #0f172a  ████████ (Dark)
Slate 800:   #1e293b  ████████ (Medium)
Slate 700:   #334155  ████████ (Light)
```

### Text Colors
```
Slate 100:   #f1f5f9  ████████ (Primary text)
Slate 200:   #e2e8f0  ████████ (Secondary text)
Slate 300:   #cbd5e1  ████████ (Tertiary text)
Slate 400:   #94a3b8  ████████ (Muted text)
Slate 500:   #64748b  ████████ (Disabled text)
```

## Typography

### Font Weights
- **Black (900)**: Headers, titles, important labels
- **Bold (700)**: Subheaders, buttons, badges
- **Medium (500)**: Body text, table content
- **Normal (400)**: Secondary text, descriptions

### Font Sizes
```
4xl:  36px  - Page titles
2xl:  24px  - Card values, section headers
xl:   20px  - Component headers
lg:   18px  - Large text
base: 16px  - Body text
sm:   14px  - Small text
xs:   12px  - Captions, labels
[10px]:     - Micro text
```

### Text Styles
```css
/* Gradient Text */
.gradient-text {
  background: linear-gradient(to right, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Uppercase Labels */
.label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}
```

## Components

### Cards
```css
.card {
  border-radius: 16px;
  border: 1px solid rgba(51, 65, 85, 0.5);
  background: linear-gradient(to bottom right, 
    rgba(30, 41, 59, 0.4), 
    rgba(15, 23, 42, 0.6));
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
}

.card:hover {
  transform: scale(1.05);
  transition: transform 0.2s;
}
```

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(to right, #6366f1, #a855f7);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.5);
  transform: scale(1.05);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  color: #f1f5f9;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
}

.btn-secondary:hover {
  background: rgba(51, 65, 85, 0.5);
  transform: scale(1.05);
}
```

#### Success Button
```css
.btn-success {
  background: linear-gradient(to right, #10b981, #14b8a6);
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}
```

#### Danger Button
```css
.btn-danger {
  background: linear-gradient(to right, #ef4444, #ec4899);
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
}
```

### Badges

#### High Severity
```css
.badge-high {
  background: linear-gradient(to right, 
    rgba(239, 68, 68, 0.2), 
    rgba(236, 72, 153, 0.2));
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.5);
  padding: 4px 12px;
  border-radius: 9999px;
  font-weight: 700;
}
```

#### Medium Severity
```css
.badge-medium {
  background: linear-gradient(to right, 
    rgba(245, 158, 11, 0.2), 
    rgba(249, 115, 22, 0.2));
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.5);
  padding: 4px 12px;
  border-radius: 9999px;
  font-weight: 700;
}
```

#### Low Severity
```css
.badge-low {
  background: linear-gradient(to right, 
    rgba(16, 185, 129, 0.2), 
    rgba(20, 184, 166, 0.2));
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.5);
  padding: 4px 12px;
  border-radius: 9999px;
  font-weight: 700;
}
```

### Inputs
```css
.input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(71, 85, 105, 0.5);
  background: rgba(30, 41, 59, 0.5);
  padding: 12px 16px;
  color: #f1f5f9;
  backdrop-filter: blur(8px);
}

.input:focus {
  border-color: #6366f1;
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
}
```

## Spacing Scale

```
0:    0px
1:    4px
2:    8px
3:    12px
4:    16px
5:    20px
6:    24px
8:    32px
10:   40px
12:   48px
16:   64px
20:   80px
```

## Border Radius

```
none:  0px
sm:    2px
base:  4px
md:    6px
lg:    8px
xl:    12px
2xl:   16px
3xl:   24px
full:  9999px
```

## Shadows

### Small
```css
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
```

### Medium
```css
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

### Large
```css
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

### Extra Large
```css
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### 2XL
```css
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Colored Shadows
```css
/* Indigo */
box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);

/* Emerald */
box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);

/* Red */
box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
```

## Animations

### Spin
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Scale on Hover
```css
.hover-scale:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}
```

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}
```

## Layout

### Container
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
}
```

### Grid
```css
/* 4 columns on desktop */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* 3 columns on desktop */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* 2 columns on desktop */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
```

## Icons

Using emoji for simplicity:
- 🔐 Security/Lock
- 📊 Dashboard/Charts
- 🛡️ Shield/Protection
- ⚠️ Warning
- ✅ Success
- ❌ Error
- 📁 File/Document
- 📤 Upload
- 📥 Download
- 🔍 Search
- ⚙️ Settings

## Usage Examples

### Gradient Header
```tsx
<h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
  Security Dashboard
</h1>
```

### Metric Card
```tsx
<div className="card group hover:scale-105 transition-transform">
  <p className="card-title">Total Risks</p>
  <p className="card-value">42</p>
  <div className="mt-2 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
</div>
```

### Badge
```tsx
<span className="badge badge-high">
  High
</span>
```

### Button
```tsx
<button className="btn-primary">
  <svg className="w-4 h-4" />
  Submit Risk
</button>
```

---

**This design system ensures consistency across the entire application!** 🎨
