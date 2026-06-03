// Client-side mock database persisted in localStorage for demo purposes

export interface Company {
  id: number;
  name: string;
  industry: string;
  sector: string;
  website: string;
  location: string;
  description: string;
  current_status: string;
  submitted_by: string;
  date_added: string;
  created_at: string;
  attachments?: any[];
}

export interface Investor {
  id: number;
  organization_name: string;
  investor_name: string;
  location: string;
  email: string;
  classification: string;
  current_status: string;
  source_of_introduction: string;
  submitted_by: string;
  created_at: string;
}

export interface PipelineDeal {
  id: number;
  company_name: string;
  meeting_date: string;
  source_name: string;
  company_location: string;
  submitted_by: string;
  status: string;
  priority: string;
  next_followup_date?: string | null;
  created_at: string;
}

export interface PeVcContact {
  id: number;
  organization_name: string;
  met_date: string;
  person_met: string;
  stage_of_investment: string;
  location: string;
  email: string;
  fund_size: string;
  focus_sector: string;
  submitted_by: string;
  created_at: string;
}

export interface Intermediary {
  id: number;
  name: string;
  interaction_date: string;
  source_of_introduction: string;
  previous_organization: string;
  current_organization: string;
  designation: string;
  contact_number: string;
  email: string;
  submitted_by: string;
  notes: string;
  created_at: string;
}

export interface TalentResource {
  id: number;
  individual_name: string;
  interaction_date: string;
  source_of_introduction: string;
  previous_organization: string;
  current_organization: string;
  designation: string;
  contact_number: string;
  email: string;
  submitted_by: string;
  notes: string;
  created_at: string;
}

export interface PolicyItem {
  id: number;
  name: string;
  category: string;
  effective_date: string;
  uploaded_by: string;
  version: string;
  archived: boolean;
  created_at: string;
}

export interface ResearchItem {
  id: number;
  title: string;
  category: string;
  author: string;
  description: string;
  status: string;
  tags: string[];
  version: string;
  created_at: string;
}

export interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
  file_size: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
  category: string;
  entity_name: string;
  attachable_type: string;
  attachable_id: number;
}

// Default Seed Data
const DEFAULT_COMPANIES: Company[] = [
  { id: 1, name: "ABC Pharma Ltd", industry: "Healthcare", sector: "Pharmaceuticals", website: "https://abcpharma.com", location: "Mumbai", description: "Leading manufacturer of generic medicines.", current_status: "Active", submitted_by: "Admin User", date_added: "2026-06-01", created_at: "2026-06-01T12:00:00Z" },
  { id: 2, name: "TechVista Solutions", industry: "Technology", sector: "SaaS", website: "https://techvista.io", location: "Bangalore", description: "Enterprise resource planning software provider.", current_status: "Active", submitted_by: "Admin User", date_added: "2026-05-25", created_at: "2026-05-25T10:30:00Z" },
  { id: 3, name: "GreenField Energy", industry: "Energy", sector: "Renewables", website: "https://greenfieldenergy.com", location: "Pune", description: "Solar energy infrastructure and distribution.", current_status: "Under Review", submitted_by: "Rohan Mehta", date_added: "2026-05-20", created_at: "2026-05-20T14:45:00Z" },
  { id: 4, name: "Hyperion AgriTech", industry: "Agriculture", sector: "Smart Farming", website: "https://hyperionagri.com", location: "Hyderabad", description: "AI-driven precision agriculture sensors.", current_status: "Active", submitted_by: "Priya Sharma", date_added: "2026-05-18", created_at: "2026-05-18T09:15:00Z" },
  { id: 5, name: "BlueSky Logistics", industry: "Logistics", sector: "Supply Chain", website: "https://blueskylogistics.com", location: "Chennai", description: "Cold-chain logistics network.", current_status: "On Hold", submitted_by: "Admin User", date_added: "2026-05-15", created_at: "2026-05-15T11:00:00Z" }
];

