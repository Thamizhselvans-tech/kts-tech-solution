import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { handleProjectEnquiry } from './api/project-enquiry'
import { handleGeneralEnquiry } from './api/general-enquiry'
import { handleInternshipApplication } from './api/internship'
import { handleAdminLeads } from './api/admin/leads'
import { handleAdminLogin } from './api/admin/login'
import { handleAdminInternships } from './api/admin/internships'
import { handleAdminEnquiries } from './api/admin/enquiries'

const apiDevPlugin = (): Plugin => ({
  name: 'api-dev-middleware',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) {
        return next();
      }

      let bodyStr = '';
      req.on('data', (chunk) => { bodyStr += chunk; });
      req.on('end', async () => {
        try {
          const bodyData = bodyStr ? JSON.parse(bodyStr) : {};
          let result: { status: number; body: any; headers?: Record<string, string> } = { status: 404, body: { success: false, message: 'Not found' } };

          const url = req.url || '';
          const pathname = url.split('?')[0];

          if (pathname === '/api/project-enquiry') {
            result = await handleProjectEnquiry(bodyData);
          } else if (pathname === '/api/general-enquiry') {
            result = await handleGeneralEnquiry(bodyData);
          } else if (pathname === '/api/internship' || pathname === '/api/internship-application') {
            result = await handleInternshipApplication(bodyData);
          } else if (pathname === '/api/admin/login') {
            result = await handleAdminLogin({ method: req.method, headers: req.headers, body: bodyData });
          } else if (pathname.startsWith('/api/admin/leads')) {
            result = await handleAdminLeads({ method: req.method, headers: req.headers, body: bodyData });
          } else if (pathname.startsWith('/api/admin/internships')) {
            result = await handleAdminInternships({ method: req.method, headers: req.headers, body: bodyData });
          } else if (pathname.startsWith('/api/admin/enquiries')) {
            result = await handleAdminEnquiries({ method: req.method, headers: req.headers, body: bodyData });
          }

          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          if (result.headers) {
            Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));
          }
          res.end(JSON.stringify(result.body));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: err.message || 'Internal server error' }));
        }
      });
    });
  }
});

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false
  }
})
