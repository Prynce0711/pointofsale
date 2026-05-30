# Bean Counter POS

A coffee shop point-of-sale and operations suite built with Next.js, Tailwind CSS, and Framer Motion. It includes an animated login experience, a persistent app shell, and smooth transitions across POS, inventory, sales, and reporting views.

## Highlights

- Coffee-themed UI with warm palette and premium typography
- POS cart and checkout flow with live totals
- Inventory, sales history, reports, attendance, and employees modules
- Smooth page transitions with a persistent app shell
- Prisma + SQLite data layer

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Framer Motion
- Prisma + SQLite

## App Routes

- Login / landing: app/(auth)/page.tsx
- Dashboard sections (shared layout): app/(app)/
  - dashboard
  - pos
  - inventory
  - sales
  - reports
  - attendance
  - employees

## Project Structure

- app/(auth) - login route group (with loading screen)
- app/(app) - authenticated routes wrapped by persistent layout
- components/layout - AppShell, Header, Footer, Sidebar
- components/common - shared utilities like PageTransition
- components/ui - reusable UI elements (buttons, cards, tables)
- features - feature-specific UI for auth, dashboard, inventory, POS, etc.
- lib - shared utilities (auth, prisma, formatting, labels)
- prisma - Prisma schema and migrations

## File Organization

```
app/
  globals.css
  layout.tsx
  (auth)/
    loading.tsx
    page.tsx
  (app)/
    layout.tsx
    dashboard/
      page.tsx
    pos/
      page.tsx
    inventory/
      page.tsx
      new/
        page.tsx
      [id]/
        edit/
          page.tsx
    sales/
      page.tsx
    reports/
      page.tsx
    attendance/
      page.tsx
    employees/
      page.tsx
components/
  layout/
    AppShell.tsx
    Header.tsx
    Footer.tsx
    Sidebar.tsx
    index.ts
  common/
    PageTransition.tsx
  ui/
features/
  auth/
    components/
      LoginPage.tsx
  dashboard/
    components/
      Dashboard.tsx
  pos/
    components/
      POSClient.tsx
  inventory/
    components/
      InventoryPage.tsx
      ProductForm.tsx
      StockAdjustmentForm.tsx
  sales/
    components/
      SalesHistoryPage.tsx
  reports/
    components/
      ReportsPage.tsx
  attendance/
    components/
      AttendancePage.tsx
      AttendanceControls.tsx
  employees/
    components/
      EmployeesPage.tsx
      EmployeeForm.tsx
lib/
  auth.ts
  auth-constants.ts
  format.ts
  labels.ts
  navigation.ts
  prisma.ts
  ui.ts
  validation.ts
prisma/
  schema.prisma
public/
README.md
```

## Setup & Run

1. Install dependencies

```bash
pnpm install
```

2. Create a local .env file

```bash
DATABASE_URL="file:./dev.db"
AUTH_SECRET="replace-with-a-long-random-secret"
```

3. Generate Prisma client

```bash
pnpm prisma:generate
```

4. Run database migrations

```bash
pnpm prisma:migrate
```

5. Start the dev server

```bash
pnpm dev
```

Open http://localhost:3000

## Environment Variables

Set these in .env:

- DATABASE_URL - SQLite connection string (example: file:./dev.db)
- AUTH_SECRET - long random secret for session auth

## Scripts

- pnpm dev - start dev server
- pnpm build - production build
- pnpm start - start production server
- pnpm lint - run ESLint
- pnpm prisma:generate - generate Prisma client
- pnpm prisma:migrate - run Prisma migrations

## UI Notes

- Page transitions are handled by components/common/PageTransition.tsx
- Sidebar is mounted in app/(app)/layout.tsx to stay stable across navigations
- Root background is set in app/globals.css to prevent white flashes
