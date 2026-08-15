import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Architecture } from './pages/Architecture';
import { AppShell } from './components/layout/AppShell';
import { Overview } from './pages/Overview';
import { QuantStudio } from './pages/QuantStudio';
import { DataMart } from './pages/DataMart';
import { Aiden } from './pages/Aiden';
import { Customer360 } from './pages/Customer360';
import { ProductIntelligence } from './pages/ProductIntelligence';
import { DataHub } from './pages/DataHub';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { QueryStudio } from './pages/QueryStudio';
import { InsightEngine } from './pages/InsightEngine';
import { WorkflowEngine } from './pages/WorkflowEngine';

function isAuthenticated(): boolean {
  try {
    const user = localStorage.getItem('AUREX_AUTH_USER');
    return !!user;
  } catch {
    return false;
  }
}

// Redirects logged-in users away from /login to /app/overview
function PublicOnly({ children }: { children: React.ReactNode }) {
  if (isAuthenticated()) {
    return <Navigate to="/app/overview" replace />;
  }
  return <>{children}</>;
}

// Redirects unauthenticated users to /login
function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Root Home Route */}
      <Route
        path="/"
        element={
          isAuthenticated() ? (
            <Navigate to="/app/overview" replace />
          ) : (
            <Landing />
          )
        }
      />

      {/* Login & Auth Gateway */}
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Auth />
          </PublicOnly>
        }
      />
      <Route path="/landing" element={<Landing />} />
      <Route path="/security" element={<Navigate to="/app/architecture?tab=security" replace />} />
      <Route path="/architecture" element={<Navigate to="/app/architecture?tab=blueprint" replace />} />

      {/* Authenticated Platform Workspace */}
      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/app/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="aiden" element={<Aiden />} />
        <Route path="datamart" element={<DataMart />} />
        <Route path="query-studio" element={<QueryStudio />} />
        <Route path="datamart/query-studio" element={<QueryStudio />} />
        <Route path="quant" element={<QuantStudio />} />
        <Route path="data" element={<DataHub />} />
        <Route path="insights" element={<InsightEngine />} />
        <Route path="workflows" element={<WorkflowEngine />} />
        <Route path="architecture" element={<Architecture />} />

        {/* Tabbed Navigation Redirects */}
        <Route path="pitch" element={<Navigate to="/app/architecture?tab=pitch" replace />} />
        <Route path="intelligence" element={<Navigate to="/app/architecture?tab=telemetry" replace />} />

        {/* User Identity & Platform Configuration */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="customers/:id" element={<Customer360 />} />
        <Route path="products/:sku" element={<ProductIntelligence />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
