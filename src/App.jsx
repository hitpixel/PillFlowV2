import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import { ToastProvider } from './components/ui/use-toast';

// Import pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const WebsterPackDetail = React.lazy(() => import('./pages/WebsterPackDetail'));
const Customers = React.lazy(() => import('./pages/Customers'));
const CustomerDetail = React.lazy(() => import('./pages/CustomerDetail'));
const WebsterPacks = React.lazy(() => import('./pages/WebsterPacks'));
const Schedule = React.lazy(() => import('./pages/Schedule'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Main layout routes */}
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="webster-packs" element={<WebsterPacks />} />
            <Route path="webster-packs/:id" element={<WebsterPackDetail />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </ToastProvider>
  );
}

export default App; 