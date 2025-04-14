# Health Monitoring System

A comprehensive web application for healthcare management and monitoring.

## Features

- **User Health Dashboard**: Track health metrics, appointments, and medical history
- **Secure Authentication**: Email and OTP-based authentication for patients
- **Doctor Assignment**: View assigned doctor details and medical recommendations
- **Hospital Locator**: Find the nearest hospital with contact information
- **Health Metrics Tracking**: Monitor vital signs and health parameters over time

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Custom email and OTP-based authentication system
- **Data Visualization**: Custom charts for health metrics visualization
- **Responsive Design**: Mobile-first approach for all devices

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/health-monitoring-system.git

# Navigate to the project
cd health-monitoring-system

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

- `src/app`: Main application pages
  - `src/app/login`: Authentication pages
  - `src/app/user/health`: User health dashboard
- `src/components`: Reusable UI components
- `public`: Static assets

## Workflows

1. **User Login**:

   - Enter email → Receive OTP → Enter 4-digit OTP → Access Health Dashboard

2. **Health Monitoring**:

   - View current health metrics → Track changes over time → Get alerts for abnormal readings

3. **Doctor Consultation**:
   - View assigned doctor → Schedule appointments → Receive medical guidance

## Future Enhancements

- Real-time health data integration with wearable devices
- Telemedicine video consultation features
- Prescription management system
- Health insurance integration
- Advanced health analytics and predictions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