const DEFAULT_INVESTORS: Investor[] = [
  { id: 1, organization_name: "Rajan Capital Partners", investor_name: "Rajan Mehta", location: "Mumbai", email: "rajan@rajancapital.com", classification: "Family Office", current_status: "Active", source_of_introduction: "Referral", submitted_by: "Admin User", created_at: "2026-06-01T10:00:00Z" },
  { id: 2, organization_name: "Sunrise Angel Network", investor_name: "Priyanka Verma", location: "Bangalore", email: "priyanka@sunrisean.com", classification: "Angel Investor", current_status: "Interested", source_of_introduction: "LinkedIn", submitted_by: "Rohan Mehta", created_at: "2026-05-28T15:20:00Z" },
  { id: 3, organization_name: "GlobalTech Ventures", investor_name: "Arjun Singhania", location: "Delhi", email: "arjun@globaltech.vc", classification: "VC", current_status: "Follow-up Required", source_of_introduction: "Events", submitted_by: "Priya Sharma", created_at: "2026-05-25T11:40:00Z" },
  { id: 4, organization_name: "Apex Wealth Management", investor_name: "Siddharth Goel", location: "Mumbai", email: "siddharth@apexwealth.in", classification: "HNI", current_status: "Active", source_of_introduction: "Referral", submitted_by: "Admin User", created_at: "2026-05-22T14:10:00Z" },
  { id: 5, organization_name: "Infinity PE Fund", investor_name: "Vikram Malhotra", location: "London", email: "v.malhotra@infinitype.co.uk", classification: "PE Fund", current_status: "Under Review", source_of_introduction: "Cold Outreach", submitted_by: "Rohan Mehta", created_at: "2026-05-19T09:30:00Z" }
];

const DEFAULT_PIPELINE: PipelineDeal[] = [
  { id: 1, company_name: "TechVista Solutions", meeting_date: "2026-06-10", source_name: "Referral", company_location: "Bangalore", submitted_by: "Admin User", status: "Due Diligence", priority: "High", next_followup_date: "2026-06-12", created_at: "2026-06-01T14:00:00Z" },
  { id: 2, company_name: "GreenField Energy", meeting_date: "2026-06-05", source_name: "LinkedIn", company_location: "Pune", submitted_by: "Rohan Mehta", status: "Proposal Sent", priority: "High", next_followup_date: "2026-06-07", created_at: "2026-05-20T14:45:00Z" },
  { id: 3, company_name: "Hyperion AgriTech", meeting_date: "2026-06-01", source_name: "Events", company_location: "Hyderabad", submitted_by: "Priya Sharma", status: "New Lead", priority: "Medium", next_followup_date: "2026-06-15", created_at: "2026-05-18T09:15:00Z" },
  { id: 4, company_name: "BlueSky Logistics", meeting_date: "2026-05-28", source_name: "Cold Outreach", company_location: "Chennai", submitted_by: "Admin User", status: "Contacted", priority: "Medium", next_followup_date: "2026-06-04", created_at: "2026-05-15T11:00:00Z" }
];

const DEFAULT_PEVC: PeVcContact[] = [
  { id: 1, organization_name: "Sequoia Capital India", met_date: "2026-05-20", person_met: "Shailendra Singh", stage_of_investment: "Series A", location: "Bangalore", email: "india@sequoiacap.com", fund_size: "$2.5B", focus_sector: "Technology", submitted_by: "Admin User", created_at: "2026-05-20T11:00:00Z" },
  { id: 2, organization_name: "Lightspeed India", met_date: "2026-05-10", person_met: "Bejul Somaia", stage_of_investment: "Seed", location: "Delhi", email: "india@lsvp.com", fund_size: "$500M", focus_sector: "SaaS, Fintech", submitted_by: "Rohan Mehta", created_at: "2026-05-10T14:30:00Z" },
  { id: 3, organization_name: "Accel Partners", met_date: "2026-05-28", person_met: "Prashanth Prakash", stage_of_investment: "Growth", location: "Bangalore", email: "prashanth@accel.com", fund_size: "$1.2B", focus_sector: "Healthcare, Tech", submitted_by: "Priya Sharma", created_at: "2026-05-28T10:00:00Z" }
];

