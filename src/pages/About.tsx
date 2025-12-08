export default function About() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white">About Xandeum Analytics</h1>
        <p className="mt-2 text-muted">
          Real-time analytics platform for Xandeum pNodes
        </p>
      </div>

      <div className="card card-hover p-6">
        <h2 className="text-xl font-bold text-white mb-4">What is Xandeum?</h2>
        <p className="text-foreground leading-relaxed mb-4">
          Xandeum is building a scalable storage layer for Solana dApps. Think of it as a second tier 
          of Solana accounts that can grow to exabytes and beyond. This lives on its own network of 
          storage provider nodes, which we call pNodes.
        </p>

        <h2 className="text-xl font-bold text-white mb-4 mt-8">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card-hover">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
            <div>
              <p className="text-sm font-medium text-white">Real-time Monitoring</p>
              <p className="text-xs text-muted">Track all Xandeum pNodes in real-time</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card-hover">
            <div className="w-2 h-2 rounded-full bg-success mt-1.5"></div>
            <div>
              <p className="text-sm font-medium text-white">Network Health Metrics</p>
              <p className="text-xs text-muted">Performance and health analytics</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card-hover">
            <div className="w-2 h-2 rounded-full bg-chart-2 mt-1.5"></div>
            <div>
              <p className="text-sm font-medium text-white">Advanced Search</p>
              <p className="text-xs text-muted">Filter and search capabilities</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card-hover">
            <div className="w-2 h-2 rounded-full bg-warning mt-1.5"></div>
            <div>
              <p className="text-sm font-medium text-white">Live Updates</p>
              <p className="text-xs text-muted">Status updates every 30 seconds</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-4 mt-8">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <p className="text-white font-semibold mb-1">React 18</p>
            <p className="text-xs text-muted">Frontend Library</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-white font-semibold mb-1">TypeScript</p>
            <p className="text-xs text-muted">Type Safety</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-white font-semibold mb-1">Tailwind CSS</p>
            <p className="text-xs text-muted">Styling Framework</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-white font-semibold mb-1">React Query</p>
            <p className="text-xs text-muted">Data Fetching</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-sm text-foreground">
            <strong className="text-primary">Note:</strong> This platform retrieves pNode information 
            using Xandeum pRPC calls and displays real-time network statistics.
          </p>
        </div>
      </div>

      <div className="card card-hover p-6">
        <h2 className="text-xl font-bold text-white mb-4">Links & Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="https://xandeum.network"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-lg bg-card-hover hover:bg-background border border-border hover:border-primary transition-all group"
          >
            <div>
              <p className="font-medium text-white">Xandeum Network</p>
              <p className="text-xs text-muted">Official website</p>
            </div>
            <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a
            href="https://discord.gg/uqRSmmM5m"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-lg bg-card-hover hover:bg-background border border-border hover:border-primary transition-all group"
          >
            <div>
              <p className="font-medium text-white">Discord Community</p>
              <p className="text-xs text-muted">Join our community</p>
            </div>
            <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
