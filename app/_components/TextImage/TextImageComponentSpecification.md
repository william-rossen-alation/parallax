## NextJS TextImage Component Specification

### Overview
Build a responsive component that displays multiple text-image sections with different layouts for mobile and desktop views.

### Component Structure
- **Sections**: 3-4 sections, each containing:
  - Text component (left column in desktop)
  - Image component (right column in desktop, stacked in mobile)

### Layout Requirements

**Mobile View:**
- Single column, vertical stack
- Order: Text → Image → Text → Image → etc.
- Standard responsive behavior

**Desktop View:**
- Two-column layout (configurable ratio, default 50/50)
- **Left column**: All text components stacked vertically with appropriate spacing
- **Right column**: Single image container with sticky positioning
- Image container maintains fixed height once aspect ratio is defined
- All images scale to fit the fixed container dimensions

### Image Transition Logic
**Trigger Points:**
- **Scrolling Down**: Transition starts when the bottom of the sticky image container aligns with the top of the next text section
- **Scrolling Up**: Transition starts when the top of the sticky image container aligns with the bottom of the previous text section
- Smooth crossfade transition (300-500ms duration)

### Technical Requirements

1. **Flexible Aspect Ratio System**:
   - Component accepts `aspectRatio` prop (e.g., "16:9", "4:3", "1:1")
   - If no aspect ratio provided, defaults to natural image dimensions of first image
   - All subsequent images conform to the established container size

2. **Layout Shift Prevention**:
   - Pre-calculate and set image container dimensions
   - Use Next.js Image component with proper sizing
   - Reserve space for images during initial render

3. **Scroll Detection**:
   - Use Intersection Observer API to detect text section positions
   - Calculate precise trigger points based on image container boundaries
   - Handle both scroll directions (up/down) with appropriate logic

4. **Image Management**:
   - Preload all section images to prevent loading delays
   - Implement proper image fallbacks
   - Optimize for different screen densities

5. **Performance Considerations**:
   - Debounce/throttle scroll calculations if needed
   - Use `transform` and `opacity` for animations (GPU accelerated)
   - Implement proper cleanup for observers

6. **Accessibility**:
   - Respect `prefers-reduced-motion` media query
   - Proper alt text for all images
   - Semantic HTML structure
