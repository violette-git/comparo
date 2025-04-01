# Website Showcase Design Mockup

## Home Page Layout

```
┌────────────────────────────────────────────────────┐
│ [Logo]            [Search]         [User Account]  │ <- Header with sticky navigation
├────────────────────────────────────────────────────┤
│                                                    │
│  Featured Website Showcase                         │ <- Hero section with featured website
│  ┌──────────────────────────────────────┐          │
│  │                                      │          │
│  │       Interactive Preview            │          │
│  │       (Device Switching)             │          │
│  │                                      │          │
│  └──────────────────────────────────────┘          │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  [All] [Category 1] [Category 2] [Category 3] ...  │ <- Filter tabs
│                                                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ Website │  │ Website │  │ Website │             │ <- Card grid with
│  │ Card 1  │  │ Card 2  │  │ Card 3  │             │    website previews
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ Website │  │ Website │  │ Website │             │
│  │ Card 4  │  │ Card 5  │  │ Card 6  │             │
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                    │
│  [Load More]                                       │ <- Infinite scrolling or pagination
│                                                    │
└────────────────────────────────────────────────────┘
```

## Website Detail Page

```
┌────────────────────────────────────────────────────┐
│ [Logo]            [Search]         [User Account]  │
├────────────────────────────────────────────────────┤
│                                                    │
│  [← Back to Gallery]                               │ <- Navigation breadcrumb
│                                                    │
│  Website Title                                     │ <- Website metadata
│  Description text goes here...                     │
│                                                    │
│  [Category] [Tag 1] [Tag 2] [Tag 3]                │ <- Categorization
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │                                              │  │
│  │         Interactive Preview Area             │  │ <- Main preview area
│  │                                              │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  [Desktop] [Tablet] [Mobile]                       │ <- Device switcher
│                                                    │
│  ┌─────────────────┐ ┌─────────────────┐           │
│  │                 │ │                 │           │
│  │  Before View    │ │  After View     │           │ <- Optional before/after
│  │                 │ │                 │           │    comparison (if applicable)
│  └─────────────────┘ └─────────────────┘           │
│                                                    │
│  [Visit Website] [Share] [Save]                    │ <- Action buttons
│                                                    │
└────────────────────────────────────────────────────┘
```

## Website Card Component

```
┌─────────────────────────┐
│                         │
│                         │
│     Website Preview     │ <- Screenshot thumbnail
│     (Responsive)        │
│                         │
│                         │
├─────────────────────────┤
│ Website Title           │ <- Metadata
│ Category · Tags         │
│                         │
│ [View Details]          │ <- Call to action
└─────────────────────────┘
```

## Device Comparison Slider

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────┐     ┌──────────┐           │
│  │         │     │          │           │
│  │ Desktop │     │  Mobile  │           │
│  │ View    │     │  View    │           │
│  │         │     │          │           │
│  │         │     │          │           │
│  └─────────┘     └──────────┘           │
│                                         │
│        [Desktop] [Tablet] [Mobile]      │
│                                         │
└─────────────────────────────────────────┘
```

## Responsive Behavior

### Desktop
- Full grid display with 3-4 columns
- Expanded filtering options
- Side-by-side comparison views

### Tablet
- 2-column grid layout
- Collapsible filters in dropdown
- Stacked comparison views with slider

### Mobile
- Single column layout
- Bottom sheet filters
- Swipeable comparison views
- Thumb-zone optimized navigation