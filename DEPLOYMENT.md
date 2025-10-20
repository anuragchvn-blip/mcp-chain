# 🚀 Deployment Guide

Complete guide to deploying ChainMind to production.

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mcp-chain)

### Step-by-Step

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/mcp-chain.git
git push -u origin main
```

2. **Import to Vercel**

- Go to [vercel.com/new](https://vercel.com/new)
- Click "Import Project"
- Select your GitHub repository
- Vercel auto-detects Next.js

3. **Environment Variables**

Add these in Vercel dashboard (Settings → Environment Variables):

```env
ETH_RPC_URL=https://eth.llamarpc.com
SOL_RPC_URL=https://api.mainnet-beta.solana.com

# Optional: Supabase for transaction logging
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_service_key

# Optional: WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

4. **Deploy**

- Click "Deploy"
- Wait ~2 minutes
- Your dashboard will be live at `your-app.vercel.app`

## MCP Server Deployment

The MCP server can be deployed separately for use with Claude Desktop.

### Option 1: Run Locally

```bash
# Build the server
npm run build:server

# Run it
node dist/index.js
```

Add to Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "chainmind": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-chain/dist/index.js"],
      "env": {
        "ETH_RPC_URL": "https://eth.llamarpc.com",
        "SOL_RPC_URL": "https://api.mainnet-beta.solana.com"
      }
    }
  }
}
```

### Option 2: Docker Container

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source
COPY . .

# Build MCP server
RUN npm run build:server

# Set environment
ENV NODE_ENV=production

# Run MCP server
CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t chainmind-mcp .
docker run -d \\
  -e ETH_RPC_URL=https://eth.llamarpc.com \\
  -e SOL_RPC_URL=https://api.mainnet-beta.solana.com \\
  --name chainmind \\
  chainmind-mcp
```

### Option 3: PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'chainmind-mcp',
    script: 'dist/index.js',
    env: {
      ETH_RPC_URL: 'https://eth.llamarpc.com',
      SOL_RPC_URL: 'https://api.mainnet-beta.solana.com',
      NODE_ENV: 'production'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Enable startup on boot
pm2 startup
pm2 save
```

## Production Checklist

### Security

- [ ] **Use Authenticated RPC Endpoints**
  - Don't use public RPCs in production
  - Get API keys from Infura, Alchemy, or QuickNode
  - Example: `https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

- [ ] **Environment Variables**
  - Never commit `.env.local` to git
  - Use Vercel/platform secret management
  - Rotate keys regularly

- [ ] **API Rate Limiting**
  - Add rate limiting middleware
  - Prevent abuse of MCP bridge API

- [ ] **CORS Configuration**
  - Set proper CORS headers
  - Whitelist allowed origins

### Performance

- [ ] **RPC Optimization**
  - Use WebSocket connections for better performance
  - Implement request caching where appropriate
  - Monitor RPC usage and costs

- [ ] **Database Setup** (Optional)
  - Set up Supabase for transaction logging
  - Create proper indexes
  - Set up row-level security

- [ ] **CDN & Caching**
  - Vercel automatically provides CDN
  - Configure cache headers properly
  - Use ISR for static content

### Monitoring

- [ ] **Error Tracking**
  ```bash
  npm install @sentry/nextjs
  ```
  - Set up Sentry or similar
  - Monitor MCP bridge errors
  - Track blockchain call failures

- [ ] **Analytics**
  - Add Vercel Analytics
  - Track user journeys
  - Monitor conversion funnel

- [ ] **Logging**
  - Implement structured logging
  - Use Winston or Pino
  - Send logs to aggregation service

### Testing

- [ ] **Test on Testnet First**
  - Use Sepolia for Ethereum
  - Use Devnet for Solana
  - Verify all functions work

- [ ] **Load Testing**
  - Test MCP bridge under load
  - Verify server spawning works at scale
  - Check for memory leaks

- [ ] **E2E Testing**
  - Test wallet connection flow
  - Verify transaction sending
  - Check error handling

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL cert provisioning (~5 mins)

### Cloudflare (Optional)

For additional security and performance:

1. Point domain to Vercel
2. Enable Cloudflare proxy
3. Set SSL/TLS to "Full"
4. Enable DDoS protection

## Environment-Specific Configs

### Development

```env
ETH_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
SOL_RPC_URL=https://api.devnet.solana.com
NODE_ENV=development
```

### Staging

```env
ETH_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
SOL_RPC_URL=https://api.testnet.solana.com
NODE_ENV=staging
```

### Production

```env
ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
SOL_RPC_URL=https://api.mainnet-beta.solana.com
NODE_ENV=production
```

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build MCP server
        run: npm run build:server
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Rollback Strategy

### Vercel

Vercel keeps all deployments:

1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Docker

```bash
# Tag images with version
docker build -t chainmind-mcp:v1.0.0 .
docker tag chainmind-mcp:v1.0.0 chainmind-mcp:latest

# Rollback
docker stop chainmind
docker run -d --name chainmind chainmind-mcp:v1.0.0
```

## Cost Estimation

### Vercel (Free Tier)

- 100GB bandwidth/month: **FREE**
- Serverless function executions: **FREE** (100,000/month)
- Build minutes: **FREE** (6,000/month)

### RPC Providers (Estimated)

**Alchemy (Free Tier)**
- 300M compute units/month: **FREE**
- ~150,000 getBalance calls

**QuickNode (Starter)**
- $49/month
- Unlimited requests
- Better reliability

### Total Monthly Cost

- **Development:** $0 (free tiers)
- **Production (Light):** $0-50
- **Production (Heavy):** $50-200

## Support & Monitoring

### Health Checks

Add health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      mcp: 'operational',
      eth: 'operational',
      sol: 'operational'
    }
  });
}
```

Monitor at: `https://your-app.vercel.app/api/health`

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- Better Uptime
- Vercel Analytics (built-in)

## Troubleshooting

### Common Issues

**MCP Bridge Timeout**
- Increase serverless function timeout in `vercel.json`
- Use faster RPC endpoints

**Memory Issues**
- Limit concurrent MCP server spawns
- Add connection pooling

**CORS Errors**
- Check Next.js middleware
- Verify allowed origins

## Next Steps After Deployment

1. **Test Everything**
   - Try all 5 MCP tools
   - Test with Claude Desktop
   - Verify transactions on testnet

2. **Monitor Usage**
   - Check RPC usage dashboard
   - Monitor error rates
   - Track user metrics

3. **Gradual Rollout**
   - Start with small user base
   - Monitor for issues
   - Scale up gradually

4. **Documentation**
   - Update README with production URL
   - Document any custom configurations
   - Create runbook for common issues

---

**You're now ready to deploy ChainMind to production!** 🚀

For help, see:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [ChainMind Issues](https://github.com/yourusername/mcp-chain/issues)
