# KeyNest 🏡🔑

> A lightweight, offline-friendly rental management system tailored for Kenyan landlords and property managers.

KeyNest simplifies property management by helping landlords track units, collect rent via M-Pesa, and automate communication with tenants, even on low-end devices and slow internet connections.

---

## 👥 User Roles

- **Landlord/Property Manager**: Access via Web Dashboard. Full control over properties, units, tenants, and collections.
- **Caretaker**: Access via Web/Mobile Dashboard. View restricted to assigned properties. Features **Customizable Permissions** delegated by the Landlord (e.g., viewing rent payment status to follow up on defaulters, approving leases).
- **Tenant**: Access via Mobile App (Android-focused). Pay rent via M-Pesa, view payment history, and submit maintenance requests.
- **System Admin**: Backend oversight and support.

## ✅ Core Features (MVP)

- **Property & Unit Management**: Setup property details, unit types, rent amounts, and current status (vacant/occupied).
- **Tenant Tracking & Onboarding**: Manage tenant profiles, lease dates, and security deposits. Includes an approval workflow where caretakers are notified to receive and approve new tenants.
- **M-Pesa Rent Collection**: Integrated M-Pesa Daraja STK Push for seamless rent payments. Auto-records payments and generates PDF receipts.
- **Communication & Messaging**: 
  - **In-App Chat**: Direct messaging between Landlords, Caretakers, and Tenants.
  - **Automated Alerts**: SMS/WhatsApp integration (via Africa's Talking) for rent due reminders, late alerts, and payment confirmations.
  - **System Notifications**: In-app alerts for lease approvals, new messages, and system events.
- **Landlord Dashboard**: Overview of monthly collections, arrears lists, and vacancy tracking. Allows delegating specific permissions to Caretakers.
- **Caretaker Dashboard**: A view of assigned properties tailored by **Delegated Permissions**. The Landlord can toggle what the Caretaker sees (e.g., allowing them to view rent arrears to take action against defaulters, while still hiding overall cash flow if desired). Automatically updates with new tenants when they sign up.
- **Maintenance Logs**: Basic ticketing system for tenants to submit issues and landlords/caretakers to update statuses.
- **Role-Based Access Control**: Strict data isolation ensuring landlords and caretakers only see their respective properties and have appropriate permission levels.

## 🛠️ Technology Stack (Recommended)

- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Frontend (Web)**: React.js (Next.js or Vite)
- **Mobile (Tenant)**: Flutter (Offline-first architecture)
- **APIs**: M-Pesa Daraja API (Payments), Africa's Talking API (SMS)
- **Auth**: JWT-based Authentication
- **Hosting**: DigitalOcean / AWS (or local Kenyan cloud)

## ⚠️ Key Constraints & Principles

- **Performance First**: Optimized for low-end Android devices and slow/intermittent internet connections.
- **Offline Capabilities**: View critical data offline; background sync when connection is restored.
- **Data-Light Design**: No heavy media; form-driven inputs.
- **Localization**: Swahili/English toggle for UI labels.
- **UX Rule**: Max 3 clicks to pay rent or send a reminder. Clear status badges (Paid / Pending / Late).

## 🚀 Quick Start (Development)

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- M-Pesa Daraja Developer Account credentials

### Setup

*Detailed setup instructions will be provided as the repository is scaffolded.*

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/keynest.git
   ```
2. Navigate to the backend directory and install dependencies:
   ```bash
   cd keynest/backend
   npm install
   ```
3. Set up your `.env` variables for Database and M-Pesa keys.
4. Run migrations:
   ```bash
   npm run migrate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 API & Integrations

- Check `/backend/docs` for REST API documentation.
- Check `/backend/src/services/mpesa` for Daraja API logic.

## 📄 License

This project is licensed under the MIT License.
