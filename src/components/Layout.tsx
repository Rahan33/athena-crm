import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Users, LayoutDashboard, MessageSquare, Video, FolderGit2, Zap, LogOut, 
  Briefcase, UserSquare2, Receipt, PhoneCall, Clock, DollarSign, Target, 
  UserCog, Bot, CheckSquare, LifeBuoy, Package, ShieldCheck, Laptop, Menu, X, MapPin, Cloud, Lock,
  FileSpreadsheet, Compass, FileCheck, Mail, GitBranch, BarChart3, Award,
  UserCheck, BellRing, FileCheck2, FolderLock, Megaphone, HeartHandshake, Scale, Building2,
  Fingerprint, CalendarCheck, CalendarDays, Timer, Camera, Smartphone,
  FileText, ShoppingCart, BadgeDollarSign, PhoneForwarded
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import SideHUD from './SideHUD';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHudOpen, setIsHudOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-close mobile sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Expand HUD on large screens by default
  useEffect(() => {
    if (window.innerWidth >= 1280) {
      setIsHudOpen(true);
    }
  }, []);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'Admin';

  const navItems = [
    { name: 'Unified Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Directory', href: '/directory', icon: Users },
    { name: 'Chat & Collaboration', href: '/chat', icon: MessageSquare },
    { name: 'Video Meetings', href: '/meetings', icon: Video },
    { name: 'Files Vault', href: '/files', icon: FolderGit2 },
  ];

  const crmNavItems = [
    { name: 'CRM Overview', href: '/crm', icon: Briefcase },
    { name: 'Leads Pipeline', href: '/crm/leads', icon: Users },
    { name: 'Customers & Accounts', href: '/crm/customers', icon: UserSquare2 },
    { name: 'Tickets & Field Service', href: '/crm/tickets', icon: LifeBuoy },
    { name: 'Deals & Quotes', href: '/crm/deals', icon: BadgeDollarSign },
    { name: 'Goals & Campaigns', href: '/crm/campaigns', icon: Target },
    { name: 'Cloud Telephony', href: '/crm/telephony', icon: PhoneForwarded },
    { name: 'Sales Documents', href: '/crm/sales', icon: Receipt },
    { name: 'Communications', href: '/crm/communications', icon: PhoneCall },
  ];

  const erpNavItems = [
    { name: 'Purchase Entry & GRN', href: '/erp/purchases', icon: ShoppingCart },
    { name: 'Inventory & BOM', href: '/erp/inventory', icon: Package },
    { name: 'Projects & Tasks', href: '/erp/projects', icon: FolderGit2 },
    { name: 'Asset Lifecycle', href: '/erp/assets', icon: Laptop },
    { name: 'Expenses & Claims', href: '/erp/expenses', icon: Receipt },
    { name: 'Admin Console & Isolation', href: '/erp/admin', icon: ShieldCheck },
  ];

  const financeNavItems = [
    { name: 'Invoicing & WhatsApp Bills', href: '/erp/invoicing', icon: FileText },
    { name: 'Financial Ledger & BRS', href: '/erp/finance', icon: DollarSign },
    { name: 'Payroll & Statutory Hub', href: '/hem/payroll', icon: Receipt },
  ];

  const hrNavItems = [
    { name: 'HR Overview', href: '/hr', icon: LayoutDashboard },
    { name: 'Employee Info', href: '/hr/employee-info', icon: Users },
    { name: 'Workforce Ops & Rosters', href: '/hem/employees', icon: Users },
    { name: 'Attendance & Swipes', href: '/hem/attendance', icon: Fingerprint },
    { name: 'Facial AI Kiosk', href: '/hem/facial-attendance', icon: Camera },
    { name: 'Leave Management', href: '/hem/leave', icon: CalendarCheck },
    { name: 'Shift Management', href: '/hem/shifts', icon: CalendarDays },
    { name: 'Overtime (OT)', href: '/hem/overtime', icon: Timer },
    { name: 'Digital Onboarding', href: '/hem/onboarding', icon: UserCheck },
    { name: 'Recruitment ATS', href: '/recruitment', icon: Briefcase },
    { name: 'Performance & Goals', href: '/hem/performance', icon: Target },
    { name: 'Document Vault', href: '/hr/documents', icon: FolderLock },
    { name: 'Labour Law Reports', href: '/hr/labour-law-reports', icon: Scale },
    { name: 'Exit Management', href: '/hem/exit', icon: LogOut },
  ];

  const dashboardNavItems = [
    { name: 'Employee Portal', href: '/dashboards/employee', icon: UserSquare2 },
    { name: 'Manager View', href: '/dashboards/manager', icon: Target },
    { name: 'HR View', href: '/dashboards/hr', icon: Users },
    { name: 'Mobile ESS App', href: '/mobile-ess', icon: Smartphone },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Central Approvals', href: '/approvals', icon: ShieldCheck });
  }

  const allModules = [
    ...navItems.map(i => ({ ...i, category: 'General' })),
    ...crmNavItems.map(i => ({ ...i, category: 'Front Office (CRM & Sales)' })),
    ...erpNavItems.map(i => ({ ...i, category: 'Operations (Supply Chain)' })),
    ...financeNavItems.map(i => ({ ...i, category: 'Back Office & Finance' })),
    ...hrNavItems.map(i => ({ ...i, category: 'People Layer (HRM)' })),
    ...dashboardNavItems.map(i => ({ ...i, category: 'Dashboards' }))
  ];

  const deepFeatures = [
    { name: 'Storage Rules & Bin Locations', href: '/erp/inventory', icon: Package, category: 'Inventory Tasks' },
    { name: 'Stock Adjustments', href: '/erp/inventory', icon: Package, category: 'Inventory Tasks' },
    { name: 'Bill of Materials (BOM)', href: '/erp/inventory', icon: GitBranch, category: 'Inventory Tasks' },
    { name: 'Purchase Orders (PO)', href: '/erp/purchases', icon: ShoppingCart, category: 'Procurement' },
    { name: 'Goods Receipt Note (GRN)', href: '/erp/purchases', icon: FileCheck, category: 'Procurement' },
    { name: 'Vendor Bills & Payments', href: '/erp/purchases', icon: Receipt, category: 'Procurement' },
    { name: 'Journal Entries', href: '/erp/finance', icon: DollarSign, category: 'Finance Tasks' },
    { name: 'Chart of Accounts', href: '/erp/finance', icon: DollarSign, category: 'Finance Tasks' },
    { name: 'Trial Balance & P&L', href: '/erp/finance', icon: BarChart3, category: 'Finance Tasks' },
    { name: 'Ind-AS Schedule III', href: '/erp/finance', icon: FileSpreadsheet, category: 'Finance Tasks' },
    { name: 'WhatsApp Bills & Links', href: '/erp/invoicing', icon: PhoneCall, category: 'Invoicing' },
    { name: 'Proforma Invoices', href: '/erp/invoicing', icon: FileText, category: 'Invoicing' },
    { name: 'Employee Leave Requests', href: '/hem/leave', icon: CalendarCheck, category: 'HR Tasks' },
    { name: 'Leave Approvals', href: '/approvals', icon: CheckSquare, category: 'HR Tasks' },
    { name: 'Facial AI Registration', href: '/hem/facial-attendance', icon: Camera, category: 'HR Tasks' },
    { name: 'Performance KPIs & Reviews', href: '/hem/performance', icon: Target, category: 'HR Tasks' },
    { name: 'PF & ESI Reports', href: '/hr/labour-law-reports', icon: Scale, category: 'HR Compliance' },
    { name: 'Field Service Routing', href: '/crm/tickets', icon: Compass, category: 'Service' },
    { name: 'Customer Support Tickets', href: '/crm/tickets', icon: LifeBuoy, category: 'Service' },
    { name: 'Quotations & Proposals', href: '/crm/deals', icon: BadgeDollarSign, category: 'Sales Tasks' },
    { name: 'Deal Kanban Pipeline', href: '/crm/deals', icon: LayoutDashboard, category: 'Sales Tasks' },
    { name: 'Email Campaigns', href: '/crm/campaigns', icon: Mail, category: 'Marketing' },
    { name: 'WebRTC Call Logs', href: '/crm/telephony', icon: PhoneForwarded, category: 'Communications' },
    { name: 'Expense Claims', href: '/erp/expenses', icon: Receipt, category: 'Operations' },
    { name: 'Asset Depreciation', href: '/erp/assets', icon: Laptop, category: 'Operations' },
    { name: 'Payslips & Salary', href: '/hem/payroll', icon: DollarSign, category: 'Payroll' },
    { name: 'Shift Rosters', href: '/hem/shifts', icon: CalendarDays, category: 'HR Tasks' },
    { name: 'Batches & Expiry Tracker', href: '/erp/inventory', icon: Package, category: 'Inventory Tasks' },
    { name: 'Low Stock Alerts & Reorder Levels', href: '/erp/inventory', icon: BellRing, category: 'Inventory Tasks' },
    { name: 'Barcode Generation', href: '/erp/inventory', icon: Package, category: 'Inventory Tasks' },
    { name: 'Warehouse Transfers', href: '/erp/inventory', icon: GitBranch, category: 'Inventory Tasks' },
    { name: 'SKU & Variant Management', href: '/erp/inventory', icon: Package, category: 'Inventory Tasks' },
    { name: 'Inventory Valuations (FIFO/LIFO)', href: '/erp/inventory', icon: BarChart3, category: 'Inventory Tasks' },
    { name: 'Supplier Ratings & Vendor Portals', href: '/erp/purchases', icon: UserSquare2, category: 'Procurement' },
    { name: 'Purchase Requisitions (PR) & RFQs', href: '/erp/purchases', icon: ShoppingCart, category: 'Procurement' },
    { name: 'Debit Notes & Purchase Returns', href: '/erp/purchases', icon: Receipt, category: 'Procurement' },
    { name: 'Cash Flow Statement', href: '/erp/finance', icon: DollarSign, category: 'Finance Tasks' },
    { name: 'Bank Reconciliation (BRS)', href: '/erp/finance', icon: FileCheck, category: 'Finance Tasks' },
    { name: 'GST & Tax Filing', href: '/erp/finance', icon: Scale, category: 'Finance Tasks' },
    { name: 'Budgeting & Cost Centers', href: '/erp/finance', icon: Target, category: 'Finance Tasks' },
    { name: 'Income Tax Declarations & TDS', href: '/hem/payroll', icon: Scale, category: 'Payroll' },
    { name: 'Salary Slips & Arrears', href: '/hem/payroll', icon: FileText, category: 'Payroll' },
    { name: 'Sales Orders (SO)', href: '/crm/sales', icon: Receipt, category: 'Sales Tasks' },
    { name: 'Delivery Challans', href: '/crm/sales', icon: Package, category: 'Sales Tasks' },
    { name: 'Lead Scoring & Funnel', href: '/crm/leads', icon: Users, category: 'Sales Tasks' },
    { name: 'SLA Monitoring & Escalations', href: '/crm/tickets', icon: Timer, category: 'Service' },
    { name: 'IT Asset Management', href: '/erp/assets', icon: Laptop, category: 'Operations' },
    { name: 'Warranty Tracking', href: '/erp/assets', icon: ShieldCheck, category: 'Operations' },
    { name: 'Gantt Charts & Milestones', href: '/erp/projects', icon: CalendarDays, category: 'Project Management' },
    { name: 'Timesheets & Resource Allocation', href: '/erp/projects', icon: Clock, category: 'Project Management' },
    { name: 'Diversity Metrics & Turnover', href: '/hr', icon: Users, category: 'HR Analytics' },
    { name: 'Credit Limits & Collections', href: '/erp/finance', icon: BadgeDollarSign, category: 'Finance Tasks' },
    { name: 'Multi-Godown Stock Matrix', href: '/erp/inventory', icon: Package, category: 'Inventory Hub' },
    { name: 'Inter-Godown Transfer Journal', href: '/erp/inventory', icon: GitBranch, category: 'Inventory Hub' },
    { name: 'Manufacturing (BOM & Job Work)', href: '/erp/inventory', icon: FileCheck, category: 'Inventory Hub' },
    { name: 'Physical Stock Verification & Audit', href: '/erp/inventory', icon: ShieldCheck, category: 'Inventory Hub' },
    { name: 'Stock Movement Ledger & Valuation', href: '/erp/inventory', icon: BarChart3, category: 'Inventory Hub' },
    { name: 'Stock Groups & Units of Measure', href: '/erp/inventory', icon: Package, category: 'Inventory Hub' },
    { name: '[Projects] Hub', href: '/erp/projects', icon: LayoutDashboard, category: 'Project Management' },
    { name: 'Role Dashboards (Employee, Manager, HR)', href: '/hr', icon: Users, category: 'HR Suite' },
    { name: 'Business OS Executive Pulse', href: '/os', icon: Target, category: 'Executive Dashboard' },
    { name: 'Multiple Companies Management', href: '/os', icon: Building2, category: 'System Settings' },
    { name: 'Multi-Currency Master', href: '/erp/finance', icon: DollarSign, category: 'Finance Tasks' },
    { name: 'Multi-Location Branches', href: '/os', icon: MapPin, category: 'System Settings' },
    { name: 'Accounting Period Locks', href: '/erp/finance', icon: Lock, category: 'Finance Tasks' },
    { name: 'Document Numbering Series', href: '/erp/invoicing', icon: FileText, category: 'Invoicing' },
    { name: 'Remote Work & Live Collaboration', href: '/chat', icon: MessageSquare, category: 'Communications' },
    { name: 'Cloud Backup & Disaster Recovery', href: '/os', icon: Cloud, category: 'System Settings' },
    { name: 'TallyPrime Edit Log (Audit Trail)', href: '/erp/finance', icon: FileCheck, category: 'Compliance' },
    { name: 'Profit & Loss Statement (P&L)', href: '/erp/finance', icon: BarChart3, category: 'Finance Reports' },
    { name: 'Balance Sheet', href: '/erp/finance', icon: FileSpreadsheet, category: 'Finance Reports' },
    { name: 'Trial Balance', href: '/erp/finance', icon: Scale, category: 'Finance Reports' },
    { name: 'Cash Flow', href: '/erp/finance', icon: DollarSign, category: 'Finance Reports' },
    { name: 'Double-Entry Vouchers', href: '/erp/finance', icon: Receipt, category: 'Finance Tasks' },
    { name: 'GST IMS Inbox', href: '/erp/finance', icon: ShieldCheck, category: 'Finance Compliance' },
    { name: 'Cost Centres', href: '/erp/finance', icon: Building2, category: 'Finance Tasks' },
    { name: 'Budgets & Variance', href: '/erp/finance', icon: Target, category: 'Finance Tasks' },
    { name: 'Financial Ratios', href: '/erp/finance', icon: BarChart3, category: 'Finance Reports' }
  ];

  const combinedSearchIndex = [...allModules, ...deepFeatures];

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : combinedSearchIndex.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderNavLinks = () => (
    <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            location.pathname === item.href 
              ? "bg-blue-50 text-blue-700 font-semibold shadow-xs" 
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <item.icon className={cn("mr-3 h-5 w-5", location.pathname === item.href ? "text-blue-600" : "text-gray-400")} />
          {item.name}
        </Link>
      ))}

      {/* TIER 1: FRONT OFFICE (CRM, SALES & SERVICE) */}
      <div className="pt-4 pb-1">
        <div className="flex items-center justify-between px-3">
          <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Front Office (CRM & Sales)</p>
          {location.pathname.startsWith('/crm') && (
            <span className="text-[9px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.5 rounded tracking-wider">ACTIVE</span>
          )}
        </div>
      </div>
      {crmNavItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            location.pathname === item.href 
              ? "bg-purple-50 text-purple-700 font-semibold shadow-xs" 
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <item.icon className={cn("mr-3 h-5 w-5", location.pathname === item.href ? "text-purple-600" : "text-gray-400")} />
          {item.name}
        </Link>
      ))}

      {/* TIER 2: OPERATIONS (SUPPLY CHAIN & ASSETS) */}
      <div className="pt-4 pb-1">
        <div className="flex items-center justify-between px-3">
          <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Operations (Supply Chain)</p>
          {location.pathname.startsWith('/erp') && !['/erp/finance', '/erp/invoicing'].includes(location.pathname) && (
            <span className="text-[9px] bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.5 rounded tracking-wider">ACTIVE</span>
          )}
        </div>
      </div>
      {erpNavItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            location.pathname === item.href 
              ? "bg-indigo-50 text-indigo-700 font-semibold shadow-xs" 
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <item.icon className={cn("mr-3 h-5 w-5", location.pathname === item.href ? "text-indigo-600" : "text-gray-400")} />
          {item.name}
        </Link>
      ))}

      {/* TIER 3: BACK OFFICE & FINANCE */}
      <div className="pt-4 pb-1">
        <div className="flex items-center justify-between px-3">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Back Office & Finance</p>
          {(location.pathname === '/erp/invoicing' || location.pathname === '/erp/finance' || location.pathname === '/hem/payroll') && (
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded tracking-wider">ACTIVE</span>
          )}
        </div>
      </div>
      {financeNavItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            location.pathname === item.href 
              ? "bg-emerald-50 text-emerald-700 font-semibold shadow-xs" 
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <item.icon className={cn("mr-3 h-5 w-5", location.pathname === item.href ? "text-emerald-600" : "text-gray-400")} />
          {item.name}
        </Link>
      ))}

      {/* TIER 4: PEOPLE LAYER (HRM & WORKFORCE) */}
      <div className="pt-4 pb-1">
        <div className="flex items-center justify-between px-3">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">People Layer (HRM)</p>
          {(location.pathname.startsWith('/hr') || location.pathname.startsWith('/hem') || location.pathname.startsWith('/recruitment')) && location.pathname !== '/hem/payroll' && (
            <span className="text-[9px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded tracking-wider">ACTIVE</span>
          )}
        </div>
      </div>
      {hrNavItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            location.pathname === item.href 
              ? "bg-blue-50 text-blue-700 font-semibold shadow-xs" 
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <item.icon className={cn("mr-3 h-5 w-5", location.pathname === item.href ? "text-blue-600" : "text-gray-400")} />
          {item.name}
        </Link>
      ))}

      {/* ROLE PORTALS */}
      <div className="pt-4 pb-1">
        <div className="flex items-center justify-between px-3">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Role Portals</p>
          {location.pathname.startsWith('/dashboards') && (
            <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded tracking-wider">ACTIVE</span>
          )}
        </div>
      </div>
      {dashboardNavItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            location.pathname === item.href 
              ? "bg-amber-50 text-amber-700 font-semibold shadow-xs" 
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <item.icon className={cn("mr-3 h-5 w-5", location.pathname === item.href ? "text-amber-600" : "text-gray-400")} />
          {item.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans relative overflow-hidden">
      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
      <aside className={cn(
        "bg-white border-r border-gray-200 flex flex-col z-50 shadow-sm transition-transform duration-300 ease-in-out",
        "fixed inset-y-0 left-0 w-64 md:static md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-lg font-extrabold text-blue-600 flex items-center gap-2 tracking-tight">
            <span>Antigravity ERP</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              BUSINESS OS
            </span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {renderNavLinks()}

        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm uppercase">
              {user?.name ? user.name.substring(0, 2) : 'U'}
            </div>
            <div className="ml-3 truncate max-w-[120px]">
              <p className="text-sm font-semibold text-gray-800 truncate" title={user?.name || 'User'}>
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-gray-500 truncate" title={user?.role || 'Employee'}>
                {user?.role || 'Employee'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300 min-w-0",
        isHudOpen ? "xl:mr-80" : "mr-0"
      )}>
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-xs z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg md:hidden cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-gray-800 truncate">
              {navItems.find((i: any) => i.href === location.pathname)?.name || 
               crmNavItems.find((i: any) => i.href === location.pathname)?.name ||
               erpNavItems.find((i: any) => i.href === location.pathname)?.name ||
               financeNavItems.find((i: any) => i.href === location.pathname)?.name ||
               hrNavItems.find((i: any) => i.href === location.pathname)?.name ||
               dashboardNavItems.find((i: any) => i.href === location.pathname)?.name ||
               'Antigravity ERP'}
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Global Search */}
            <div className="relative" ref={searchContainerRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-32 sm:w-64 pl-8 sm:pl-9 pr-2 sm:pr-4 py-1.5 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-xs sm:text-sm transition-all shadow-inner"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)} onKeyDown={(e) => { if (e.key === 'Enter' && searchResults.length > 0) { navigate(searchResults[0].href); setShowSearchDropdown(false); setSearchQuery(''); } }}
                />
                <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-400" />
              </div>
              
              {showSearchDropdown && searchQuery && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((result, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            navigate(result.href);
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 cursor-pointer transition-colors"
                        >
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                            <result.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{result.name}</p>
                            <p className="text-xs text-gray-500">{result.category}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No modules found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsHudOpen(!isHudOpen)}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-blue-400 rounded-lg text-xs font-semibold shadow-sm transition-all border border-slate-700/80 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span className="hidden sm:inline">{isHudOpen ? 'Side HUD Active' : 'Toggle Side HUD'}</span>
              <span className="sm:hidden">HUD</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
          <Outlet />
        </div>
      </main>

      {/* Dedicated Side HUD Component */}
      <SideHUD isOpen={isHudOpen} onToggle={() => setIsHudOpen(!isHudOpen)} />
    </div>
  );
}


