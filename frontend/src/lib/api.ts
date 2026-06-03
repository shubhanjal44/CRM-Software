import axios from "axios";
import { db } from "./mockData";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Custom Axios Adapter to handle all CRM requests client-side
const mockAdapter = async (config: any) => {
  return new Promise((resolve, reject) => {
    // Simulate network latency (200ms)
    setTimeout(() => {
      try {
        let url = config.url || "";
        if (config.baseURL && url.startsWith(config.baseURL)) {
          url = url.slice(config.baseURL.length);
        }
        if (url.startsWith("http://") || url.startsWith("https://")) {
          const parsed = new URL(url);
          url = parsed.pathname;
          if (url.startsWith("/api")) {
            url = url.slice(4);
          }
        }

        const [path, queryString] = url.split("?");
        const searchParams = new URLSearchParams(queryString || "");
        const params = {
          ...Object.fromEntries(searchParams.entries()),
          ...(config.params || {})
        };

        let body: any = {};
        if (config.data) {
          try {
            body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
          } catch {
            body = config.data;
          }
        }

        const method = (config.method || "get").toLowerCase();
        let responseData: any = null;
        let responseStatus = 200;

        // Routing logic
        // 1. Dashboard
        if (path === "/dashboard/stats" && method === "get") {
          responseData = db.getDashboardStats();
        } else if (path === "/dashboard/charts" && method === "get") {
          responseData = db.getDashboardCharts();
        } else if (path === "/dashboard/activities" && method === "get") {
          responseData = db.getActivities();
        }

        // 2. Auth / User Profile
        else if (path === "/auth/change-password" && method === "put") {
          responseData = { message: "Password updated successfully" };
        } else if (path === "/auth/profile" && method === "put") {
          const userRaw = localStorage.getItem("crm_user");
          let user = userRaw ? JSON.parse(userRaw) : null;
          if (user) {
            user = { ...user, name: body.name, email: body.email, role: body.role || user.role };
            localStorage.setItem("crm_user", JSON.stringify(user));
          }
          responseData = { user };
        } else if (path === "/auth/logout" && method === "post") {
          responseData = { message: "Logged out successfully" };
        }

        // 3. Companies
        else if (path === "/companies" && method === "get") {
          responseData = { data: db.getCompanies(params.search, params.industry) };
        } else if (path.match(/^\/companies\/\d+$/) && method === "get") {
          const id = Number(path.split("/").pop());
          const comp = db.getCompany(id);
          if (comp) {
            responseData = { data: comp };
          } else {
            responseStatus = 404;
            responseData = { message: "Company not found" };
          }
        } else if (path === "/companies" && method === "post") {
          responseData = db.createCompany(body);
          responseStatus = 201;
        } else if (path.match(/^\/companies\/\d+$/) && method === "put") {
          const id = Number(path.split("/").pop());
          responseData = db.updateCompany(id, body);
        } else if (path.match(/^\/companies\/\d+$/) && method === "delete") {
          const id = Number(path.split("/").pop());
          db.deleteCompany(id);
          responseData = { message: "Company removed" };
        }

        // 4. Investors
        else if (path === "/investors" && method === "get") {
          responseData = { data: db.getInvestors(params.search, params.classification, params.status) };
        } else if (path.match(/^\/investors\/\d+$/) && method === "get") {
          const id = Number(path.split("/").pop());
          const inv = db.getInvestor(id);
          if (inv) {
            responseData = { data: inv };
          } else {
            responseStatus = 404;
            responseData = { message: "Investor not found" };
          }
        } else if (path === "/investors" && method === "post") {
          responseData = db.createInvestor(body);
          responseStatus = 201;
        } else if (path.match(/^\/investors\/\d+$/) && method === "put") {
          const id = Number(path.split("/").pop());
          responseData = db.updateInvestor(id, body);
        } else if (path.match(/^\/investors\/\d+$/) && method === "delete") {
          const id = Number(path.split("/").pop());
          db.deleteInvestor(id);
          responseData = { message: "Investor removed" };
        }

        // 5. Pipeline
        else if (path === "/pipeline" && method === "get") {
          responseData = { data: db.getPipeline(params.search, params.status, params.priority) };
        } else if (path === "/pipeline" && method === "post") {
          responseData = db.createPipeline(body);
          responseStatus = 201;
        } else if (path.match(/^\/pipeline\/\d+$/) && method === "put") {
          const id = Number(path.split("/").pop());
          responseData = db.updatePipeline(id, body);
        } else if (path.match(/^\/pipeline\/\d+$/) && method === "delete") {
          const id = Number(path.split("/").pop());
          db.deletePipeline(id);
          responseData = { message: "Deal removed" };
        }

        // 6. PE/VC Contacts
        else if (path === "/pe-vc" && method === "get") {
          responseData = { data: db.getPeVc(params.search, params.stage) };
        } else if (path === "/pe-vc" && method === "post") {
          responseData = db.createPeVc(body);
          responseStatus = 201;
        } else if (path.match(/^\/pe-vc\/\d+$/) && method === "put") {
          const id = Number(path.split("/").pop());
          responseData = db.updatePeVc(id, body);
        } else if (path.match(/^\/pe-vc\/\d+$/) && method === "delete") {
          const id = Number(path.split("/").pop());
          db.deletePeVc(id);
          responseData = { message: "PE/VC Contact removed" };
        }

        // 7. Intermediaries
        else if (path === "/intermediaries" && method === "get") {
          responseData = { data: db.getIntermediaries(params.search) };
        } else if (path === "/intermediaries" && method === "post") {
          responseData = db.createIntermediary(body);
          responseStatus = 201;
        } else if (path.match(/^\/intermediaries\/\d+$/) && method === "put") {
          const id = Number(path.split("/").pop());
          responseData = db.updateIntermediary(id, body);
        } else if (path.match(/^\/intermediaries\/\d+$/) && method === "delete") {
          const id = Number(path.split("/").pop());
          db.deleteIntermediary(id);
          responseData = { message: "Intermediary removed" };
        }

        // 8. Talent
        else if (path === "/talent" && method === "get") {
          responseData = { data: db.getTalent(params.search) };
        } else if (path === "/talent" && method === "post") {
          responseData = db.createTalent(body);
          responseStatus = 201;
        } else if (path.match(/^\/talent\/\d+$/) && method === "put") {
          const id = Number(path.split("/").pop());
          responseData = db.updateTalent(id, body);
        } else if (path.match(/^\/talent\/\d+$/) && method === "delete") {
          const id = Number(path.split("/").pop());
          db.deleteTalent(id);
          responseData = { message: "Talent removed" };
        }

        // 9. Policies
        else if (path === "/policies" && method === "get") {
          responseData = { data: db.getPolicies(params.search, params.category, params.archived === "true") };
        } else if (path === "/policies" && method === "post") {
          responseData = db.createPolicy(body);
          responseStatus = 201;
        } else if (path.match(/^\/policies\/\d+$/) && method === "put") {
          const id = Number(path.split("/").pop());
          responseData = db.updatePolicy(id, body);
        } else if (path.match(/^\/policies\/\d+\/archive$/) && method === "put") {
          const id = Number(path.split("/")[2]);
          responseData = db.toggleArchivePolicy(id);
        } else if (path.match(/^\/policies\/\d+$/) && method === "delete") {
          const id = Number(path.split("/").pop());
          db.deletePolicy(id);
          responseData = { message: "Policy removed" };
        }

        // 10. Research
        else if (path === "/research" && method === "get") {
          responseData = { data: db.getResearch(params.search, params.category) };
        } else if (path === "/research" && method === "post") {
          responseData = db.createResearch(body);
          responseStatus = 201;
        } else if (path.match(/^\/research\/\d+$/) && method === "put") {
          const id = Number(path.split("/").pop());
          responseData = db.updateResearch(id, body);
        } else if (path.match(/^\/research\/\d+$/) && method === "delete") {
          const id = Number(path.split("/").pop());
          db.deleteResearch(id);
          responseData = { message: "Research document removed" };
        }

        // 11. Data Centre
        else if (path === "/data-centre" && method === "get") {
          const atts = db.getAttachments(params.search, params.type);
          responseData = {
            data: atts,
            total: atts.length,
            current_page: 1,
            last_page: 1
          };
        } else if (path === "/data-centre/bulk-download" && method === "post") {
          const ids = body.ids || [];
          const allAtts = db.getAttachments();
          const matches = allAtts.filter(a => ids.includes(a.id));
          responseData = {
            files: matches.map(m => ({
              id: m.id,
              file_name: m.file_name,
              download_url: m.file_path
            }))
          };
        }

        // Fallback for unhandled paths
        else {
          console.warn(`Mock API: Unhandled path [${method.toUpperCase()}] ${path}`);
          responseStatus = 404;
          responseData = { message: `Route not found: ${path}` };
        }

        const axiosResponse = {
          data: responseData,
          status: responseStatus,
          statusText: responseStatus >= 400 ? "Bad Request" : "OK",
          headers: {},
          config
        };

        if (responseStatus >= 400) {
          reject({
            response: axiosResponse,
            message: responseData.message || "Request failed"
          });
        } else {
          resolve(axiosResponse);
        }

      } catch (err: any) {
        reject({
          message: err.message || "Internal Mock Server Error",
          config
        });
      }
    }, 200);
  });
};

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  adapter: mockAdapter
});

// Inject Bearer token on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("crm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 → redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("crm_token");
        localStorage.removeItem("crm_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
