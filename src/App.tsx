import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BookingList from "./pages/sales/BookingList";
import ContractManager from "./pages/sales/ContractManager";
import ContractCreate from "./pages/sales/ContractCreate";
import CustomerCare from "./pages/sales/CustomerCare";
import ServiceManager from "./pages/sales/ServiceManager";
import TowelService from "./pages/sales/TowelService";
import WaterService from "./pages/sales/WaterService";
import OtherServices from "./pages/sales/OtherServices";
import SalesReports from "./pages/sales/SalesReports";
import VehicleAssignment from "./pages/operations/VehicleAssignment";
import GPSMonitor from "./pages/operations/GPSMonitor";
import IncidentManager from "./pages/operations/IncidentManager";
import CTVManager from "./pages/operations/CTVManager";
import CTVBooking from "./pages/operations/CTVBooking";
import CTVTracking from "./pages/operations/CTVTracking";
import AlertsManager from "./pages/operations/AlertsManager";
import OperationsReports from "./pages/operations/OperationsReports";
import VehicleList from "./pages/transport/VehicleList";
import DriverList from "./pages/transport/DriverList";
import TransportReports from "./pages/transport/TransportReports"
import MaintenanceSchedule from "./pages/transport/MaintenanceSchedule";
import FuelManagement from "./pages/transport/FuelManagement";
import DebtManagement from "./pages/accounting/DebtManagement";
import InvoiceManager from "./pages/accounting/InvoiceManager";
import PayrollManager from "./pages/accounting/PayrollManager";
import FinancialReports from "./pages/accounting/FinancialReports";
import EmployeeList from "./pages/hrm/EmployeeList";
import EmployeeCreate from "./pages/hrm/EmployeeCreate";
import Attendance from "./pages/hrm/Attendance";
import LeaveManagement from "./pages/hrm/LeaveManagement";
import TaskAssignment from "./pages/hrm/TaskAssignment";
import DocumentApproval from "./pages/hrm/DocumentApproval";
import Degrees from "./pages/hrm/Degrees";
import Contracts from "./pages/hrm/Contracts";
import Certificates from "./pages/hrm/Certificates";
import RoleManagement from "./pages/security/RoleManagement";
import DepartmentManagement from "./pages/security/DepartmentManagement";
import PermissionManagement from "./pages/security/PermissionManagement";
import VehicleRegistration from "./pages/transport/VehicleRegistration";
import VehicleInsurance from "./pages/transport/VehicleInsurance";
import TransportOtherServices from "./pages/transport/OtherServices";
import CompanyStrategy from "./pages/kpi/CompanyStrategy";
import BSCPerspectives from "./pages/kpi/BSCPerspectives";
import KPIManagement from "./pages/kpi/KPIManagement";
import DepartmentKPI from "./pages/kpi/DepartmentKPI";
import IndividualKPI from "./pages/kpi/IndividualKPI";
import KPIDashboard from "./pages/kpi/KPIDashboard";
import CustomerManagement from "./pages/sales/CustomerManagement";
import PricingPerKm from "./pages/transport/PricingPerKm";
import ExpenseManagement from "./pages/accounting/ExpenseManagement";
import TravelDocuments from "./pages/transport/TravelDocuments";
import MultiStopBooking from "./pages/operations/MultiStopBooking";
import BookingCreate from "./pages/sales/BookingCreate";
import DriverManagement from "./pages/transport/DriverManagement";
import InvoiceEmailSync from "./pages/accounting/InvoiceEmailSync";
import HrmDepartmentManagement from "./pages/hrm/DepartmentManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page - No Layout */}
          <Route path="/" element={<Index />} />
          
          {/* App Routes - With Layout */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
          
          <Route element={<Layout />}>
            {/* Sales Routes */}
            <Route path="sales/bookings" element={<BookingList />} />
            <Route path="sales/bookings/create" element={<BookingCreate />} />
            <Route path="sales/contracts" element={<ContractManager />} />
            <Route path="sales/contracts/create" element={<ContractCreate />} />
            <Route path="sales/customer-care" element={<CustomerCare />} />
            <Route path="sales/customers" element={<CustomerManagement />} />
            <Route path="sales/service-manager" element={<ServiceManager />} />
            <Route path="sales/towel-service" element={<TowelService />} />
            <Route path="sales/water-service" element={<WaterService />} />
            <Route path="sales/services" element={<OtherServices />} />
            <Route path="sales/reports" element={<SalesReports />} />
            
            {/* Operations Routes */}
            <Route path="operations/vehicle-assignment" element={<VehicleAssignment />} />
            <Route path="operations/multi-stop-booking" element={<MultiStopBooking />} />
            <Route path="operations/gps-monitor" element={<GPSMonitor />} />
            <Route path="operations/incidents" element={<IncidentManager />} />
            <Route path="operations/ctv-manager" element={<CTVManager />} />
            <Route path="operations/ctv-booking" element={<CTVBooking />} />
            <Route path="operations/ctv-tracking" element={<CTVTracking />} />
            <Route path="operations/alerts" element={<AlertsManager />} />
            <Route path="operations/reports" element={<OperationsReports />} />
            
            {/* Transport Routes */}
            <Route path="transport/vehicles" element={<VehicleList />} />
            <Route path="transport/drivers" element={<DriverList />} />
            <Route path="transport/driver-management" element={<DriverManagement />} />
            <Route path="transport/pricing" element={<PricingPerKm />} />
            <Route path="transport/travel-documents" element={<TravelDocuments />} />
            <Route path="transport/maintenance" element={<MaintenanceSchedule />} />
            <Route path="transport/fuel" element={<FuelManagement />} />
            <Route path="transport/registration" element={<VehicleRegistration />} />
            <Route path="transport/insurance" element={<VehicleInsurance />} />
             <Route path="operations/alerts" element={<AlertsManager />} />
            <Route path="transport/other-services" element={<TransportOtherServices />} />
            <Route path="transport/reports" element={<TransportReports />} />
            
            {/* Accounting Routes */}
            <Route path="accounting/debts" element={<DebtManagement />} />
            <Route path="accounting/invoices" element={<InvoiceManager />} />
            <Route path="accounting/expenses" element={<ExpenseManagement />} />
            <Route path="accounting/invoice-sync" element={<InvoiceEmailSync />} />
            <Route path="accounting/payroll" element={<PayrollManager />} />
            <Route path="accounting/reports" element={<FinancialReports />} />
            
            {/* HRM Routes */}
            <Route path="hrm/employees" element={<EmployeeList />} />
            <Route path="hrm/employees/create" element={<EmployeeCreate />} />
            <Route path="hrm/attendance" element={<Attendance />} />
            <Route path="hrm/leave" element={<LeaveManagement />} />
            <Route path="hrm/departments" element={<HrmDepartmentManagement />} />
            <Route path="hrm/task-assignment" element={<TaskAssignment />} />
            <Route path="hrm/document-approval" element={<DocumentApproval />} />
            <Route path="hrm/degrees" element={<Degrees />} />
            <Route path="hrm/contracts" element={<Contracts />} />
            <Route path="hrm/certificates" element={<Certificates />} />
            
            {/* Security Routes */}
            <Route path="security/roles" element={<RoleManagement />} />
            <Route path="security/departments" element={<DepartmentManagement />} />
            <Route path="security/permissions" element={<PermissionManagement />} />
            
            {/* KPI Routes */}
            <Route path="kpi/strategy" element={<CompanyStrategy />} />
            <Route path="kpi/bsc" element={<BSCPerspectives />} />
            <Route path="kpi/management" element={<KPIManagement />} />
            <Route path="kpi/department" element={<DepartmentKPI />} />
            <Route path="kpi/individual" element={<IndividualKPI />} />
            <Route path="kpi/dashboard" element={<KPIDashboard />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