const DEFAULT_INTERMEDIARIES: Intermediary[] = [
  { id: 1, name: "Aditya Roy", interaction_date: "2026-05-29", source_of_introduction: "Referral", previous_organization: "Goldman Sachs", current_organization: "Roy Advisory Services", designation: "Managing Director", contact_number: "+91 98765 43210", email: "aditya@royadvisory.com", notes: "Experienced banker in pharma M&A.", submitted_by: "Admin User", created_at: "2026-05-29T16:00:00Z" },
  { id: 2, name: "Meera Sen", interaction_date: "2026-05-15", source_of_introduction: "LinkedIn", previous_organization: "EY India", current_organization: "Sen Consulting", designation: "Partner", contact_number: "+91 91234 56789", email: "meera@senconsulting.in", notes: "Strong tech contacts.", submitted_by: "Rohan Mehta", created_at: "2026-05-15T11:20:00Z" }
];

const DEFAULT_TALENT: TalentResource[] = [
  { id: 1, individual_name: "Dr. Sandeep Jha", interaction_date: "2026-05-30", source_of_introduction: "Referral", previous_organization: "Biocon", current_organization: "Pharma Insights", designation: "Chief Scientific Officer", contact_number: "+91 99887 76655", email: "sandeep@pharmainsights.com", notes: "Ideal advisor for biotech deals.", submitted_by: "Admin User", created_at: "2026-05-30T10:15:00Z" },
  { id: 2, individual_name: "Nisha Patel", interaction_date: "2026-05-18", source_of_introduction: "LinkedIn", previous_organization: "Flipkart", current_organization: "Tech Advisors", designation: "VP Engineering", contact_number: "+91 88776 65544", email: "nisha@techadvisors.io", notes: "SaaS architecture expert.", submitted_by: "Rohan Mehta", created_at: "2026-05-18T13:40:00Z" }
];

const DEFAULT_POLICIES: PolicyItem[] = [
  { id: 1, name: "Data Privacy & Security Policy", category: "Compliance", effective_date: "2026-01-01T00:00:00Z", uploaded_by: "Compliance Team", version: "1.2", archived: false, created_at: "2026-01-01T09:00:00Z" },
  { id: 2, name: "Employee Code of Conduct", category: "HR", effective_date: "2026-02-15T00:00:00Z", uploaded_by: "HR Department", version: "1.0", archived: false, created_at: "2026-02-15T10:30:00Z" },
  { id: 3, name: "Travel & Expense Reimbursement Policy", category: "Operations", effective_date: "2026-03-01T00:00:00Z", uploaded_by: "Finance Team", version: "2.1", archived: false, created_at: "2026-03-01T14:00:00Z" },
  { id: 4, name: "Information Security Guidelines", category: "IT", effective_date: "2026-04-10T00:00:00Z", uploaded_by: "IT Security", version: "1.1", archived: true, created_at: "2026-04-10T11:00:00Z" }
];

const DEFAULT_RESEARCH: ResearchItem[] = [
  { id: 1, title: "Indian SaaS Industry Report 2026", category: "Market Report", author: "Rohan Mehta", description: "Deep dive into market sizing, key growth drivers and valuation multiples of leading Indian SaaS companies.", status: "Published", tags: ["SaaS", "India", "Valuations"], version: "1.0", created_at: "2026-05-29T10:00:00Z" },
  { id: 2, title: "Healthcare Sector Dynamics - Post Pandemic", category: "Sector Analysis", author: "Admin User", description: "Analysis of the shift towards digital healthcare, diagnostic chains and pharma manufacturing in India.", status: "Under Review", tags: ["Healthcare", "Pharma", "Trends"], version: "0.9", created_at: "2026-06-01T12:00:00Z" },
  { id: 3, title: "CleanTech Investment Landscape", category: "Investment Thesis", author: "Priya Sharma", description: "Investment opportunities in solar, battery storage and EV charging infrastructure.", status: "Draft", tags: ["CleanTech", "Energy", "EV"], version: "0.5", created_at: "2026-05-28T16:20:00Z" }
];

