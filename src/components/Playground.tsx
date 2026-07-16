import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';

interface PlaygroundProps {
  onUrlChange: (url: string) => void;
  onServerChange: (server: string, platform: 'java' | 'bedrock') => void;
}

export default function Playground({ onUrlChange, onServerChange }: PlaygroundProps) {
  const [server, setServer] = useState('play.hypixel.net');
  const [platform, setPlatform] = useState<'java' | 'bedrock'>('java');
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  
  // Track previous generated URL to avoid flickering during loading states
  const generatedUrlRef = useRef('');

  // Function to build and commit the API preview URL
  const generatePreview = () => {
    // Construct preview URL targeting our server endpoint (without width, height, or theme parameters)
    const queryParams = new URLSearchParams({
      server: server.trim(),
      platform,
    });
    
    const previewUrl = `/api/motd?${queryParams.toString()}&t=${Date.now()}`;
    const absoluteUrl = `${window.location.origin.replace('ais-dev', 'ais-pre')}/api/motd?${queryParams.toString()}`;
    
    setLoading(true);
    setImgSrc(previewUrl);
    generatedUrlRef.current = absoluteUrl;
    onUrlChange(absoluteUrl);
    onServerChange(server.trim(), platform);
  };

  // Generate once on initial mount
  useEffect(() => {
    generatePreview();
  }, []);

  const handleImageLoaded = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
  };

  return (
    <div id="playground-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
      {/* Configuration Column */}
      <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 p-6 rounded-lg flex flex-col justify-between">
        <div>
          <h2 className="font-outfit font-bold text-sm text-cyan-400 mb-6 uppercase tracking-wider">
            Card Configuration
          </h2>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Server IP */}
            <div>
              <label htmlFor="input-server-ip" className="block text-xs font-outfit font-semibold text-neutral-400 uppercase mb-2 tracking-wider">
                Server IP Address
              </label>
              <input
                id="input-server-ip"
                type="text"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                placeholder="e.g. play.hypixel.net"
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 text-sm text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Platform Toggle */}
            <div>
              <label className="block text-xs font-outfit font-semibold text-neutral-400 uppercase mb-2 tracking-wider">
                Server Edition (Platform)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-platform-java"
                  onClick={() => setPlatform('java')}
                  className={`py-2 px-3 rounded border text-xs font-outfit font-semibold transition-colors cursor-pointer ${
                    platform === 'java'
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:bg-neutral-850'
                  }`}
                >
                  JAVA EDITION
                </button>
                <button
                  type="button"
                  id="btn-platform-bedrock"
                  onClick={() => setPlatform('bedrock')}
                  className={`py-2 px-3 rounded border text-xs font-outfit font-semibold transition-colors cursor-pointer ${
                    platform === 'bedrock'
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:bg-neutral-850'
                  }`}
                >
                  BEDROCK (PE)
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={generatePreview}
          id="btn-generate-card"
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-outfit font-bold text-xs py-3.5 rounded cursor-pointer transition-all duration-75 flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-900/20"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>GENERATE STATUS CARD</span>
        </button>
      </div>

      {/* Live Preview Display Column */}
      <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-6 rounded-lg flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-outfit font-bold text-sm text-cyan-400 uppercase tracking-wider">
              Live Image Preview
            </h2>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${loading ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
              <span className="font-mono text-[11px] text-neutral-400">{loading ? 'Rendering...' : 'Live Synced'}</span>
            </div>
          </div>

          {/* Card Canvas area */}
          <div 
            className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden"
          >
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-opacity">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                <span className="font-outfit font-bold text-[11px] text-emerald-400 tracking-widest">RENDERING PNG...</span>
              </div>
            )}

            {imgSrc ? (
              <div className="w-full max-w-full flex justify-center py-2 overflow-hidden">
                <img
                  src={imgSrc}
                  alt="Minecraft Server MOTD Status Card"
                  onLoad={handleImageLoaded}
                  onError={handleImageError}
                  className="w-full h-auto max-w-full shadow-lg border border-neutral-950 bg-neutral-900 transition-opacity duration-300 object-contain"
                  style={{ 
                    maxWidth: '960px', 
                    aspectRatio: '960 / 120' 
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="font-outfit font-semibold text-xs text-neutral-500 uppercase">Awaiting Status Input</p>
              </div>
            )}
          </div>
        </div>

        {/* Status tips / info */}
        <div className="mt-6 p-4 bg-neutral-950 border border-neutral-800 rounded font-sans text-xs text-neutral-400 space-y-2">
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Direct Embed:</strong> This is a real PNG image generated server-side. You can embed it in a markdown file with `![]()` and it will query the server status dynamically on every load!
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Upstream Caching:</strong> Results are cached upstream for 2-5 minutes to prevent overloading the public APIs. Status updates will not show instantly if you query repeatedly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
