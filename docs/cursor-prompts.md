# Cursor Prompts for Baltic Board Games Exchange
## Vibe Coding Session Guide

---

## Setup and Initialization Prompts

### 1. Project Setup
```
Create a new Next.js 14 project called "baltic-boardgames" with TypeScript, Tailwind CSS, and the app router. Set up the basic folder structure with components, lib, and app directories. Include a clean, minimal layout.tsx with basic navigation. Configure TypeScript strict mode and set up ESLint with Prettier.
```

### 2. Supabase Configuration  
```
Set up Supabase client configuration for a Next.js app. Create the environment variables setup, client initialization, and basic TypeScript types. Include both client-side and server-side configurations. Add the Supabase auth helpers for Next.js app router.
```

### 3. Database Schema Setup
```
Create Supabase database schema for a board game marketplace with two main tables: users and listings. Users table should have id, email, name, city, created_at, updated_at. Listings table needs id, user_id, bgg_id, game_name, price, condition, description, images array, city, is_active, timestamps. Include proper foreign keys and RLS policies.
```

---

## Authentication Prompts

### 4. Authentication System
```
Build a complete authentication system using Supabase Auth with Next.js app router. Create login, register, and logout functionality. Include email verification requirement and password reset. Make it work with server components and client components. Add proper TypeScript types and error handling.
```

### 5. User Profile Management
```
Create user profile components for viewing and editing profile information. Include name, email, and city selection from a dropdown of Latvian cities: Riga, Daugavpils, Liepāja, Jelgava, Jūrmala, Ventspils, Rēzekne. Add form validation and update functionality using Supabase.
```

---

## BGG API Integration Prompts

### 6. BGG API Service
```
Create a service to integrate with BoardGameGeek XML API. Build functions to search for games and fetch game details. Include XML parsing to extract game name, year, image, BGG ID, and description. Add proper error handling for API timeouts and failures. Keep it simple - no complex caching needed.
```

### 7. Game Search Component
```
Build a game search component that uses BGG API. Create an input field with live search/autocomplete functionality. Display search results with game image, name, and year. Allow users to select a game and store the BGG ID and game data. Include loading states and error handling.
```

---

## Listing Management Prompts

### 8. Listing Creation Form
```
Create a comprehensive listing creation form with these fields: BGG game search/selection, price input (EUR), condition dropdown (New, Like New, Good, Fair), optional description textarea (500 char limit), image upload (1-3 photos), city selection. Include client-side validation and integration with Supabase for saving.
```

### 9. Image Upload System
```
Implement image upload functionality using Supabase Storage. Allow users to upload 1-3 images per listing with 5MB size limit per file. Include image preview, compression if needed, and proper error handling. Store image URLs in the listings table as an array.
```

### 10. Listing Display Components
```
Build listing card components for displaying game listings in a grid. Show game image, title, price, condition, city, and posted date. Create both grid view for marketplace and list view for user dashboard. Include responsive design with Tailwind CSS.
```

---

## Marketplace Features Prompts

### 11. Marketplace Page
```
Create the main marketplace page with a grid of all active listings. Include basic filters for city, condition, and price range. Add a search bar for game names. Implement pagination to show 20 listings per page. Use Supabase to fetch and filter data efficiently.
```

### 12. Listing Detail Page
```
Build individual listing detail pages that show all listing information, image gallery, seller location, and contact button. When user clicks contact, reveal seller's email with safety guidelines displayed. Include back navigation and responsive design.
```

### 13. User Dashboard
```
Create a user dashboard showing the user's active listings in a simple table/list format. Include a "Create New Listing" button and basic profile information. Allow users to view their listing details but keep it simple - no edit/delete functionality for MVP.
```

---

## UI/UX Polish Prompts

### 14. Responsive Design
```
Ensure all components work perfectly on mobile devices. Use Tailwind CSS to create responsive layouts that work from mobile-first to desktop. Test navigation, forms, image displays, and grid layouts on different screen sizes. Fix any mobile-specific issues.
```

### 15. Loading States and Error Handling
```
Add proper loading states for all async operations: BGG API calls, image uploads, form submissions, page loads. Create user-friendly error messages for common scenarios: API failures, upload errors, network issues. Include retry mechanisms where appropriate.
```

### 16. Performance Optimization
```
Optimize the app for fast loading: compress images, lazy load components where needed, optimize BGG API calls, add proper meta tags for SEO. Ensure pages load under 3 seconds on 3G connections. Use Next.js Image component for all images.
```

---

## Testing and Deployment Prompts

### 17. End-to-End Testing
```
Test all critical user flows: user registration and login, listing creation with image upload, browsing and filtering marketplace, viewing listing details, contacting sellers. Verify everything works on mobile and desktop browsers. Check error handling scenarios.
```

### 18. Security Review
```
Review authentication flows, database RLS policies, and API endpoints for security issues. Ensure user data is properly protected, file uploads are secure, and email addresses are only revealed when appropriate. Add rate limiting if needed for BGG API calls.
```

### 19. Production Deployment
```
Deploy the application to Vercel production environment. Set up proper environment variables, configure Supabase for production, ensure all features work in production. Set up basic monitoring and error tracking. Create deployment checklist and rollback plan.
```

---

## Content and Legal Prompts

### 20. Safety Guidelines and Legal
```
Create simple terms of service and privacy policy pages appropriate for a Latvian marketplace. Add safety guidelines for users meeting to exchange games: meet in public places, inspect games before payment, trust your instincts. Keep legal language simple and clear.
```

---

## Best Practices for Using These Prompts

### Effective Cursor Usage:
- **Use one prompt at a time** - Don't combine multiple features
- **Be specific about file structure** - Mention exact folder locations
- **Include TypeScript requirements** - Always specify type safety
- **Reference existing code** - Use @ mentions for related files
- **Iterate and refine** - Start simple, then enhance

### Context Building:
- Start with setup prompts (1-3) before feature development
- Use authentication prompts (4-5) before any user-specific features  
- Complete BGG integration (6-7) before listing creation
- Build core features (8-12) before polish and optimization

### Testing Approach:
- Test each feature immediately after implementation
- Use browser dev tools to verify mobile responsiveness
- Check all error states and loading conditions
- Validate with real BGG API calls during development

### Debugging Strategy:
- Use Cursor's debugging prompts when issues arise
- Reference specific error messages in prompts
- Ask for step-by-step troubleshooting approaches
- Include browser console outputs in error prompts

---

## Sample Follow-up Prompts

When something doesn't work perfectly:
```
"Fix the BGG API integration - getting CORS errors when calling from client-side. Need to use Next.js API routes instead. Show me how to move this to server-side."
```

For improvements:
```
"The listing grid looks cramped on mobile. Improve the responsive design to show 1 column on mobile, 2 on tablet, 3-4 on desktop. Use better spacing and typography."
```

For optimization:
```
"The image upload is slow. Add compression before upload and show upload progress. Also add drag-and-drop functionality for better UX."
```

These prompts are designed to get you from zero to launched MVP efficiently while maintaining code quality and user experience. Use them sequentially for best results!