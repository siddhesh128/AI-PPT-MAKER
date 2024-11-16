'use client'
import { useState, useEffect } from 'react';
import localFont from "next/font/local";
import Link from 'next/link';
import { Layout, Presentation, Home, Settings, HelpCircle, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex">
          {/* Backdrop for mobile */}
          {!isCollapsed && (
            <div 
              className="md:hidden fixed inset-0 bg-black/20 z-10"
              onClick={() => setIsCollapsed(true)}
            />
          )}
          
          {/* Vertical Navigation */}
          <div 
            className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 
              transition-all duration-300 ease-in-out shadow-sm hover:shadow-md z-20
              ${isCollapsed ? 'w-20' : 'w-64'} 
              ${isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
              {!isCollapsed && (
                <div className="flex items-center gap-3">
                  <Presentation className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <span className="text-xl font-bold text-gray-800 whitespace-nowrap">
                    SlideMaster AI
                  </span>
                </div>
              )}
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-auto hidden md:block"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-auto md:hidden"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <nav className="p-3 space-y-2">
              {[
                { href: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
                { href: '/create', icon: <Presentation className="w-5 h-5" />, label: 'Create' },
                { href: '/templates', icon: <Layout className="w-5 h-5" />, label: 'Templates' },
                { type: 'divider' },
                { href: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
                { href: '/help', icon: <HelpCircle className="w-5 h-5" />, label: 'Help' },
              ].map((item, index) => {
                if (item.type === 'divider') {
                  return <div key="divider" className="border-t border-gray-200 my-4" />;
                }
                return (
                  <Link key={item.href} href={item.href}>
                    <div className="group relative flex items-center gap-3 px-3 py-3 
                      text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg
                      transition-all duration-200">
                      <div className="flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className={`whitespace-nowrap transition-all duration-300
                        ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                        {item.label}
                      </span>
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white 
                          text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity
                          pointer-events-none whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className={`flex-1 transition-all duration-300 ease-in-out 
            ${isCollapsed ? 'md:pl-20' : 'pl-0 md:pl-64'} min-h-screen bg-gray-50`}>
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 md:hidden">
              <div className="flex items-center h-16 px-4">
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <span className="ml-3 text-lg font-semibold text-gray-800">SlideMaster AI</span>
              </div>
            </div>
            <main className="p-4">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
