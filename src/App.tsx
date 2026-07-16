import React, { useState } from 'react';
import { Server, Image, Menu, X, Heart, Sparkles, Cpu, Terminal } from 'lucide-react';
import Playground from './components/Playground.tsx';
import EmbedSnippets from './components/EmbedSnippets.tsx';
import SciencePlayground from './components/SciencePlayground.tsx';
import ScienceEmbedSnippets from './components/ScienceEmbedSnippets.tsx';

type Tab = 'minecraft' | 'science';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('minecraft');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentMinecraftUrl, setCurrentMinecraftUrl] = useState('');
  const [currentScienceUrl, setCurrentScienceUrl] = useState('');

  const handleMinecraftUrlChange = (url: string) => {
    setCurrentMinecraftUrl(url);
  };

  const handleScienceUrlChange = (url: string) => {
    setCurrentScienceUrl(url);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      id: 'minecraft' as Tab,
      label: 'Minecraft Status Cards',
      icon: <Server className="w-4 h-4" />,
      activeColor: 'text-emerald-400 border-emerald-500 bg-emerald-500/10',
      hoverColor: 'hover:bg-emerald-500/5 hover:text-emerald-300',
    },
    {
      id: 'science' as Tab,
      label: 'STEM Science Banners',
      icon: <Image className="w-4 h-4" />,
      activeColor: 'text-pink-400 border-pink-500 bg-pink-500/10',
      hoverColor: 'hover:bg-pink-500/5 hover:text-pink-300',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 flex flex-col lg:flex-row relative selection:bg-emerald-500 selection:text-black">
      {/* Ambient background glow */}
      <div 
        className="absolute top-0 left-0 right-0 h-96 pointer-events-none -z-10 opacity-70" 
        style={{ 
          backgroundImage: activeTab === 'minecraft' 
            ? 'radial-gradient(circle at top, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 70%)'
            : 'radial-gradient(circle at top, rgba(236,72,153,0.08) 0%, rgba(0,0,0,0) 70%)'
        }}
      />

      {/* 1. Mobile Header (Header top-bar on mobile, hidden on lg screens) */}
      <header className="lg:hidden w-full border-b border-neutral-900 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Brand Grass Block Logo */}
          <div className="w-7 h-7 bg-amber-950 rounded border border-amber-900 relative overflow-hidden flex items-center justify-center select-none flex-shrink-0">
            <div className="absolute top-0 inset-x-0 h-2 bg-emerald-600 border-b border-emerald-700" />
            <div className="absolute top-2 left-1 w-1 h-1 bg-emerald-600" />
            <span className="font-sans font-black text-white text-[10px] select-none z-10 drop-shadow-md">M</span>
          </div>
          <div>
            <h1 className="text-xs font-outfit font-bold text-white tracking-wider flex items-center gap-1">
              API CARD SUITE
              <span className={`text-[8px] py-0.5 px-1.5 rounded font-mono border ${
                activeTab === 'minecraft' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-pink-500/10 border-pink-500/20 text-pink-400'
              }`}>
                v1
              </span>
            </h1>
          </div>
        </div>

        {/* Hamburger toggle button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer select-none"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* 2. Desktop Sidebar Drawer Overlay on Mobile, Fixed Sidebar on Desktop */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-40 lg:z-10 w-[260px] bg-neutral-950 border-r border-neutral-900 flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 h-screen overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Logo Brand Frame */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-950 rounded border border-amber-900 relative overflow-hidden shadow-lg flex items-center justify-center select-none flex-shrink-0">
              {/* Grass Top Layer */}
              <div className="absolute top-0 inset-x-0 h-2.5 bg-emerald-600 border-b border-emerald-700" />
              <div className="absolute top-2.5 left-1 w-1.5 h-1 bg-emerald-600" />
              {/* Logo letter */}
              <span className="font-sans font-black text-white text-xs select-none z-10 drop-shadow-md mt-0.5">M</span>
            </div>
            <div>
              <h2 className="text-xs font-outfit font-bold text-white tracking-wider flex items-center gap-1.5">
                CARD API SUITE
                <span className="text-[8px] bg-neutral-900 border border-neutral-800 text-neutral-400 py-0.5 px-1.5 rounded font-mono">v1</span>
              </h2>
              <p className="text-[9px] text-neutral-500 font-mono uppercase">Developer Card Engines</p>
            </div>
          </div>

          {/* Navigation Items Group */}
          <div>
            <span className="block text-[10px] font-outfit font-bold text-neutral-500 uppercase tracking-widest mb-3 px-3">
              Engines
            </span>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      closeMobileMenu();
                    }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded text-xs font-outfit font-bold transition-all border border-transparent cursor-pointer select-none ${
                      isActive 
                        ? `${item.activeColor} border-neutral-800 shadow-sm` 
                        : `text-neutral-400 hover:text-neutral-200 border-transparent ${item.hoverColor}`
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Panel */}
        <div className="space-y-4 pt-6 border-t border-neutral-900">
          <div className="flex items-center gap-2.5 bg-neutral-900/40 p-3 rounded border border-neutral-900 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              activeTab === 'minecraft' ? 'bg-emerald-500' : 'bg-pink-500'
            }`} />
            <span className="text-neutral-400">Server Operational</span>
          </div>
          <div className="text-[10px] text-neutral-500 font-mono leading-relaxed px-1">
            Build clean status embed widgets and welcome banners with dynamic on-the-fly compiling.
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Back-drop shade */}
      {isMobileMenuOpen && (
        <div 
          onClick={closeMobileMenu}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden cursor-pointer"
        />
      )}

      {/* 3. Main content space */}
      <div className="flex-1 flex flex-col justify-between min-h-screen">
        <main className="px-4 py-8 sm:px-8 sm:py-10 max-w-7xl mx-auto w-full flex-1">
          {/* Header Title Section with active state variations */}
          {activeTab === 'minecraft' ? (
            <div className="mb-8 text-center sm:text-left max-w-3xl">
              <h2 className="text-2xl font-outfit font-bold text-white tracking-tight sm:text-4xl mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                <span>Minecraft Server Cards</span>
                <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-1 px-2.5 rounded font-mono w-max mx-auto sm:mx-0">
                  Java & Bedrock
                </span>
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Generate live multiplayer server widgets using a lightning-fast dynamic PNG image API. Enter your IP address below to compile and copy integration markdown.
              </p>
            </div>
          ) : (
            <div className="mb-8 text-center sm:text-left max-w-3xl">
              <h2 className="text-2xl font-outfit font-bold text-white tracking-tight sm:text-4xl mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                <span>STEM Science Banners</span>
                <span className="text-xs bg-pink-500/10 border border-pink-500/20 text-pink-400 py-1 px-2.5 rounded font-mono w-max mx-auto sm:mx-0">
                  Flat Vector Illustrations
                </span>
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Compile gorgeous educational or scientific banners on-the-fly. Personalize text overlays in the center, wrapped by detailed flat vector chemistry and physics illustrations.
              </p>
            </div>
          )}

          {/* Active Dashboard Views */}
          <div className="transition-all duration-300">
            {activeTab === 'minecraft' ? (
              <div>
                <Playground onUrlChange={handleMinecraftUrlChange} onServerChange={() => {}} />
                {currentMinecraftUrl && (
                  <div className="mt-8">
                    <EmbedSnippets url={currentMinecraftUrl} />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <SciencePlayground onUrlChange={handleScienceUrlChange} />
                {currentScienceUrl && (
                  <div className="mt-8">
                    <ScienceEmbedSnippets url={currentScienceUrl} />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-neutral-900 bg-neutral-950 text-neutral-500 py-8 text-xs font-mono">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                activeTab === 'minecraft' ? 'bg-emerald-500' : 'bg-pink-500'
              }`} />
              <span className="text-neutral-400">All generator engines online</span>
            </div>
            <div>
              Built with <Heart className="w-3.5 h-3.5 inline text-red-500 mx-0.5 fill-red-500" /> for community developers.
            </div>
            <div>
              &copy; {new Date().getFullYear()} Card Studio. Custom render api with Satori.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
