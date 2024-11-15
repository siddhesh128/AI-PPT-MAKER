import { Presentation, Home } from 'lucide-react';
import Link from 'next/link';

const Navigation = () => (
  <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
    <div className="flex items-center space-x-2 mb-8">
      <Presentation className="w-8 h-8 text-blue-600" />
      <span className="text-xl font-bold text-gray-800">SlideMaster AI</span>
    </div>
    <nav className="space-y-2">
      <Link href="/">
        <div className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </div>
      </Link>
      <Link href="/create">
        <div className="flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg">
          <Presentation className="w-5 h-5" />
          <span>Create</span>
        </div>
      </Link>
    </nav>
  </div>
);

export default Navigation;