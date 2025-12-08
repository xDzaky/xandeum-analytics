export default function About() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">About Xandeum Analytics</h1>
        <p className="mt-2 text-gray-400">
          Real-time analytics platform for Xandeum pNodes
        </p>
      </div>

      <div className="bg-card rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">What is Xandeum?</h2>
        <p className="text-gray-300 mb-4">
          Xandeum is building a scalable storage layer for Solana dApps. Think of it as a second tier 
          of Solana accounts that can grow to exabytes and beyond. This lives on its own network of 
          storage provider nodes, which we call pNodes.
        </p>

        <h2 className="text-xl font-bold text-white mb-4 mt-6">Platform Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Real-time monitoring of all Xandeum pNodes</li>
          <li>Network health and performance metrics</li>
          <li>Advanced search and filtering capabilities</li>
          <li>Live status updates every 30 seconds</li>
          <li>Mobile-responsive design</li>
        </ul>

        <h2 className="text-xl font-bold text-white mb-4 mt-6">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-white font-medium">React 18</p>
            <p className="text-xs text-gray-400">Frontend</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-white font-medium">TypeScript</p>
            <p className="text-xs text-gray-400">Type Safety</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-white font-medium">Tailwind CSS</p>
            <p className="text-xs text-gray-400">Styling</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-white font-medium">React Query</p>
            <p className="text-xs text-gray-400">Data Fetching</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong className="text-white">Note:</strong> This platform retrieves pNode information 
            using Xandeum pRPC calls and displays real-time network statistics.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Links</h2>
        <div className="space-y-2">
          <a
            href="https://xandeum.network"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:text-primary/80"
          >
            Xandeum Network →
          </a>
          <a
            href="https://discord.gg/uqRSmmM5m"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:text-primary/80"
          >
            Discord Community →
          </a>
        </div>
      </div>
    </div>
  );
}
