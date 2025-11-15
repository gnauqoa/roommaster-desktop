# Room Master - Hotel Management System

A comprehensive Hotel Management System built with Tauri, React, TypeScript, Redux Toolkit, and shadcn/ui.

## Features

- 🔐 Authentication & Authorization
- 🏨 Room & Room Type Management
- 📅 Reservation System with Availability Search
- ✅ Check-in/Check-out Processing
- 💼 Service Catalog Management
- 👥 Employee Management
- 💰 Invoice Generation & Billing
- 📊 Dashboard with KPIs and Charts
- 🎨 Modern UI with Tailwind CSS & shadcn/ui
- 🌍 Internationalization (i18n) - English & Vietnamese support

## Technology Stack

### Frontend

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Redux Toolkit** - State Management
- **React Router** - Routing
- **Axios** - HTTP Client
- **shadcn/ui** - UI Components
- **Tailwind CSS** - Styling
- **Recharts** - Data Visualization
- **Lucide React** - Icons
- **date-fns** - Date Utilities
- **react-i18next** - Internationalization

### Backend (Mock)

- **json-server** - Mock REST API

### Desktop Framework

- **Tauri** - Desktop Application Framework

## Project Structure

```
src/
├── api/              # Axios configuration & API endpoints
├── redux/            # Redux store & slices configuration
├── components/       # React components
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Layout components (Sidebar, MainLayout)
│   └── shared/       # Shared components (LoadingSpinner, LanguageSwitcher, etc.)
├── i18n/             # Internationalization setup
│   ├── config.ts     # i18n configuration
│   └── locales/      # Translation files (en, vi)
├── pages/            # Page components (10 main screens)
├── routes/           # Route configuration
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
└── mock/             # Mock API data (json-server)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Rust and Cargo (for Tauri development)

### Installation

1. **Install dependencies:**

   ```bash
   yarn
   ```

2. **Start the mock API server:**

   ```bash
   yarn mock
   ```

   This will start json-server on `http://localhost:3001`

3. **Start the development server** (in a new terminal):

   ```bash
   yarn dev
   ```

   This will start Vite dev server on `http://localhost:1420`

4. **Start Tauri (dektop app):**
   > **Important:** Tauri requires Rust and Cargo to be installed on your system.  
   > If you haven’t installed Rust yet, please follow the instructions at [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install) before running the desktop app.
   ```bash
   yarn tauri:dev
   ```

### Running the Application

The application will be available at `http://localhost:1420` when running the dev server.

## Demo Credentials

### Admin Account

- Email: `admin@roommaster.com`
- Password: `admin123`

### Receptionist Account

- Email: `receptionist@roommaster.com`
- Password: `reception123`

### Manager Account

- Email: `manager@roommaster.com`
- Password: `manager123`

## Available Scripts

- `yarn dev` - Start Vite development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn mock:api` - Start json-server mock API
- `yarn tauri:dev` - Start Tauri in development mode
- `yarn tauri:build` - Build Tauri application
- `yarn tauri:check` - Check Tauri configuration

## Application Features

### 1. Dashboard

- KPI cards (Total Rooms, Occupancy Rate, Today's Revenue, Check-ins Today)
- Revenue trend chart (last 7 days)
- Room status distribution chart
- Quick statistics

### 2. Room Management

- Room Types CRUD operations
- Rooms CRUD operations
- Room status management (Available, Occupied, Cleaning, Maintenance)
- Filter rooms by status

### 3. Reservation Management

- Search room availability by date range
- Create, update, and cancel reservations
- Conflict detection (prevents double booking)
- View all reservations with filtering

### 4. Check-in

- View today's expected check-ins
- Process check-in with deposit collection
- Automatic room status update to "occupied"
- Search by guest name or ID

### 5. Check-out

- View occupied rooms
- Calculate total bill (room charges + services + tax - deposit)
- Generate invoice
- Automatic room status update to "cleaning"
- Payment method selection

### 6. Services

- Service catalog management
- Categories: Food & Beverage, Laundry, Spa, Transport, Other
- Add services to guest stays (Note: UI only, full implementation pending)

### 7. Employees

- Employee management with CRUD operations
- Role assignment (Admin, Receptionist, Manager, Housekeeper, Maintenance)
- Status tracking (Active/Inactive)

### 8. Invoices

- View all invoices
- Search by ID
- Filter by date
- Detailed invoice breakdown
- Payment method tracking

## API Integration

The application is currently configured to use a mock API (json-server). To switch to a real backend:

1. Create a `.env` file in the project root
2. Set the API base URL:
   ```
   VITE_API_BASE_URL=https://your-api-url.com
   ```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API endpoint specifications.

## Mock Data

The mock database includes:

- 3 users (admin, receptionist, manager)
- 4 room types
- 20 rooms across 5 floors
- 6 sample reservations
- 5 rental slips (check-ins)
- 6 services
- 5 employees
- 2 sample invoices

## State Management

The application uses Redux Toolkit with the following slices:

- `auth` - Authentication state
- `roomTypes` - Room type management
- `rooms` - Room management
- `reservations` - Reservation management
- `checkIn` - Check-in operations
- `checkOut` - Check-out operations
- `services` - Service catalog
- `employees` - Employee management
- `invoices` - Invoice tracking
- `dashboard` - Dashboard KPIs and data

All data fetching uses `createAsyncThunk` with centralized error handling.

## Internationalization (i18n)

The application supports multiple languages with English and Vietnamese currently implemented.

### Features

- 🌍 Language switcher in sidebar
- 💾 Language preference persistence (localStorage)
- 📝 Comprehensive translations for all UI elements
- 🔄 Seamless language switching without page reload
- 📅 Locale-aware date and number formatting

### Supported Languages

- **English (EN)** - Default
- **Tiếng Việt (VI)** - Vietnamese

### Usage

Users can switch languages using the language switcher button in the sidebar. The selected language is automatically saved and persisted across sessions.

### For Developers

See [TRANSLATION_GUIDE.md](./TRANSLATION_GUIDE.md) for detailed information on:
- Adding new translations
- Translation file structure
- Vietnamese translation guidelines
- Best practices

See [I18N_IMPLEMENTATION_STATUS.md](./I18N_IMPLEMENTATION_STATUS.md) for implementation status and remaining tasks.

## Future Enhancements

- Real-time notifications
- Advanced reporting and analytics
- Guest history tracking
- Housekeeping task management
- Inventory management
- Additional language support (French, Spanish, etc.)
- Role-based access control (RBAC)
- Export to PDF/Excel
- Email notifications

## Build for Production

### Web Application

```bash
yarn build
```

### Desktop Application (Tauri)

```bash
yarn tauri:build
```

This will create platform-specific installers in `src-tauri/target/release/bundle/`

## Troubleshooting

### Port Already in Use

If port 3001 (mock API) or 1420 (Vite) is already in use:

- Kill the process using that port
- Or modify the port in the respective configuration files

### Module Not Found Errors

```bash
yarn install
```

### Tailwind Classes Not Working

Make sure the Tailwind config and PostCSS config are properly set up. Try:

```bash
yarn build
yarn dev
```

## Contributing

This is a demonstration project. For production use, ensure:

- Proper authentication and security
- Input validation and sanitization
- Error boundaries and fallback UI
- Comprehensive testing
- Production-ready backend API

## License

MIT

## Support

For questions and support, please refer to the documentation or create an issue in the repository.

---

Built with ❤️ using React, TypeScript, and Tauri
