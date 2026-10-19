import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { GoogleGenAI } from '@google/genai';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'gemini-api-middleware',
      configureServer(server) {
        server.middlewares.use('/api/gemini/analyze', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { query, context } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.statusCode = 503;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY environment variable not configured' }));
                return;
              }

              const ai = new GoogleGenAI({ apiKey });
              const prompt = `You are a Principal Enterprise Cybersecurity & SOC 2 Compliance Auditor AI.
Analyze this user query regarding SaaS leaver access, credentials, and compliance risk.

Query: "${query}"

Audit State Context:
- HR Leavers Tracked: ${context?.leavers?.length || 6}
- Active Violations: ${context?.findings?.filter((f: any) => f.status === 'UNAUTHORIZED_ACTIVE')?.length || 11}
- Leavers: ${JSON.stringify(context?.leavers?.map((l: any) => ({ name: l.fullName, exitDate: l.exitDate, email: l.workEmail })) || [])}
- Violations Summary: ${JSON.stringify(context?.findings?.filter((f: any) => f.status === 'UNAUTHORIZED_ACTIVE')?.map((f: any) => ({ name: f.hrEmployee.fullName, platform: f.platform, lastLogin: f.lastLoginTimestamp, postExitLogin: f.hasPostDepartureLogin })) || [])}

Instructions:
1. Provide an executive summary of the threat and regulatory compliance violation.
2. Determine blast radius score: "CRITICAL", "HIGH", "MEDIUM", or "LOW".
3. Provide key evidence items with label and value.
4. List applicable regulatory standards (e.g. SOC 2 Type II CC6.2, ISO/IEC 27001:2022 A.9.2.6, HIPAA).
5. List concrete remediation actions.
6. Provide a concise 4-step thought process of your reasoning.

Respond with valid JSON adhering to this structure:
{
  "summary": "string",
  "blastRadiusScore": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "evidence": [{"label": "string", "value": "string"}],
  "regulatoryImpact": ["string"],
  "recommendedActions": ["string"],
  "thoughtProcess": ["string"]
}`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.5-flash-lite',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json'
                }
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(response.text || '{}');
            } catch (err: any) {
              console.error('[Gemini API Middleware Error]', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
});
