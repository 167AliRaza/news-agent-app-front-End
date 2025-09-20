# AI Rules for this Application

This document outlines the core technologies used in this application and provides guidelines for using specific libraries.

## Tech Stack

*   **Framework**: Next.js (React) for building the user interface, handling routing, and server-side rendering capabilities.
*   **Language**: TypeScript for enhanced code quality, maintainability, and type safety across the codebase.
*   **Styling**: Tailwind CSS for a utility-first approach to styling, enabling rapid and consistent UI development.
*   **UI Components**: shadcn/ui provides a collection of beautifully designed and accessible UI components, built on top of Radix UI.
*   **Base UI Primitives**: Radix UI offers unstyled, accessible component primitives that form the foundation for many shadcn/ui components.
*   **Icons**: Lucide React is used for a comprehensive set of customizable SVG icons.
*   **Form Management**: React Hook Form is utilized for efficient and flexible form state management and validation.
*   **Schema Validation**: Zod is integrated for robust schema validation, typically used in conjunction with React Hook Form.
*   **Notifications**: Sonner is the chosen library for displaying elegant and user-friendly toast notifications.
*   **Other UI Libraries**: Specific functionalities like carousels (Embla Carousel), date pickers (React Day Picker), charts (Recharts), OTP inputs (Input OTP), and drawers (Vaul) are handled by dedicated libraries.
*   **Theme Management**: next-themes is used for managing light and dark mode themes.

## Library Usage Rules

To maintain consistency and leverage the strengths of each library, please adhere to the following rules:

*   **Core UI Components**: Always prioritize `shadcn/ui` components for common UI elements (buttons, inputs, cards, dialogs, etc.). If a specific component is not available in `shadcn/ui`, consider building it using `Radix UI` primitives.
*   **Styling**: All styling must be done using `Tailwind CSS` utility classes. Avoid writing custom CSS or using inline styles unless absolutely necessary for dynamic, calculated styles.
*   **Icons**: Use icons exclusively from the `lucide-react` library.
*   **Forms & Validation**: For any form-related logic, use `react-hook-form`. For defining and validating form data schemas, use `zod`.
*   **Toast Notifications**: Implement all toast notifications using the `sonner` library.
*   **Date Selection**: For date input and selection, use `react-day-picker`.
*   **Carousels**: For any carousel or slider functionality, use `embla-carousel-react`.
*   **Charts & Data Visualization**: Use `recharts` for all charting and data visualization needs.
*   **OTP Inputs**: For one-time password input fields, use `input-otp`.
*   **Drawers**: For slide-over panels or drawers, use `vaul`.
*   **Theme Toggling**: Use `next-themes` for implementing and managing dark/light mode.
*   **New Components**: When creating new components, place them in `src/components/` (or `src/pages/` for page-specific components). Ensure they are small, focused, and follow the existing component structure and styling conventions.
*   **File Structure**: Maintain the current directory structure (`app/`, `components/ui/`, `hooks/`, `lib/`).