const DEFAULT_ATTACHMENTS: Attachment[] = [
  { id: 1, file_name: "saas_report_2026.pdf", file_path: "/storage/attachments/saas_report_2026.pdf", file_size: "2.4 MB", file_type: "PDF", uploaded_by: "Rohan Mehta", created_at: "2026-05-29T10:05:00Z", category: "research", entity_name: "Indian SaaS Industry Report 2026", attachable_type: "App\\Models\\Research", attachable_id: 1 },
  { id: 2, file_name: "privacy_policy_v1.2.docx", file_path: "/storage/attachments/privacy_policy_v1.2.docx", file_size: "120 KB", file_type: "DOCX", uploaded_by: "Compliance Team", created_at: "2026-01-01T09:05:00Z", category: "policies", entity_name: "Data Privacy & Security Policy", attachable_type: "App\\Models\\Policy", attachable_id: 1 },
  { id: 3, file_name: "abc_pharma_pitchdeck.pdf", file_path: "/storage/attachments/abc_pharma_pitchdeck.pdf", file_size: "4.8 MB", file_type: "PDF", uploaded_by: "Admin User", created_at: "2026-06-01T12:05:00Z", category: "companies", entity_name: "ABC Pharma Ltd", attachable_type: "App\\Models\\Company", attachable_id: 1 },
  { id: 4, file_name: "techvista_dd_checklist.xlsx", file_path: "/storage/attachments/techvista_dd_checklist.xlsx", file_size: "340 KB", file_type: "XLSX", uploaded_by: "Admin User", created_at: "2026-06-01T14:35:00Z", category: "pipeline", entity_name: "TechVista Solutions", attachable_type: "App\\Models\\Pipeline", attachable_id: 1 }
];

