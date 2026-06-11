import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Settings,
  UsersRound,
  WalletCards,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", path: "/leads", icon: UsersRound },
  { label: "Deals", path: "/deals", icon: BriefcaseBusiness },
  { label: "Customers", path: "/customers", icon: WalletCards },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Settings", path: "/settings", icon: Settings },
];

export const leads = [
  { id: 1, name: "Avery Stone", company: "Apex Studio", email: "avery@apex.studio", score: 94, source: "Website", status: "Hot" },
  { id: 2, name: "Mina Rahman", company: "CloudNest", email: "mina@cloudnest.io", score: 88, source: "Referral", status: "Qualified" },
  { id: 3, name: "Ethan Brooks", company: "BrightFlow", email: "ethan@brightflow.co", score: 72, source: "LinkedIn", status: "Nurture" },
  { id: 4, name: "Sofia Chen", company: "ScalePoint", email: "sofia@scalepoint.ai", score: 91, source: "Webinar", status: "Hot" },
  { id: 5, name: "Noah Carter", company: "Northstar Labs", email: "noah@northstarlabs.com", score: 66, source: "Ads", status: "New" },
  { id: 6, name: "Lina Patel", company: "OrbitStack", email: "lina@orbitstack.dev", score: 81, source: "Website", status: "Qualified" },
  { id: 7, name: "Omar Hassan", company: "RevenueOps", email: "omar@revenueops.com", score: 58, source: "Referral", status: "New" },
  { id: 8, name: "Grace Kim", company: "PulsePilot", email: "grace@pulsepilot.io", score: 76, source: "LinkedIn", status: "Nurture" },
];

export const dealColumns = [
  {
    stage: "New",
    value: "$48K",
    deals: [
      { title: "Apex dashboard rollout", company: "Apex Studio", owner: "Sarah", amount: "$12K" },
      { title: "Lead scoring pilot", company: "OrbitStack", owner: "Mia", amount: "$9K" },
    ],
  },
  {
    stage: "Discovery",
    value: "$72K",
    deals: [
      { title: "Enterprise reporting suite", company: "CloudNest", owner: "David", amount: "$28K" },
      { title: "CRM migration", company: "Northstar Labs", owner: "Omar", amount: "$16K" },
    ],
  },
  {
    stage: "Proposal",
    value: "$54K",
    deals: [
      { title: "Revenue intelligence sprint", company: "ScalePoint", owner: "Sarah", amount: "$21K" },
    ],
  },
  {
    stage: "Negotiation",
    value: "$39K",
    deals: [
      { title: "Executive KPI workspace", company: "RevenueOps", owner: "Mia", amount: "$18K" },
    ],
  },
  {
    stage: "Won",
    value: "$61K",
    deals: [
      { title: "Customer health dashboard", company: "BrightFlow", owner: "David", amount: "$24K" },
      { title: "Quarterly board report", company: "PulsePilot", owner: "Omar", amount: "$13K" },
    ],
  },
];

export const customerProfiles = [
  {
    company: "CloudNest",
    contact: "Mina Rahman",
    plan: "Enterprise",
    revenue: "$18,900",
    health: 92,
    timeline: ["Renewal forecast upgraded", "QBR report exported", "3 product seats added"],
  },
  {
    company: "Apex Studio",
    contact: "Avery Stone",
    plan: "Growth",
    revenue: "$8,400",
    health: 84,
    timeline: ["Proposal opened twice", "Demo completed", "Lead score rose to 94"],
  },
  {
    company: "BrightFlow",
    contact: "Ethan Brooks",
    plan: "Starter",
    revenue: "$2,100",
    health: 73,
    timeline: ["Support ticket resolved", "Usage up 18%", "Invoice paid"],
  },
];

export const acquisitionData = [
  { source: "Website", leads: 420 },
  { source: "Referral", leads: 280 },
  { source: "LinkedIn", leads: 230 },
  { source: "Webinar", leads: 190 },
  { source: "Ads", leads: 150 },
];

export const conversionData = [
  { month: "Jan", conversion: 18, acquisition: 42 },
  { month: "Feb", conversion: 21, acquisition: 48 },
  { month: "Mar", conversion: 23, acquisition: 51 },
  { month: "Apr", conversion: 22, acquisition: 57 },
  { month: "May", conversion: 26, acquisition: 64 },
  { month: "Jun", conversion: 29, acquisition: 71 },
];

export const notifications = [
  "3 enterprise leads crossed score 85",
  "Monthly revenue report is ready",
  "CloudNest renewal meeting starts at 4:00 PM",
];

export const quickActions = ["Add Lead", "Create Deal", "Generate Report", "Invite Team"];

export const reports = [
  { title: "June Revenue Summary", type: "Monthly", status: "Ready", date: "Jun 30, 2026" },
  { title: "Q2 Pipeline Review", type: "Quarterly", status: "Draft", date: "Jul 4, 2026" },
  { title: "Lead Source Performance", type: "Monthly", status: "Ready", date: "Jun 24, 2026" },
  { title: "Customer Health Snapshot", type: "Quarterly", status: "Scheduled", date: "Jul 12, 2026" },
];
