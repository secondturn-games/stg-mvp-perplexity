# Product Requirements Document (PRD)
## Baltic Board Games Exchange - MVP

---

### Document Information
- **Product Name**: Baltic Board Games Exchange
- **Version**: 1.0
- **Date**: September 2025
- **Owner**: Product Team
- **Status**: Draft

---

## 1. Product Overview

### Product Vision
Create the simplest possible peer-to-peer marketplace for board game enthusiasts in Latvia to buy and sell used games, focusing exclusively on BGG-verified games.

### Product Purpose
Enable Latvian board game players to easily list their used games for sale and discover games from other local players, creating a trusted community marketplace.

### Target Market
- **Primary Geography**: Latvia (Riga, Daugavpils, Liepāja, Jelgava, Jūrmala)
- **Primary Users**: Board game enthusiasts aged 18-45
- **Secondary Users**: Parents buying games for children
- **Market Size**: Estimated 5,000+ active board game players in Latvia

### Key Value Propositions
- **For Sellers**: Easy way to declutter game collections and earn money
- **For Buyers**: Find rare/expensive games at lower prices locally
- **For Community**: Keep games in circulation within local gaming community

---

## 2. Goals and Success Metrics

### Business Goals
- Launch functional MVP in Latvia within 8-10 weeks
- Build foundation for expansion to Estonia and Lithuania
- Create sustainable community-driven marketplace

### Success Metrics (6 months post-launch)
- **User Adoption**: 200+ registered users
- **Listing Activity**: 300+ active game listings
- **Transaction Volume**: 50+ successful transactions
- **User Engagement**: 40%+ of users return monthly
- **Community Health**: 90%+ positive user feedback

### Non-Goals (Explicitly Out of Scope)
- Payment processing integration
- Shipping/logistics management
- Multi-language support
- Mobile app development
- Advanced search algorithms
- User reviews/ratings system

---

## 3. User Personas

### Primary Persona: "Game Collector Magnus"
- **Demographics**: 28-35, male, urban, disposable income
- **Behavior**: Buys 3-5 games monthly, sells games that don't hit the table
- **Pain Points**: Local stores have limited selection, shipping from abroad is expensive
- **Goals**: Find rare games locally, recover some cost from unused games

### Secondary Persona: "Casual Gamer Laura"  
- **Demographics**: 25-40, mixed gender, suburban, budget-conscious
- **Behavior**: Buys 1-2 games quarterly, prefers trying before buying
- **Pain Points**: Uncertainty about game quality, high prices for experimentation
- **Goals**: Access variety of games without full retail commitment

---

## 4. Core Features and Requirements

### 4.1 User Authentication
- **Email/password registration** (no social login)
- **Email verification** required
- **Password reset** functionality
- **Basic profile**: name, email, city (dropdown), created date

### 4.2 BGG Integration
- **Game search** using BGG XML API
- **Game data display**: name, year, image, BGG ID, description
- **No complex caching** - direct API calls only
- **Error handling** for API timeouts/failures

### 4.3 Listing Creation
**Single-page form with:**
- BGG game search and selection
- Price input (EUR only)
- Condition selection (New, Like New, Good, Fair)
- Description field (optional, 500 char limit)
- Image upload (1-3 photos, max 5MB each)
- Location selection (city dropdown)

### 4.4 Listing Browse/Search
- **Grid view** of all active listings
- **Basic filters**: price range, condition, city
- **Text search** by game name
- **Sort options**: newest, price (low/high), name A-Z
- **Pagination**: 20 listings per page

### 4.5 Listing Details
- **Full listing view** with all details
- **Image gallery** (if multiple photos)
- **Seller contact button** (reveals email)
- **Basic safety reminder** (meet in public, inspect before buying)

### 4.6 User Dashboard
- **My Active Listings** (simple list view)
- **Create New Listing** button
- **Basic profile edit** (name, email, city)

---

## 5. Technical Requirements

### 5.1 Technology Stack
- **Frontend**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS (minimal custom styles)
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **External API**: BoardGameGeek XML API
- **Deployment**: Vercel

### 5.2 Database Schema