// Helper to interact with localStorage
function getTable<T>(name: string, defaultData: T[]): T[] {
  if (typeof window === "undefined") return defaultData;
  const raw = localStorage.getItem(`crm_mock_${name}`);
  if (!raw) {
    localStorage.setItem(`crm_mock_${name}`, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

function saveTable<T>(name: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`crm_mock_${name}`, JSON.stringify(data));
}

// CRUD Operations Interface
export const db = {
  getCompanies: (search?: string, industry?: string) => {
    let list = getTable<Company>("companies", DEFAULT_COMPANIES);
    if (industry && industry !== "all") {
      list = list.filter(c => c.industry.toLowerCase() === industry.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(s) ||
        c.industry.toLowerCase().includes(s) ||
        c.sector.toLowerCase().includes(s) ||
        c.location.toLowerCase().includes(s) ||
        c.description.toLowerCase().includes(s)
      );
    }
    // Attach attachments
    const atts = getTable<Attachment>("attachments", DEFAULT_ATTACHMENTS);
    return list.map(c => ({
      ...c,
      attachments: atts.filter(a => a.category === "companies" && a.attachable_id === c.id)
    }));
  },

  getCompany: (id: number) => {
    const list = getTable<Company>("companies", DEFAULT_COMPANIES);
    const company = list.find(c => c.id === id);
    if (!company) return null;
    const atts = getTable<Attachment>("attachments", DEFAULT_ATTACHMENTS);
    return {
      ...company,
      attachments: atts.filter(a => a.category === "companies" && a.attachable_id === company.id)
    };
  },

  createCompany: (data: Omit<Company, "id" | "date_added" | "created_at" | "submitted_by">) => {
    const list = getTable<Company>("companies", DEFAULT_COMPANIES);
    const newId = list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1;
    const nowStr = new Date().toISOString();
    const newComp: Company = {
      ...data,
      id: newId,
      submitted_by: "Admin User",
      date_added: nowStr.slice(0, 10),
      created_at: nowStr
    };
    list.unshift(newComp); // Prepend to show first
    saveTable("companies", list);
    db.addActivity("company", `${newComp.name} added to Companies Portfolio`);
    return newComp;
  },

  updateCompany: (id: number, data: Partial<Company>) => {
    const list = getTable<Company>("companies", DEFAULT_COMPANIES);
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    saveTable("companies", list);
    return list[idx];
  },

  deleteCompany: (id: number) => {
    const list = getTable<Company>("companies", DEFAULT_COMPANIES);
    const filtered = list.filter(c => c.id !== id);
    saveTable("companies", filtered);
    // Delete attachments as well
    const atts = getTable<Attachment>("attachments", DEFAULT_ATTACHMENTS);
    saveTable("attachments", atts.filter(a => !(a.category === "companies" && a.attachable_id === id)));
    return true;
  },

  // Investors CRUD
  getInvestors: (search?: string, classification?: string, status?: string) => {
    let list = getTable<Investor>("investors", DEFAULT_INVESTORS);
    if (classification && classification !== "all") {
      list = list.filter(i => i.classification.toLowerCase() === classification.toLowerCase());
    }
    if (status && status !== "all") {
      list = list.filter(i => i.current_status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(i =>
        i.investor_name.toLowerCase().includes(s) ||
        i.organization_name.toLowerCase().includes(s) ||
        i.classification.toLowerCase().includes(s) ||
        i.current_status.toLowerCase().includes(s) ||
        i.location.toLowerCase().includes(s)
      );
    }
    return list;
  },

  getInvestor: (id: number) => {
    const list = getTable<Investor>("investors", DEFAULT_INVESTORS);
    return list.find(i => i.id === id) || null;
  },

  createInvestor: (data: Omit<Investor, "id" | "created_at" | "submitted_by">) => {
    const list = getTable<Investor>("investors", DEFAULT_INVESTORS);
    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newInv: Investor = {
      ...data,
      id: newId,
      submitted_by: "Admin User",
      created_at: new Date().toISOString()
    };
    list.unshift(newInv);
    saveTable("investors", list);
    db.addActivity("investor", `New investor added: ${newInv.investor_name} (${newInv.organization_name})`);
    return newInv;
  },

  updateInvestor: (id: number, data: Partial<Investor>) => {
    const list = getTable<Investor>("investors", DEFAULT_INVESTORS);
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    saveTable("investors", list);
    return list[idx];
  },

  deleteInvestor: (id: number) => {
    const list = getTable<Investor>("investors", DEFAULT_INVESTORS);
    saveTable("investors", list.filter(i => i.id !== id));
    return true;
  },

  // Pipeline CRUD
  getPipeline: (search?: string, status?: string, priority?: string) => {
    let list = getTable<PipelineDeal>("pipeline", DEFAULT_PIPELINE);
    if (status && status !== "all") {
      list = list.filter(p => p.status.toLowerCase() === status.toLowerCase());
    }
    if (priority && priority !== "all") {
      list = list.filter(p => p.priority.toLowerCase() === priority.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p =>
        p.company_name.toLowerCase().includes(s) ||
        p.company_location.toLowerCase().includes(s) ||
        p.priority.toLowerCase().includes(s) ||
        p.status.toLowerCase().includes(s)
      );
    }
    return list;
  },

  createPipeline: (data: Omit<PipelineDeal, "id" | "created_at" | "submitted_by">) => {
    const list = getTable<PipelineDeal>("pipeline", DEFAULT_PIPELINE);
    const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
    const newDeal: PipelineDeal = {
      ...data,
      id: newId,
      submitted_by: "Admin User",
      created_at: new Date().toISOString()
    };
    list.unshift(newDeal);
    saveTable("pipeline", list);
    return newDeal;
  },

  updatePipeline: (id: number, data: Partial<PipelineDeal>) => {
    const list = getTable<PipelineDeal>("pipeline", DEFAULT_PIPELINE);
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    saveTable("pipeline", list);
    return list[idx];
  },

  deletePipeline: (id: number) => {
    const list = getTable<PipelineDeal>("pipeline", DEFAULT_PIPELINE);
    saveTable("pipeline", list.filter(p => p.id !== id));
    return true;
  },

  // PE/VC Contacts CRUD
  getPeVc: (search?: string, stage?: string) => {
    let list = getTable<PeVcContact>("pevc", DEFAULT_PEVC);
    if (stage && stage !== "all") {
      list = list.filter(p => p.stage_of_investment.toLowerCase() === stage.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p =>
        p.organization_name.toLowerCase().includes(s) ||
        p.person_met.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s) ||
        p.focus_sector.toLowerCase().includes(s)
      );
    }
    return list;
  },

  createPeVc: (data: Omit<PeVcContact, "id" | "created_at" | "submitted_by">) => {
    const list = getTable<PeVcContact>("pevc", DEFAULT_PEVC);
    const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
    const newContact: PeVcContact = {
      ...data,
      id: newId,
      submitted_by: "Admin User",
      created_at: new Date().toISOString()
    };
    list.unshift(newContact);
    saveTable("pevc", list);
    return newContact;
  },

  updatePeVc: (id: number, data: Partial<PeVcContact>) => {
    const list = getTable<PeVcContact>("pevc", DEFAULT_PEVC);
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    saveTable("pevc", list);
    return list[idx];
  },

  deletePeVc: (id: number) => {
    const list = getTable<PeVcContact>("pevc", DEFAULT_PEVC);
    saveTable("pevc", list.filter(p => p.id !== id));
    return true;
  },

  // Intermediaries CRUD
  getIntermediaries: (search?: string) => {
    let list = getTable<Intermediary>("intermediaries", DEFAULT_INTERMEDIARIES);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(s) ||
        i.designation.toLowerCase().includes(s) ||
        i.email.toLowerCase().includes(s) ||
        i.current_organization.toLowerCase().includes(s)
      );
    }
    return list;
  },

  createIntermediary: (data: Omit<Intermediary, "id" | "created_at" | "submitted_by">) => {
    const list = getTable<Intermediary>("intermediaries", DEFAULT_INTERMEDIARIES);
    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newInt: Intermediary = {
      ...data,
      id: newId,
      submitted_by: "Admin User",
      created_at: new Date().toISOString()
    };
    list.unshift(newInt);
    saveTable("intermediaries", list);
    return newInt;
  },

  updateIntermediary: (id: number, data: Partial<Intermediary>) => {
    const list = getTable<Intermediary>("intermediaries", DEFAULT_INTERMEDIARIES);
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    saveTable("intermediaries", list);
    return list[idx];
  },

  deleteIntermediary: (id: number) => {
    const list = getTable<Intermediary>("intermediaries", DEFAULT_INTERMEDIARIES);
    saveTable("intermediaries", list.filter(i => i.id !== id));
    return true;
  },

  // Talent CRUD
  getTalent: (search?: string) => {
    let list = getTable<TalentResource>("talent", DEFAULT_TALENT);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(t =>
        t.individual_name.toLowerCase().includes(s) ||
        t.designation.toLowerCase().includes(s) ||
        t.email.toLowerCase().includes(s) ||
        t.current_organization.toLowerCase().includes(s)
      );
    }
    return list;
  },

  createTalent: (data: Omit<TalentResource, "id" | "created_at" | "submitted_by">) => {
    const list = getTable<TalentResource>("talent", DEFAULT_TALENT);
    const newId = list.length > 0 ? Math.max(...list.map(t => t.id)) + 1 : 1;
    const newTal: TalentResource = {
      ...data,
      id: newId,
      submitted_by: "Admin User",
      created_at: new Date().toISOString()
    };
    list.unshift(newTal);
    saveTable("talent", list);
    return newTal;
  },

  updateTalent: (id: number, data: Partial<TalentResource>) => {
    const list = getTable<TalentResource>("talent", DEFAULT_TALENT);
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    saveTable("talent", list);
    return list[idx];
  },

  deleteTalent: (id: number) => {
    const list = getTable<TalentResource>("talent", DEFAULT_TALENT);
    saveTable("talent", list.filter(t => t.id !== id));
    return true;
  },

  // Policies CRUD
  getPolicies: (search?: string, category?: string, archived?: boolean) => {
    let list = getTable<PolicyItem>("policies", DEFAULT_POLICIES);
    
    // Filter by archived state
    if (archived !== undefined) {
      list = list.filter(p => p.archived === archived);
    }
    
    if (category && category !== "all") {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.uploaded_by.toLowerCase().includes(s)
      );
    }
    return list;
  },

  createPolicy: (data: Omit<PolicyItem, "id" | "created_at" | "archived">) => {
    const list = getTable<PolicyItem>("policies", DEFAULT_POLICIES);
    const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
    const newPol: PolicyItem = {
      ...data,
      id: newId,
      archived: false,
      created_at: new Date().toISOString()
    };
    list.unshift(newPol);
    saveTable("policies", list);

    // Create a mock attachment for this policy so it shows up in Data Centre
    db.createAttachment({
      file_name: `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_v${data.version}.pdf`,
      file_path: `/storage/attachments/policy_${newId}.pdf`,
      file_size: "245 KB",
      file_type: "PDF",
      uploaded_by: data.uploaded_by || "Compliance Team",
      category: "policies",
      entity_name: data.name,
      attachable_type: "App\\Models\\Policy",
      attachable_id: newId
    });

    return newPol;
  },

  updatePolicy: (id: number, data: Partial<PolicyItem>) => {
    const list = getTable<PolicyItem>("policies", DEFAULT_POLICIES);
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    saveTable("policies", list);
    return list[idx];
  },

  toggleArchivePolicy: (id: number) => {
    const list = getTable<PolicyItem>("policies", DEFAULT_POLICIES);
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    list[idx].archived = !list[idx].archived;
    saveTable("policies", list);
    return list[idx];
  },

  deletePolicy: (id: number) => {
    const list = getTable<PolicyItem>("policies", DEFAULT_POLICIES);
    saveTable("policies", list.filter(p => p.id !== id));
    // Remove attachment
    const atts = getTable<Attachment>("attachments", DEFAULT_ATTACHMENTS);
    saveTable("attachments", atts.filter(a => !(a.category === "policies" && a.attachable_id === id)));
    return true;
  },

  // Research CRUD
  getResearch: (search?: string, category?: string) => {
    let list = getTable<ResearchItem>("research", DEFAULT_RESEARCH);
    if (category && category !== "all") {
      list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(s) ||
        r.category.toLowerCase().includes(s) ||
        r.author.toLowerCase().includes(s) ||
        r.description.toLowerCase().includes(s) ||
        r.tags.some(t => t.toLowerCase().includes(s))
      );
    }
    return list;
  },

  createResearch: (data: Omit<ResearchItem, "id" | "created_at" | "tags"> & { tags?: string[] }) => {
    const list = getTable<ResearchItem>("research", DEFAULT_RESEARCH);
    const newId = list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1;
    const newRes: ResearchItem = {
      ...data,
      tags: data.tags || [],
      id: newId,
      created_at: new Date().toISOString()
    };
    list.unshift(newRes);
    saveTable("research", list);

    // Create a mock attachment for this research document so it shows up in Data Centre
    db.createAttachment({
      file_name: `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_v${data.version}.pdf`,
      file_path: `/storage/attachments/research_${newId}.pdf`,
      file_size: "1.8 MB",
      file_type: "PDF",
      uploaded_by: data.author || "Research Analyst",
      category: "research",
      entity_name: data.title,
      attachable_type: "App\\Models\\Research",
      attachable_id: newId
    });

    return newRes;
  },

  updateResearch: (id: number, data: Partial<ResearchItem>) => {
    const list = getTable<ResearchItem>("research", DEFAULT_RESEARCH);
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    saveTable("research", list);
    return list[idx];
  },

  deleteResearch: (id: number) => {
    const list = getTable<ResearchItem>("research", DEFAULT_RESEARCH);
    saveTable("research", list.filter(r => r.id !== id));
    // Remove attachment
    const atts = getTable<Attachment>("attachments", DEFAULT_ATTACHMENTS);
    saveTable("attachments", atts.filter(a => !(a.category === "research" && a.attachable_id === id)));
    return true;
  },

  // Attachments CRUD (for Data Centre & Entity Associations)
  getAttachments: (search?: string, categoryKey?: string) => {
    let list = getTable<Attachment>("attachments", DEFAULT_ATTACHMENTS);
    if (categoryKey && categoryKey !== "all") {
      list = list.filter(a => a.category === categoryKey);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(a =>
        a.file_name.toLowerCase().includes(s) ||
        a.entity_name.toLowerCase().includes(s) ||
        a.uploaded_by.toLowerCase().includes(s)
      );
    }
    return list;
  },

  createAttachment: (data: Omit<Attachment, "id" | "created_at">) => {
    const list = getTable<Attachment>("attachments", DEFAULT_ATTACHMENTS);
    const newId = list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1;
    const newAtt: Attachment = {
      ...data,
      id: newId,
      created_at: new Date().toISOString()
    };
    list.unshift(newAtt);
    saveTable("attachments", list);
    return newAtt;
  },

  deleteAttachment: (id: number) => {
    const list = getTable<Attachment>("attachments", DEFAULT_ATTACHMENTS);
    saveTable("attachments", list.filter(a => a.id !== id));
    return true;
  },

  // Dashboard Stats & Charts
  getDashboardStats: () => {
    const companies = getTable<Company>("companies", DEFAULT_COMPANIES);
    const pipeline = getTable<PipelineDeal>("pipeline", DEFAULT_PIPELINE);
    const investors = getTable<Investor>("investors", DEFAULT_INVESTORS);
    const pevc = getTable<PeVcContact>("pevc", DEFAULT_PEVC);
    const talent = getTable<TalentResource>("talent", DEFAULT_TALENT);
    const intermediaries = getTable<Intermediary>("intermediaries", DEFAULT_INTERMEDIARIES);

    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    const meetingsThisMonth = pipeline.filter(p => {
      const mDate = new Date(p.meeting_date);
      return mDate.getMonth() === curMonth && mDate.getFullYear() === curYear;
    }).length;

    // Filter pending followups (within 7 days and active)
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const pendingFollowups = pipeline.filter(p => {
      if (!p.next_followup_date) return false;
      const fDate = new Date(p.next_followup_date);
      const isWithin7Days = fDate >= now && fDate <= sevenDaysLater;
      const isNotClosed = p.status !== "Closed Won" && p.status !== "Closed Lost";
      return isWithin7Days && isNotClosed;
    }).length;

    return {
      total_companies: companies.length,
      active_pipeline: pipeline.filter(p => p.status !== "Closed Won" && p.status !== "Closed Lost").length,
      investors: investors.length,
      pe_vc_contacts: pevc.length,
      talent_resources: talent.length,
      intermediaries: intermediaries.length,
      meetings_this_month: meetingsThisMonth,
      pending_followups: pendingFollowups
    };
  },

  getDashboardCharts: () => {
    const pipeline = getTable<PipelineDeal>("pipeline", DEFAULT_PIPELINE);
    const investors = getTable<Investor>("investors", DEFAULT_INVESTORS);

    // Pipeline status distribution
    const statusMap: Record<string, number> = {};
    pipeline.forEach(p => {
      statusMap[p.status] = (statusMap[p.status] || 0) + 1;
    });
    const pipeline_by_status = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

    // Investor classification distribution
    const classMap: Record<string, number> = {};
    investors.forEach(i => {
      classMap[i.classification] = (classMap[i.classification] || 0) + 1;
    });
    const investor_by_class = Object.entries(classMap).map(([classification, count]) => ({ classification, count }));

    // Monthly meetings trend (last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const meetingsByMonth: Record<string, number> = {};

    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = monthNames[d.getMonth()];
      meetingsByMonth[label] = 0;
    }

    pipeline.forEach(p => {
      const mDate = new Date(p.meeting_date);
      const label = monthNames[mDate.getMonth()];
      if (meetingsByMonth[label] !== undefined) {
        meetingsByMonth[label]++;
      }
    });
    const monthly_meetings = Object.entries(meetingsByMonth).map(([month, meetings]) => ({ month, meetings }));

    // Source-wise leads
    const sourceMap: Record<string, number> = {};
    pipeline.forEach(p => {
      if (p.source_name) {
        sourceMap[p.source_name] = (sourceMap[p.source_name] || 0) + 1;
      }
    });
    const source_leads = Object.entries(sourceMap).map(([source, leads]) => ({ source, leads }));

    return {
      pipeline_by_status,
      investor_by_class,
      monthly_meetings,
      source_leads
    };
  },

  // Activities (Dynamic audit trail simulator)
  getActivities: () => {
    const defaultActivities = [
      { type: "investor", text: "New investor added: Rajan Capital (HNI)", time: "5 min ago" },
      { type: "company", text: "ABC Pharma Ltd added to Companies Portfolio", time: "23 min ago" },
      { type: "meeting", text: "Meeting updated: XYZ VC – Due Diligence", time: "1 hr ago" },
      { type: "file", text: "12 files uploaded to Data Centre", time: "2 hrs ago" },
    ];
    return getTable<any>("activities", defaultActivities);
  },

  addActivity: (type: string, text: string) => {
    const list = getTable<any>("activities", [
      { type: "investor", text: "New investor added: Rajan Capital (HNI)", time: "5 min ago" },
      { type: "company", text: "ABC Pharma Ltd added to Companies Portfolio", time: "23 min ago" },
      { type: "meeting", text: "Meeting updated: XYZ VC – Due Diligence", time: "1 hr ago" },
      { type: "file", text: "12 files uploaded to Data Centre", time: "2 hrs ago" },
    ]);
    list.unshift({ type, text, time: "Just now" });
    saveTable("activities", list.slice(0, 15)); // Keep last 15
  }
};
