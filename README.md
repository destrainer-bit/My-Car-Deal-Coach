# The Car Coach App - Car Buying Coach MVP

A complete React + Vite web application that helps car shoppers research, price, and negotiate with confidence. Built with no external dependencies beyond Vite/React defaults.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📱 Features

### Core Functionality
- **Onboarding Flow**: 3-step introduction with animated SVGs
- **Create Deal Wizard**: 4-step process (basics, condition, photos, price estimate)
- **Saved Deals**: Card-based interface with filtering and sorting
- **Negotiation Checklist**: Auto-generated checklists grouped by phase
- **Notes & Photos**: Rich textarea with photo gallery and lightbox
- **Settings**: Dark mode, data export/import, reset functionality

### Smart Pricing
- **Heuristic Algorithm**: `base = 28000 - (age*1200) - (mileage/120)`, clamped to [2000, 70000]
- **Condition Multiplier**: `1 + ((rating - 3) * 0.05)`
- **Trim Adjustment**: +1.5% for non-base trims
- **Regional Pricing**: ZIP-based multipliers (0.98, 1.00, 1.02)
- **Price Ranges**: Low (93%), Mid (100%), High (107%) rounded to nearest $50

### Data Structure
```javascript
Deal = {
  id, createdAt, updatedAt,
  vehicle: { year, make, model, trim, mileage, zip },
  condition: { rating: 1-5, flags: string[] },
  photos: string[], // data URLs
  price: { low, mid, high, explanation },
  status: 'researching'|'visiting'|'pending_finance'|'walked_away'|'purchased',
  notes: string
}
```

## 🎨 Customization

### Changing App Name
The app name is set to "The Car Coach App" and can be changed by updating:
- `src/pages/Onboarding.jsx` (line 8)
- `src/pages/Settings.jsx` (line 117)
- `src/App.jsx` (line 205)
- `README.md` (this file)

### Updating Logo
Replace `public/assets/logo.svg` with your own 48x48 SVG. The app will automatically use it in the header.

### Branding Colors
Update CSS variables in `src/styles/variables.css`:
```css
:root {
  --color-primary: #3B82F6;     /* Main brand color */
  --color-primary-dark: #2563EB; /* Hover states */
  --color-primary-light: #60A5FA; /* Light variants */
}
```

## 💾 Data Management

### Export Data
- Go to Settings → Export Backup
- Downloads `car-coach-backup.json` with all deals, notes, and photos

### Import Data
- Go to Settings → Import Backup
- Select previously exported JSON file
- All data will be restored

### Clear All Data
- Go to Settings → Clear All Data
- Permanently deletes all local data
- Cannot be undone

## 🔧 Supabase Integration

The app is ready for backend integration. Connection points are in `src/lib/supabase-hooks.js`:

### Setup Steps
1. Create Supabase project
2. Add environment variables:
   ```bash
   REACT_APP_SUPABASE_URL=your_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Update `src/lib/supabase-hooks.js` with your credentials
4. Implement the stubbed functions:
   - `initSupabase()` - Initialize client
   - `supabaseSync.syncDeals()` - Sync deals to database
   - `supabaseSync.syncNotes()` - Sync notes and photos
   - `realtimeSubscriptions` - Real-time updates

### Database Schema
The app includes commented schema definitions in `supabase-hooks.js` for:
- `deals` table
- `checklist_items` table  
- `notes` table

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── DealCard.jsx
│   ├── PriceRange.jsx
│   ├── PhotoUploader.jsx
│   ├── ProgressDots.jsx
│   ├── RangeBadge.jsx
│   └── ConfirmModal.jsx
├── pages/              # Main application pages
│   ├── Onboarding.jsx
│   ├── CreateDeal.jsx
│   ├── SavedDeals.jsx
│   ├── Checklist.jsx
│   ├── Notes.jsx
│   └── Settings.jsx
├── lib/                # Utilities and business logic
│   ├── storage.js      # localStorage utilities
│   ├── pricing.js      # Price calculation algorithms
│   ├── validators.js   # Input validation
│   ├── routing.js      # Hash-based routing
│   └── supabase-hooks.js # Backend integration stubs
├── styles/             # CSS and theming
│   ├── variables.css   # CSS custom properties
│   └── globals.css     # Global styles and components
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## 🎯 Routing

Hash-based routing system:
- `#/onboarding` - Welcome screens
- `#/create` - Create new deal wizard
- `#/saved` - Saved deals list
- `#/checklist` - Negotiation checklist
- `#/notes` - Notes and photos
- `#/settings` - App settings

## 🎨 UI Features

### Animations & Interactions
- **Smooth Transitions**: CSS-based page transitions
- **Hover Effects**: Scale + shadow on buttons and cards
- **Floating SVGs**: Gentle keyframe animations in onboarding
- **Focus States**: Keyboard navigation support
- **Reduced Motion**: Respects `prefers-reduced-motion`

### Responsive Design
- **Mobile-First**: Optimized for phones
- **Desktop**: Scales beautifully to larger screens
- **Touch-Friendly**: Large tap targets and gestures

### Accessibility
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG compliant color schemes

## 🚀 Performance

### Optimizations
- **No External Dependencies**: Lean bundle size
- **CSS Variables**: Efficient theming
- **Local Storage**: Fast data persistence
- **Lazy Loading**: Images load on demand
- **SVG Icons**: Scalable and lightweight

### Bundle Analysis
```bash
npm run build
# Check dist/ folder for optimized assets
```

## 🧪 Development

### Code Quality
- **ESLint**: Configured for React best practices
- **No Console Errors**: Clean development experience
- **TypeScript Ready**: Easy to migrate if needed

### Testing Strategy
- **Manual Testing**: All features tested across devices
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive**: Tested on mobile, tablet, desktop

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
1. Check the documentation above
2. Review the code comments
3. Test in different browsers
4. Check browser console for errors

---

**Built with ❤️ using React + Vite**