```sql
-- Users table
users (
  id: uuid (primary key),
  email: string (unique),
  name: string,
  city: string,
  created_at: timestamp,
  updated_at: timestamp
)

-- Listings table  
listings (
  id: uuid (primary key),
  user_id: uuid (foreign key),
  bgg_id: integer,
  game_name: string,
  price: decimal,
  condition: enum ('new', 'like_new', 'good', 'fair'),
  description: text,
  images: text[], -- array of storage URLs
  city: string,
  is_active: boolean (default true),
  created_at: timestamp,
  updated_at: timestamp
)
```

### 5.3 Performance Requirements
- **Page load time**: <3 seconds on 3G connection
- **BGG API calls**: Max 1 per search query
- **Image upload**: Max 5MB per file
- **Concurrent users**: Support 50+ simultaneous users

---

## 6. User Experience Requirements

### 6.1 Design Principles
- **Mobile-first**: Responsive design for all screen sizes
- **Minimal UI**: Clean, uncluttered interface
- **Clear CTAs**: Obvious next steps on every page
- **Fast interactions**: Immediate feedback for user actions

### 6.2 Key User Flows

#### Flow 1: New User Listing Creation
1. User registers/logs in
2. Clicks "Create Listing" 
3. Searches for game via BGG
4. Fills out listing details
5. Uploads photos
6. Publishes listing
7. Sees confirmation + listing link

#### Flow 2: Game Discovery and Contact
1. User browses marketplace
2. Filters by city/condition
3. Clicks on interesting listing
4. Views full details and photos
5. Clicks "Contact Seller"
6. Email revealed with safety tips

---

## 7. Business and Operational Requirements

### 7.1 Content Moderation
- **Manual review**: Periodic check for inappropriate listings
- **User reporting**: Simple "Report listing" link
- **Automated filters**: Block obvious spam keywords

### 7.2 Legal and Compliance
- **GDPR compliance**: Basic privacy policy, data deletion rights
- **Terms of service**: Clear liability disclaimers
- **Safety guidelines**: Prominent safety tips for meetups

### 7.3 Launch Strategy
- **Soft launch**: 2-week private beta with 20-30 local gamers
- **Marketing**: BGG forum posts, local Facebook gaming groups
- **Community building**: Engage with Riga board game meetups

---

## 8. Development Timeline

### Week 1-2: Foundation
- Project setup and authentication
- Database schema and basic CRUD
- BGG API integration

### Week 3-4: Core Features
- Listing creation flow
- Marketplace browsing
- User dashboard

### Week 5-6: Polish and Testing  
- UI/UX refinements
- Image upload and handling
- Beta testing with local users

### Week 7-8: Launch Preparation
- Bug fixes and optimizations
- Content and safety guidelines
- Deployment and monitoring

---

## 9. Risks and Mitigation

### High-Risk Items
- **BGG API reliability**: Implement fallback error states
- **Low user adoption**: Aggressive community outreach pre-launch  
- **Spam/fraud listings**: Manual moderation + user reporting

### Technical Risks
- **Image storage costs**: Monitor usage, implement compression
- **Database performance**: Simple indexes, pagination limits

---

## 10. Post-Launch Iteration Plan

### Month 1-3: Core Improvements
- Based on user feedback, prioritize most requested features
- Fix critical bugs and performance issues
- Improve search and filtering

### Month 4-6: Growth Features
- Expand to Estonia if Latvia shows traction
- Consider basic messaging system
- Implement user favorites/watchlist

### Future Considerations
- Payment integration (if highly requested)
- Mobile app (if web usage validates demand)
- Lithuania expansion
- Advanced features from original complex project

---

## 11. Open Questions

1. **Pricing strategy**: Free forever, or introduce fees later?
2. **Game categories**: Should we limit to board games or include card games, RPGs?
3. **Listing duration**: How long should listings stay active?
4. **Multiple photos**: Required or optional for listings?
5. **User verification**: Email only, or phone number too?

---

## Appendix

### Related Documents
- Technical Architecture Document (TBD)
- Design System Guidelines (TBD)
- BGG API Integration Specs (TBD)

### Stakeholder Approval
- [ ] Product Lead
- [ ] Engineering Lead  
- [ ] Design Lead
- [ ] Business Stakeholder