import React, { useState, useEffect } from 'react';
import { RefreshCw, HelpCircle, CheckCircle, ShieldAlert, Image, Sparkles, Beaker } from 'lucide-react';

interface SciencePlaygroundProps {
  onUrlChange: (url: string) => void;
}

export default function SciencePlayground({ onUrlChange }: SciencePlaygroundProps) {
  const [text, setText] = useState('Celestial Theater');
  const [subtitle, setSubtitle] = useState('Twelfth Night or What You Will 🎭');
  const [theme, setTheme] = useState('space_theater');
  const [imgSrc, setImgSrc] = useState('');
  const [loading, setLoading] = useState(false);

  // Formulate direct API request URL
  const generateUrl = (textVal: string, subVal: string, themeVal: string) => {
    const params = new URLSearchParams();
    if (textVal) params.set('text', textVal);
    if (subVal) params.set('subtitle', subVal);
    if (themeVal) params.set('theme', themeVal);

    return `${window.location.origin}/api/science-banner?${params.toString()}`;
  };

  const generatePreview = () => {
    setLoading(true);
    const url = generateUrl(text, subtitle, theme);
    // Add a cache buster timestamp so the image refetches immediately in the browser
    const previewUrl = `${url}&t=${Date.now()}`;
    setImgSrc(previewUrl);
    onUrlChange(url);
  };

  // Auto-generate on first mount or theme changes
  useEffect(() => {
    generatePreview();
  }, [theme]);

  const handleImageLoaded = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
  };

  return (
    <div id="science-playground-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
      {/* Configuration Column */}
      <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 p-6 rounded-lg flex flex-col justify-between">
        <div>
          <h2 className="font-outfit font-bold text-sm text-pink-400 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Beaker className="w-4 h-4 text-pink-400 animate-pulse" />
            STEM Banner Designer
          </h2>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Theme Preset */}
            <div>
              <label htmlFor="select-science-theme" className="block text-xs font-outfit font-semibold text-neutral-400 uppercase mb-2 tracking-wider">
                Theme Palette
              </label>
              <select
                id="select-science-theme"
                value={theme}
                onChange={(e) => {
                  const val = e.target.value;
                  setTheme(val);
                  if (val === 'space_theater') {
                    setText('Celestial Theater');
                    setSubtitle('Twelfth Night or What You Will 🎭');
                  } else if (val === 'science_lab') {
                    setText('Science Laboratory');
                    setSubtitle('Research & Innovation Center 🔬');
                  } else if (val === 'purple_swirl') {
                    setText('Creative Studio');
                    setSubtitle('Abstract Visual Playground 🌀');
                  }
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 font-semibold"
              >
                <option value="space_theater">🎭 Space & Theater Theme</option>
                <option value="science_lab">🔬 Science Lab Theme</option>
                <option value="purple_swirl">🌀 Abstract Purple Swirl Theme</option>
              </select>
            </div>

            {/* Main Title Text */}
            <div>
              <label htmlFor="input-banner-title" className="block text-xs font-outfit font-semibold text-neutral-400 uppercase mb-2 tracking-wider">
                Main Text (Center Title)
              </label>
              <input
                id="input-banner-title"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. STEM Lab"
                maxLength={24}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-pink-500 font-semibold"
              />
            </div>

            {/* Subtitle / Tagline Text */}
            <div>
              <label htmlFor="input-banner-subtitle" className="block text-xs font-outfit font-semibold text-neutral-400 uppercase mb-2 tracking-wider">
                Subtitle / Footer Tagline
              </label>
              <input
                id="input-banner-subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Exploring the Unknown 🔬"
                maxLength={36}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={generatePreview}
          id="btn-generate-science-banner"
          className="w-full mt-6 bg-pink-600 hover:bg-pink-500 active:bg-pink-700 text-white font-outfit font-bold text-xs py-3.5 rounded cursor-pointer transition-all duration-75 flex items-center justify-center gap-2 shadow-md hover:shadow-pink-900/20 select-none"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>COMPILE STEM BANNER</span>
        </button>
      </div>

      {/* Live Preview Display Column */}
      <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-6 rounded-lg flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-outfit font-bold text-sm text-pink-400 uppercase tracking-wider flex items-center gap-2">
              <Image className="w-4 h-4 text-pink-400" />
              Live Banner Preview (~6:1 Wide Panoramic)
            </h2>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${loading ? 'bg-pink-400 animate-ping' : 'bg-pink-500'}`} />
              <span className="font-mono text-[11px] text-neutral-400">{loading ? 'Compiling...' : 'Live Synced'}</span>
            </div>
          </div>

          {/* Card Canvas area */}
          <div 
            className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden"
          >
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-opacity">
                <RefreshCw className="w-8 h-8 text-pink-400 animate-spin mb-2" />
                <span className="font-outfit font-bold text-[11px] text-pink-400 tracking-widest">GENERATING VECTOR BANNER PNG...</span>
              </div>
            )}

            {imgSrc ? (
              <div className="w-full max-w-full flex justify-center py-2 overflow-hidden">
                <img
                  src={imgSrc}
                  alt="STEM Science Custom Banner"
                  onLoad={handleImageLoaded}
                  onError={handleImageError}
                  className="w-full h-auto max-w-full shadow-lg border border-neutral-950 bg-neutral-900 transition-opacity duration-300 object-contain rounded"
                  style={{ 
                    maxWidth: '900px', 
                    aspectRatio: '900 / 150' 
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="font-outfit font-semibold text-xs text-neutral-500 uppercase">Awaiting Design Configurations</p>
              </div>
            )}
          </div>
        </div>

        {/* Status tips / info */}
        <div className="mt-6 p-4 bg-neutral-950 border border-neutral-800 rounded font-sans text-xs text-neutral-400 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
            <p>
              {theme === 'space_theater' && (
                <span><strong>Celestial Theater Theme:</strong> Composed with majestic planets, hanging star mobiles, theater comedy/tragedy masks, musical staff notes, and draped corner curtains.</span>
              )}
              {theme === 'science_lab' && (
                <span><strong>Science Lab Theme:</strong> Composed with periwinkle and deep violet gradients, watermarked atoms, flasks filled with boiling liquids, mortar and pestle, magnifying glass, and detailed microscope.</span>
              )}
              {theme === 'purple_swirl' && (
                <span><strong>Abstract Purple Swirl Theme:</strong> Composed with highly graphic slinky coils, neon pink zigzags, golden crosshatches, four-point white/gold sparkle clusters, and dynamic wave swooshes.</span>
              )}
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Customizable Typography:</strong> Your custom title is rendered in beautiful display lettering with elegant drop shadows, perfectly balanced with a supporting footer subtitle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
