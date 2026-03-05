import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Image as ImageIcon, Video, Edit3, Library as LibraryIcon, Settings,
  Wand2, Download, Trash2, Copy, Play, Maximize2,
  CheckCircle2, XCircle, UploadCloud, SlidersHorizontal,
  Undo, Redo, Type, Eraser, MousePointer2, Crop, RotateCw, FlipHorizontal,
  ChevronDown, ChevronUp, Sparkles, Check,
  Search, Box, UserSquare, BarChart2, ChevronRight, Monitor, Smartphone, Square, Presentation,
  Move, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'generate' | 'animate' | 'motion' | 'editor' | 'library' | 'settings';

type LibraryItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
  metadata: any;
};

const IMAGE_MODELS = [
  { id: 'higgsfield-soul-2', name: 'Higgsfield Soul 2.0', badge: 'NEW', description: 'Next generation ultra-realistic fashion visuals', category: 'Featured models', icon: <Sparkles className="w-4 h-4 text-gray-400" /> },
  { id: 'seedream-5-lite', name: 'Seedream 5.0 lite', description: 'Intelligent visual reasoning', category: 'Featured models', icon: <BarChart2 className="w-4 h-4 text-gray-400" /> },
  { id: 'seedream-4-5', name: 'Seedream 4.5', description: "ByteDance's next-gen 4K image model", category: 'Featured models', icon: <BarChart2 className="w-4 h-4 text-gray-400" /> },
  { id: 'nano-banana-2', name: 'Nano Banana 2', badge: 'NEW', description: 'Pro quality at flash speed', category: 'Featured models', icon: <span className="text-gray-400 font-bold text-sm leading-none flex items-center justify-center w-full h-full">G</span> },
  { id: 'nano-banana-pro', name: 'Nano Banana Pro', description: "Google's flagship generation model", category: 'Featured models', icon: <span className="text-[#ccff00] font-bold text-sm leading-none flex items-center justify-center w-full h-full">G</span> },
  { id: 'gpt-image-1-5', name: 'GPT Image 1.5', badge: 'PREMIUM', description: 'True-color precision rendering', category: 'Featured models', icon: <Box className="w-4 h-4 text-gray-400" /> },
  { id: 'nano-banana', name: 'Nano Banana', badge: 'PREMIUM', description: "Google's standard generation model", category: 'Other models', icon: <span className="text-gray-400 font-bold text-sm leading-none flex items-center justify-center w-full h-full">G</span> },
  { id: 'higgsfield-soul', name: 'Higgsfield Soul', description: 'Ultra-realistic fashion visuals', category: 'Other models', icon: <Sparkles className="w-4 h-4 text-gray-400" /> },
  { id: 'higgsfield-face-swap', name: 'Higgsfield Face Swap', description: 'Seamless face swapping', category: 'Other models', icon: <UserSquare className="w-4 h-4 text-gray-400" /> },
];

const VIDEO_MODELS = [
  { id: 'kling-ai', name: 'Kling AI 3.0', badge: 'NEW', description: 'Next generation video generation', category: 'Featured models', icon: <Video className="w-4 h-4 text-gray-400" /> },
  { id: 'kling-ai-pro', name: 'Kling AI Pro', badge: 'PREMIUM', description: 'High fidelity video generation', category: 'Featured models', icon: <Video className="w-4 h-4 text-[#ccff00]" /> },
  { id: 'higgsfield-video-1', name: 'Higgsfield Video 1.0', description: 'Cinematic video reasoning', category: 'Other models', icon: <Sparkles className="w-4 h-4 text-gray-400" /> },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1', icon: <Square className="w-4 h-4" /> },
  { id: '3:4', label: '3:4', icon: <Monitor className="w-4 h-4 rotate-90" /> },
  { id: '4:3', label: '4:3', icon: <Monitor className="w-4 h-4" /> },
  { id: '9:16', label: '9:16', icon: <Smartphone className="w-4 h-4" /> },
  { id: '16:9', label: '16:9', icon: <Presentation className="w-4 h-4" /> },
];

const ModelSelector = ({ model, setModel, modelsList = IMAGE_MODELS }: { model: string, setModel: (m: string) => void, modelsList?: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedModel = modelsList.find(m => m.id === model) || modelsList.find(m => m.id === 'nano-banana-pro') || modelsList[0];

  const filteredModels = modelsList.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase()));

  const featured = filteredModels.filter(m => m.category === 'Featured models');
  const others = filteredModels.filter(m => m.category === 'Other models');

  return (
    <div className="relative" ref={dropRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/50 border border-white/10 hover:bg-white/5 rounded-xl p-3 text-sm text-white flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5">
            {selectedModel.icon}
          </div>
          <span className="font-medium">{selectedModel.name}</span>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 mt-2 w-full bg-[#1a1a1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden left-0"
          >
            <div className="p-3 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                />
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
              {featured.length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Featured models
                  </div>
                  {featured.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setModel(m.id); setIsOpen(false); }}
                      className={`w-full text-left flex items-center gap-3 p-2 rounded-xl transition-colors ${model === m.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                      <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center bg-white/5 border border-white/5">
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`${model === m.id ? 'text-white' : 'text-gray-200'} font-medium text-sm truncate`}>{m.name}</span>
                          {m.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide leading-none ${m.badge === 'PREMIUM' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-[#ccff00] text-black'}`}>
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{m.description}</div>
                      </div>
                      {model === m.id && <Check className="w-4 h-4 text-[#ccff00] shrink-0 mx-2" />}
                    </button>
                  ))}
                </div>
              )}

              {others.length > 0 && (
                <div>
                  <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                    <Box className="w-3 h-3" /> Other models
                  </div>
                  {others.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setModel(m.id); setIsOpen(false); }}
                      className={`w-full text-left flex items-center gap-3 p-2 rounded-xl transition-colors ${model === m.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                      <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center bg-white/5 border border-white/5">
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`${model === m.id ? 'text-white' : 'text-gray-200'} font-medium text-sm truncate`}>{m.name}</span>
                          {m.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide leading-none ${m.badge === 'PREMIUM' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-[#ccff00] text-black'}`}>
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{m.description}</div>
                      </div>
                      {model === m.id && <Check className="w-4 h-4 text-[#ccff00] shrink-0 mx-2" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const AspectRatioSelector = ({ aspectRatio, setAspectRatio }: { aspectRatio: string, setAspectRatio: (ar: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedAR = ASPECT_RATIOS.find(r => r.id === aspectRatio) || ASPECT_RATIOS[0];

  return (
    <div className="relative" ref={dropRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/50 border border-white/10 hover:bg-white/5 rounded-xl p-3 text-sm text-white flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 text-gray-400">
            {selectedAR.icon}
          </div>
          <span className="font-medium">{selectedAR.label}</span>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 mt-2 w-full bg-[#1a1a1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden left-0 py-2"
          >
            {ASPECT_RATIOS.map(ar => (
              <button
                key={ar.id}
                onClick={() => { setAspectRatio(ar.id); setIsOpen(false); }}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 transition-colors ${aspectRatio === ar.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 text-gray-400">
                  {ar.icon}
                </div>
                <span className={`${aspectRatio === ar.id ? 'text-white' : 'text-gray-200'} font-medium text-sm flex-1`}>{ar.label}</span>
                {aspectRatio === ar.id && <Check className="w-4 h-4 text-[#ccff00] shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const GenerateTab = ({ onSave, onAnimate, onEdit, onPreview, showToast, kieKey }: any) => {
  const [prompt, setPrompt] = useState('');
  const [negPrompt, setNegPrompt] = useState('');
  const [model, setModel] = useState('nano-banana-pro');
  const [aspectRatio, setAspectRatio] = useState('3:4');
  const [style, setStyle] = useState('Photorealistic');
  const [steps, setSteps] = useState(30);
  const [cfg, setCfg] = useState(7);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [batchSize, setBatchSize] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showNegPrompt, setShowNegPrompt] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to kie.ai
      const response = await fetch('https://api.kie.ai/v1/images/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${kieKey || 'mock-key'}`,
        },
        body: JSON.stringify({
          model: model,
          prompt,
          negative_prompt: negPrompt,
          aspect_ratio: aspectRatio,
          style,
          steps,
          cfg_scale: cfg,
          seed,
          n: batchSize,
        })
      });

      if (!response.ok) {
        throw new Error('API request failed, falling back to mock');
      }

      const data = await response.json();
      setResults(data.images.map((img: any) => img.url));
      showToast('Images generated successfully');
    } catch (error) {
      // Fallback to mock responses
      setTimeout(() => {
        const newResults = Array(batchSize).fill(0).map((_, i) => `https://picsum.photos/seed/${seed + i}/1024/1024`);
        setResults(newResults);
        showToast('Images generated successfully (Mocked)');
      }, 2000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden min-h-0">
      <div className="w-full md:w-80 h-[45vh] md:h-full bg-[#131318] border-r border-white/10 p-5 overflow-y-auto overscroll-behavior-contain flex flex-col gap-6 custom-scrollbar shrink-0">
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Model</label>
          <ModelSelector model={model} setModel={setModel} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Prompt</label>
          <textarea
            value={prompt} onChange={e => setPrompt(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#ccff00] resize-none h-24"
            placeholder="Describe the scene you imagine..."
          />
        </div>

        <div>
          <button onClick={() => setShowNegPrompt(!showNegPrompt)} className="flex items-center justify-between w-full text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            <span>Negative Prompt</span>
            {showNegPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {showNegPrompt && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <textarea
                  value={negPrompt} onChange={e => setNegPrompt(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#ccff00] resize-none h-16"
                  placeholder="What to exclude..."
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Aspect Ratio</label>
          <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Style</label>
          <div className="flex flex-wrap gap-2">
            {['Photorealistic', 'Anime', 'Digital Art', 'Cinematic', '3D', 'Oil Painting', 'Watercolor'].map(s => (
              <button key={s} onClick={() => setStyle(s)}
                className={`px-3 py-1.5 text-xs rounded-full border ${style === s ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            <span>Advanced Settings</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1 text-gray-400"><span>Steps</span><span>{steps}</span></div>
                  <input type="range" min="1" max="50" value={steps} onChange={e => setSteps(Number(e.target.value))} className="w-full accent-[#ccff00]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 text-gray-400"><span>CFG Scale</span><span>{cfg}</span></div>
                  <input type="range" min="1" max="20" value={cfg} onChange={e => setCfg(Number(e.target.value))} className="w-full accent-[#ccff00]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 text-gray-400"><span>Seed</span><span>{seed}</span></div>
                  <div className="flex gap-2">
                    <input type="number" value={seed} onChange={e => setSeed(Number(e.target.value))} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#ccff00]" />
                    <button onClick={() => setSeed(Math.floor(Math.random() * 1000000))} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><RotateCw className="w-4 h-4" /></button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 text-gray-400"><span>Batch Size</span></div>
                  <div className="flex gap-2">
                    {[1, 2, 4].map(b => (
                      <button key={b} onClick={() => setBatchSize(b)} className={`flex-1 py-1.5 text-xs rounded-lg border ${batchSize === b ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>{b}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="mt-auto w-full bg-[#ccff00] text-black font-semibold py-3.5 rounded-xl hover:bg-[#b3e600] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Wand2 className="w-5 h-5" />}
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="flex-1 bg-[#0a0a0f] p-4 md:p-8 overflow-y-auto flex items-center justify-center custom-scrollbar">
        {results.length > 0 ? (
          <div className={`grid gap-6 w-full max-w-5xl grid-cols-1 ${results.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {results.map((url, i) => (
              <div key={i} className="relative group aspect-square bg-black/50 rounded-3xl overflow-hidden border border-white/10 shadow-lg hover:border-[#ccff00]/30 transition-all">
                <img
                  src={url}
                  alt="Generated"
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                  onClick={() => onPreview({ url, prompt, type: 'image' })}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 gap-3">
                  <div className="flex-1 flex gap-2">
                    <button onClick={() => onSave(url, prompt, 'image')} className="p-2.5 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-xl text-white transition-all backdrop-blur-md" title="Save to Library"><LibraryIcon className="w-5 h-5" /></button>
                    <button onClick={() => onEdit(url)} className="p-2.5 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-xl text-white transition-all backdrop-blur-md" title="Edit"><Edit3 className="w-5 h-5" /></button>
                    <button onClick={() => onAnimate(url)} className="p-2.5 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-xl text-white transition-all backdrop-blur-md" title="Animate"><Video className="w-5 h-5" /></button>
                  </div>
                  <a href={url} download className="p-2.5 bg-[#ccff00] text-black rounded-xl hover:scale-105 transition-all" title="Download"><Download className="w-5 h-5" /></a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 flex flex-col items-center gap-4">
            <ImageIcon className="w-16 h-16 opacity-20" />
            <p className="text-sm font-medium">Enter a prompt to generate images</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AnimateTab = ({ initialImage, onSave, onPreview, showToast, kieKey }: any) => {
  const [sourceImage, setSourceImage] = useState<string | null>(initialImage);
  const [model, setModel] = useState('kling-ai');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('1080p');
  const [motionPrompt, setMotionPrompt] = useState('');
  const [duration, setDuration] = useState('5s');
  const [fps, setFps] = useState('30');
  const [intensity, setIntensity] = useState('Medium');
  const [camera, setCamera] = useState('None');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [klingMotion, setKlingMotion] = useState({ panX: 0, panY: 0, zoom: 0, tilt: 0, roll: 0 });
  const [endImage, setEndImage] = useState<string | null>(null);

  const handleAnimate = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to kie.ai
      const response = await fetch('https://api.kie.ai/v1/videos/animate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${kieKey || 'mock-key'}`,
        },
        body: JSON.stringify({
          model: model,
          image: sourceImage,
          end_image: model.includes('kling') ? endImage : undefined,
          prompt: motionPrompt,
          aspect_ratio: aspectRatio,
          resolution,
          duration,
          fps,
          intensity,
          camera,
          klingMotion: model.includes('kling') ? klingMotion : undefined
        })
      });

      if (!response.ok) {
        throw new Error('API request failed, falling back to mock');
      }

      const data = await response.json();
      setVideoResult(data.video_url);
      showToast('Video generated successfully');
    } catch (error) {
      // Fallback to mock responses
      setTimeout(() => {
        setVideoResult('https://www.w3schools.com/html/mov_bbb.mp4');
        showToast('Video generated successfully (Mocked)');
      }, 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden min-h-0">
      <div className="w-full md:w-80 h-[45vh] md:h-full bg-[#131318] border-r border-white/10 p-5 overflow-y-auto overscroll-behavior-contain flex flex-col gap-6 custom-scrollbar shrink-0">
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Model</label>
          <ModelSelector model={model} setModel={setModel} modelsList={VIDEO_MODELS} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Aspect Ratio</label>
          <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Resolution</label>
          <div className="flex gap-2">
            {['720p', '1080p', '4K'].map(r => (
              <button key={r} onClick={() => setResolution(r)} className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${resolution === r ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>{r}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Start Frame</label>
          <div className="aspect-video bg-black/50 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
            {sourceImage ? (
              <>
                <img src={sourceImage} alt="Source" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                <button onClick={() => setSourceImage(null)} className="absolute p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><XCircle className="w-5 h-5" /></button>
              </>
            ) : (
              <div className="text-center p-4">
                <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Drag & drop or click to upload</p>
              </div>
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
              if (e.target.files?.[0]) {
                const url = URL.createObjectURL(e.target.files[0]);
                setSourceImage(url);
              }
            }} />
          </div>
        </div>

        {model.includes('kling') && (
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">End Frame</label>
            <div className="aspect-video bg-black/50 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
              {endImage ? (
                <>
                  <img src={endImage} alt="End" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                  <button onClick={() => setEndImage(null)} className="absolute p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><XCircle className="w-5 h-5" /></button>
                </>
              ) : (
                <div className="text-center p-4">
                  <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Drag & drop or click to upload</p>
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
                if (e.target.files?.[0]) {
                  const url = URL.createObjectURL(e.target.files[0]);
                  setEndImage(url);
                }
              }} />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Motion Prompt</label>
          <textarea
            value={motionPrompt} onChange={e => setMotionPrompt(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#ccff00] resize-none h-24"
            placeholder="Describe the motion..."
          />
        </div>

        <div className="border-t border-white/10 pt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Duration</label>
            <div className="flex gap-2">
              {['3s', '5s', '10s'].map(d => (
                <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-1.5 text-xs rounded-lg border ${duration === d ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Motion Intensity</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map(i => (
                <button key={i} onClick={() => setIntensity(i)} className={`flex-1 py-1.5 text-xs rounded-lg border ${intensity === i ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>{i}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Camera Motion</label>
            <div className="grid grid-cols-2 gap-2">
              {['None', 'Zoom In', 'Pan Left', 'Orbit'].map(c => (
                <button key={c} onClick={() => setCamera(c)} className={`py-1.5 text-xs rounded-lg border ${camera === c ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>{c}</button>
              ))}
            </div>
          </div>

          {model.includes('kling') && (
            <div className="border-t border-white/10 pt-4 mt-2">
              <label className="block text-xs font-medium text-[#ccff00] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Settings className="w-3 h-3" /> Kling AI Motion Controls
              </label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1 text-gray-400"><span>Pan X</span><span>{klingMotion.panX}</span></div>
                  <input type="range" min="-10" max="10" value={klingMotion.panX} onChange={e => setKlingMotion({ ...klingMotion, panX: Number(e.target.value) })} className="w-full accent-[#ccff00]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 text-gray-400"><span>Pan Y</span><span>{klingMotion.panY}</span></div>
                  <input type="range" min="-10" max="10" value={klingMotion.panY} onChange={e => setKlingMotion({ ...klingMotion, panY: Number(e.target.value) })} className="w-full accent-[#ccff00]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 text-gray-400"><span>Zoom</span><span>{klingMotion.zoom}</span></div>
                  <input type="range" min="-10" max="10" value={klingMotion.zoom} onChange={e => setKlingMotion({ ...klingMotion, zoom: Number(e.target.value) })} className="w-full accent-[#ccff00]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-gray-400"><span>Tilt</span><span>{klingMotion.tilt}</span></div>
                    <input type="range" min="-10" max="10" value={klingMotion.tilt} onChange={e => setKlingMotion({ ...klingMotion, tilt: Number(e.target.value) })} className="w-full accent-[#ccff00]" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-gray-400"><span>Roll</span><span>{klingMotion.roll}</span></div>
                    <input type="range" min="-10" max="10" value={klingMotion.roll} onChange={e => setKlingMotion({ ...klingMotion, roll: Number(e.target.value) })} className="w-full accent-[#ccff00]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleAnimate}
          disabled={isGenerating || !sourceImage}
          className="mt-auto w-full bg-[#ccff00] text-black font-semibold py-3.5 rounded-xl hover:bg-[#b3e600] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Play className="w-5 h-5" />}
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </button>
      </div>

      <div className="flex-1 bg-[#0a0a0f] p-4 md:p-8 overflow-y-auto flex items-center justify-center custom-scrollbar">
        {videoResult ? (
          <div
            className="relative group w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
            onClick={() => onPreview({ url: videoResult, prompt: motionPrompt, type: 'video' })}
          >
            <video src={videoResult} autoPlay loop muted className="w-full h-full object-contain" />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ccff00] flex items-center justify-center text-black">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <span className="text-sm font-medium text-white">Click to enlarge</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onSave(videoResult, motionPrompt, 'video'); }}
                className="p-3 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-xl text-white transition-all backdrop-blur-md"
                title="Save to Library"
              >
                <LibraryIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 flex flex-col items-center gap-4">
            <Video className="w-16 h-16 opacity-20" />
            <p>Upload an image and animate it</p>
          </div>
        )}
      </div>
    </div>
  );
};

type MotionArrow = { startX: number; startY: number; endX: number; endY: number };

const MotionControlTab = ({ onSave, onPreview, showToast, kieKey }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [arrows, setArrows] = useState<MotionArrow[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null);
  const [brushSize, setBrushSize] = useState(3);
  const [motionPrompt, setMotionPrompt] = useState('');
  const [duration, setDuration] = useState('5s');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!sourceImage) { setLoadedImage(null); return; }
    const img = new window.Image();
    img.onload = () => setLoadedImage(img);
    img.src = sourceImage;
  }, [sourceImage]);

  useEffect(() => {
    if (!loadedImage || !containerRef.current) return;
    const container = containerRef.current;
    const maxW = container.clientWidth;
    const maxH = container.clientHeight;
    const scale = Math.min(maxW / loadedImage.width, maxH / loadedImage.height, 1);
    setCanvasSize({ width: Math.floor(loadedImage.width * scale), height: Math.floor(loadedImage.height * scale) });
  }, [loadedImage]);

  const drawArrow = useCallback((ctx: CanvasRenderingContext2D, arrow: MotionArrow, isDashed = false) => {
    const { startX, startY, endX, endY } = arrow;
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 5) return;
    const angle = Math.atan2(dy, dx);
    const headLen = Math.min(16, len * 0.3);

    ctx.save();
    ctx.strokeStyle = '#ccff00';
    ctx.fillStyle = '#ccff00';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (isDashed) {
      ctx.setLineDash([8, 6]);
      ctx.globalAlpha = 0.6;
    } else {
      ctx.shadowColor = '#ccff00';
      ctx.shadowBlur = 6;
    }

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headLen * Math.cos(angle - Math.PI / 6), endY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(endX - headLen * Math.cos(angle + Math.PI / 6), endY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, [brushSize]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (loadedImage) {
      ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    arrows.forEach(a => drawArrow(ctx, a));

    if (isDrawing && drawStart && drawCurrent) {
      drawArrow(ctx, { startX: drawStart.x, startY: drawStart.y, endX: drawCurrent.x, endY: drawCurrent.y }, true);
    }
  }, [loadedImage, arrows, isDrawing, drawStart, drawCurrent, drawArrow]);

  useEffect(() => { renderCanvas(); }, [renderCanvas]);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? e.changedTouches[0]?.clientY ?? 0 : e.clientY;
    return { x: ((clientX - rect.left) / rect.width) * canvas.width, y: ((clientY - rect.top) / rect.height) * canvas.height };
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!loadedImage) return;
    const pos = getCanvasPos(e);
    setDrawStart(pos);
    setDrawCurrent(pos);
    setIsDrawing(true);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setDrawCurrent(getCanvasPos(e));
  };

  const handlePointerUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart) return;
    const end = getCanvasPos(e);
    const dx = end.x - drawStart.x;
    const dy = end.y - drawStart.y;
    if (Math.sqrt(dx * dx + dy * dy) > 10) {
      setArrows(prev => [...prev, { startX: drawStart.x, startY: drawStart.y, endX: end.x, endY: end.y }]);
    }
    setIsDrawing(false);
    setDrawStart(null);
    setDrawCurrent(null);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!loadedImage) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    setDrawStart(pos);
    setDrawCurrent(pos);
    setIsDrawing(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    setDrawCurrent(getCanvasPos(e));
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart) return;
    const end = getCanvasPos(e);
    const dx = end.x - drawStart.x;
    const dy = end.y - drawStart.y;
    if (Math.sqrt(dx * dx + dy * dy) > 10) {
      setArrows(prev => [...prev, { startX: drawStart.x, startY: drawStart.y, endX: end.x, endY: end.y }]);
    }
    setIsDrawing(false);
    setDrawStart(null);
    setDrawCurrent(null);
  };

  const handleGenerate = async () => {
    if (!sourceImage) return;
    setIsGenerating(true);
    try {
      const response = await fetch('https://api.kie.ai/v1/videos/motion-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${kieKey || 'mock-key'}` },
        body: JSON.stringify({
          model: 'kling-ai',
          image: sourceImage,
          motion_vectors: arrows.map(a => ({
            start: { x: a.startX / canvasSize.width, y: a.startY / canvasSize.height },
            end: { x: a.endX / canvasSize.width, y: a.endY / canvasSize.height },
          })),
          prompt: motionPrompt,
          duration,
        })
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      setVideoResult(data.video_url);
      showToast('Motion control video generated');
    } catch {
      setTimeout(() => {
        setVideoResult('https://www.w3schools.com/html/mov_bbb.mp4');
        showToast('Motion video generated (Mocked)');
      }, 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden min-h-0">
      <div className="w-full md:w-80 h-[45vh] md:h-full bg-[#131318] border-r border-white/10 p-5 overflow-y-auto overscroll-behavior-contain flex flex-col gap-6 custom-scrollbar shrink-0">
        <div>
          <label className="block text-xs font-medium text-[#ccff00] uppercase tracking-wider mb-2 flex items-center gap-2">
            <Move className="w-3.5 h-3.5" /> Kling Motion Control
          </label>
          <p className="text-xs text-gray-500 mb-4">Draw motion arrows on your image to control character and object movement.</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Source Image</label>
          <div className="aspect-video bg-black/50 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
            {sourceImage ? (
              <>
                <img src={sourceImage} alt="Source" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                <button onClick={() => { setSourceImage(null); setArrows([]); setVideoResult(null); }} className="absolute p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><XCircle className="w-5 h-5" /></button>
              </>
            ) : (
              <div className="text-center p-4">
                <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Upload image to draw motion</p>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
              if (e.target.files?.[0]) {
                setSourceImage(URL.createObjectURL(e.target.files[0]));
                setArrows([]);
                setVideoResult(null);
              }
            }} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Brush Size</label>
          <div className="flex items-center gap-3">
            <input type="range" min="1" max="8" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="flex-1 accent-[#ccff00]" />
            <span className="text-xs text-gray-400 w-6 text-right">{brushSize}px</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setArrows(prev => prev.slice(0, -1))}
            disabled={arrows.length === 0}
            className="flex-1 py-2 text-xs rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Undo className="w-3.5 h-3.5" /> Undo
          </button>
          <button
            onClick={() => setArrows([])}
            disabled={arrows.length === 0}
            className="flex-1 py-2 text-xs rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>

        {arrows.length > 0 && (
          <div className="text-xs text-gray-500">
            {arrows.length} motion vector{arrows.length !== 1 ? 's' : ''} drawn
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Motion Prompt</label>
          <textarea
            value={motionPrompt} onChange={e => setMotionPrompt(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#ccff00] resize-none h-20"
            placeholder="Describe the desired motion..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Duration</label>
          <div className="flex gap-2">
            {['3s', '5s', '10s'].map(d => (
              <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${duration === d ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>{d}</button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !sourceImage || arrows.length === 0}
          className="mt-auto w-full bg-[#ccff00] text-black font-semibold py-3.5 rounded-xl hover:bg-[#b3e600] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Play className="w-5 h-5" />}
          {isGenerating ? 'Generating...' : 'Generate Motion Video'}
        </button>
      </div>

      <div ref={containerRef} className="flex-1 bg-[#0a0a0f] p-4 md:p-8 overflow-y-auto flex items-center justify-center custom-scrollbar">
        {videoResult ? (
          <div
            className="relative group w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
            onClick={() => onPreview({ url: videoResult, prompt: motionPrompt, type: 'video' })}
          >
            <video src={videoResult} autoPlay loop muted className="w-full h-full object-contain" />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ccff00] flex items-center justify-center text-black">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <span className="text-sm font-medium text-white">Click to enlarge</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onSave(videoResult, motionPrompt, 'video'); }}
                className="p-3 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-xl text-white transition-all backdrop-blur-md"
                title="Save to Library"
              >
                <LibraryIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : sourceImage && loadedImage ? (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ width: canvasSize.width, height: canvasSize.height }}>
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="cursor-crosshair block"
              style={{ width: canvasSize.width, height: canvasSize.height }}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-gray-300 pointer-events-none">
              Click & drag to draw motion arrows
            </div>
          </div>
        ) : (
          <div className="text-gray-500 flex flex-col items-center gap-4">
            <Move className="w-16 h-16 opacity-20" />
            <p>Upload an image to start drawing motion paths</p>
          </div>
        )}
      </div>
    </div>
  );
};

const EditorTab = ({ initialImage, onSave, showToast }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);

  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<any[]>([]);
  const [currentStroke, setCurrentStroke] = useState<any[]>([]);
  const [color, setColor] = useState('#ccff00');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

  useEffect(() => {
    if (initialImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setImage(img);
        setStrokes([]);
      };
      img.src = initialImage;
    }
  }, [initialImage]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    ctx.drawImage(image, 0, 0);
    ctx.filter = 'none';

    const allStrokes = [...strokes, currentStroke].filter(s => s.length > 0);
    allStrokes.forEach(stroke => {
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.strokeStyle = stroke[0].tool === 'eraser' ? '#000000' : stroke[0].color;
      ctx.lineWidth = stroke[0].size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (stroke[0].tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    });
  }, [image, brightness, contrast, saturation, blur, strokes, currentStroke]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const coords = getCoordinates(e);
    setCurrentStroke([{ ...coords, color, size: brushSize, tool }]);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    setCurrentStroke(prev => [...prev, { ...coords, color, size: brushSize, tool }]);
  };

  const handleEnd = () => {
    if (isDrawing) {
      setIsDrawing(false);
      if (currentStroke.length > 0) {
        setStrokes(prev => [...prev, currentStroke]);
        setCurrentStroke([]);
      }
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl, 'Edited Image', 'image');
      showToast('Saved to Library');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden min-h-0 custom-scrollbar overscroll-behavior-contain">
      <div className="w-full md:w-80 h-auto md:h-full bg-[#131318] border-t md:border-t-0 md:border-r border-white/10 p-5 flex flex-col gap-6 shrink-0 order-last md:order-first">
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Adjustments</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Brightness</span><span>{brightness}%</span></div>
              <input type="range" min="0" max="200" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-[#ccff00]" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Contrast</span><span>{contrast}%</span></div>
              <input type="range" min="0" max="200" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-[#ccff00]" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Saturation</span><span>{saturation}%</span></div>
              <input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-[#ccff00]" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Blur</span><span>{blur}px</span></div>
              <input type="range" min="0" max="20" value={blur} onChange={e => setBlur(Number(e.target.value))} className="w-full accent-[#ccff00]" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Drawing</h3>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setTool('brush')} className={`p-2 rounded-lg ${tool === 'brush' ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-gray-400'}`}><Edit3 className="w-5 h-5" /></button>
            <button onClick={() => setTool('eraser')} className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-gray-400'}`}><Eraser className="w-5 h-5" /></button>
            <button onClick={() => { setStrokes(strokes.slice(0, -1)); redraw(); }} disabled={strokes.length === 0} className="p-2 rounded-lg bg-white/5 text-gray-400 disabled:opacity-50 ml-auto"><Undo className="w-5 h-5" /></button>
          </div>
          <div className="flex items-center gap-4">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
            <input type="range" min="1" max="50" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="flex-1 accent-[#ccff00]" />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!image}
          className="mt-auto w-full bg-[#ccff00] text-black font-semibold py-3.5 rounded-xl hover:bg-[#b3e600] transition-colors disabled:opacity-50"
        >
          Save to Library
        </button>
      </div>

      <div className="flex-1 bg-[#0a0a0f] p-4 md:p-6 md:overflow-y-auto overscroll-behavior-contain flex items-center justify-center relative custom-scrollbar shrink-0 md:shrink">
        {!image && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <ImageIcon className="w-16 h-16 opacity-20 mb-4" />
            <p>Select an image from Library or Generate one to edit</p>
          </div>
        )}
        <div className="relative max-w-full max-h-full overflow-hidden rounded-lg shadow-2xl border border-white/10 bg-black/50">
          <canvas
            ref={canvasRef}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            className="max-w-full max-h-[80vh] object-contain cursor-crosshair touch-none"
          />
        </div>
      </div>
    </div>
  );
};

const PreviewModal = ({ isOpen, onClose, item, onEdit, onAnimate, onSave }: any) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
        >
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-20"
          >
            <XCircle className="w-8 h-8" />
          </motion.button>

          <div className="w-full max-w-7xl h-full flex flex-col md:flex-row gap-8 items-center justify-center pointer-events-none">
            <div className="flex-1 h-full flex items-center justify-center pointer-events-auto w-full relative group">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.prompt}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  autoPlay
                  loop
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
              )}
            </div>

            <div className="md:w-96 w-full flex flex-col gap-6 p-6 bg-[#131318] border border-white/10 rounded-2xl md:self-start pointer-events-auto max-h-full overflow-y-auto custom-scrollbar">
              <div>
                <h3 className="text-xs font-medium text-[#ccff00] uppercase tracking-wider mb-2">Prompt</h3>
                <p className="text-sm text-gray-200 leading-relaxed font-medium">{item.prompt || 'No description available'}</p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {onSave && (
                    <button
                      onClick={() => onSave(item.url, item.prompt, item.type)}
                      className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors border border-white/5"
                    >
                      <LibraryIcon className="w-4 h-4" /> Save
                    </button>
                  )}
                  {item.type === 'image' && onEdit && (
                    <button
                      onClick={() => { onEdit(item.url); onClose(); }}
                      className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors border border-white/5"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                  )}
                  {item.type === 'image' && onAnimate && (
                    <button
                      onClick={() => { onAnimate(item.url); onClose(); }}
                      className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors border border-white/5"
                    >
                      <Video className="w-4 h-4" /> Animate
                    </button>
                  )}
                  <a
                    href={item.url}
                    download
                    className="flex items-center justify-center gap-2 p-3 bg-[#ccff00] text-black font-semibold rounded-xl text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LibraryTab = ({ library, setLibrary, onEdit, onAnimate, onPreview }: any) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = library.filter((item: LibraryItem) => {
    if (filter !== 'All' && item.type !== filter.toLowerCase()) return false;
    if (search && !item.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a: LibraryItem, b: LibraryItem) => b.timestamp - a.timestamp);

  const handleDelete = (id: string) => {
    setLibrary((prev: LibraryItem[]) => prev.filter(i => i.id !== id));
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden min-h-0">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 shrink-0">
        <div className="flex bg-[#131318] rounded-xl p-1 border border-white/10 w-full md:w-auto">
          {['All', 'Image', 'Video'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
        <input
          type="text" placeholder="Search prompts..." value={search} onChange={e => setSearch(e.target.value)}
          className="bg-[#131318] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00] w-full md:w-64"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((item: LibraryItem) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-[#131318] rounded-2xl overflow-hidden border border-white/10 hover:border-[#ccff00]/30 transition-all cursor-pointer"
              onClick={() => onPreview({ url: item.url, prompt: item.prompt, type: item.type })}
            >
              {item.type === 'image' ? (
                <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full relative">
                  <video src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/5">
                {item.type}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-xs line-clamp-2 mb-3 text-gray-200 font-medium">{item.prompt}</p>
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  {item.type === 'image' && (
                    <>
                      <button onClick={() => onEdit(item.url)} className="p-2 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-xl text-white transition-all backdrop-blur-md" title="Edit"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => onAnimate(item.url)} className="p-2 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-xl text-white transition-all backdrop-blur-md" title="Animate"><Video className="w-4 h-4" /></button>
                    </>
                  )}
                  <a href={item.url} download className="p-2 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-xl text-white transition-all backdrop-blur-md" title="Download"><Download className="w-4 h-4" /></a>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-500 rounded-xl text-white transition-all backdrop-blur-md ml-auto" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <LibraryIcon className="w-16 h-16 opacity-20 mb-4" />
            <p>No items found in library</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsTab = ({ kieKey, setKieKey, showToast }: any) => {
  return (
    <div className="p-6 max-w-2xl mx-auto w-full overflow-y-auto h-full overscroll-behavior-contain custom-scrollbar">
      <h2 className="text-2xl font-bold mb-8">Settings</h2>

      <div className="space-y-6 bg-[#131318] p-6 rounded-2xl border border-white/10">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">kie.ai API Key</label>
          <input
            type="password" value={kieKey} onChange={e => setKieKey(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ccff00]"
            placeholder="sk-..."
          />
          <p className="text-xs text-gray-500 mt-2">Required for NanoBanana 2 and Kling AI 3.0 via kie.ai</p>
        </div>

        <button
          onClick={() => showToast('Settings saved successfully')}
          className="bg-[#ccff00] text-black font-semibold px-6 py-2.5 rounded-xl hover:bg-[#b3e600] transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }: any) => {
  const navItems = [
    { id: 'generate', icon: ImageIcon, label: 'Generate' },
    { id: 'animate', icon: Video, label: 'Animate' },
    { id: 'motion', icon: Move, label: 'Motion' },
    { id: 'editor', icon: Edit3, label: 'Editor' },
    { id: 'library', icon: LibraryIcon, label: 'Library' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-full md:w-16 lg:w-64 bg-[#0a0a0f] border-t md:border-t-0 md:border-r border-white/10 flex flex-row md:flex-col order-last md:order-first shrink-0 z-20">
      <div className="hidden md:flex h-16 items-center justify-center lg:justify-start lg:px-6 border-b border-white/10 shrink-0">
        <Sparkles className="w-6 h-6 text-[#ccff00]" />
        <span className="hidden lg:block ml-3 font-bold text-lg tracking-wide">STUDIO</span>
      </div>
      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start gap-2 p-2 md:p-4 overflow-x-auto md:overflow-visible">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className={`flex flex-col md:flex-row items-center justify-center lg:justify-start p-2 lg:p-3 rounded-xl transition-colors min-w-[64px] md:min-w-0 ${activeTab === item.id
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <item.icon className="w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5" />
            <span className="text-[10px] mt-1 md:mt-0 lg:text-sm lg:ml-3 font-medium block lg:block md:hidden">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const TopBar = ({ activeTab, kieKey, onSetupKeysClick }: any) => {
  const isConnected = !!kieKey;
  return (
    <div className="h-14 md:h-16 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 md:px-6 shrink-0 z-10 w-full">
      <h1 className="text-base md:text-lg font-medium capitalize">{activeTab}</h1>
      <button onClick={onSetupKeysClick} className="flex items-center gap-2 text-xs md:text-sm bg-white/5 hover:bg-white/10 transition-colors px-3 py-1.5 rounded-full border border-white/10">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#ccff00]' : 'bg-gray-500'}`} />
        <span className={isConnected ? 'text-white' : 'text-gray-400'}>{isConnected ? 'Connected' : 'Setup Keys'}</span>
      </button>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [kieKey, setKieKey] = useState('');
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [showKeyPrompt, setShowKeyPrompt] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveToLibrary = (url: string, prompt: string, type: 'image' | 'video') => {
    const newItem: LibraryItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      url,
      prompt,
      timestamp: Date.now(),
      metadata: {}
    };
    setLibrary(prev => [newItem, ...prev]);
    showToast('Saved to Library');
  };

  const handleSendToEdit = (url: string) => {
    setEditorImage(url);
    setActiveTab('editor');
  };

  const handleSendToAnimate = (url: string) => {
    setAnimateImage(url);
    setActiveTab('animate');
  };

  const [editorImage, setEditorImage] = useState<string | null>(null);
  const [animateImage, setAnimateImage] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<{ url: string, prompt: string, type: 'image' | 'video' } | null>(null);

  const handlePreview = (item: { url: string, prompt: string, type: 'image' | 'video' }) => {
    setPreviewItem(item);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen h-[100dvh] bg-[#0a0a0f] text-white font-sans overflow-hidden selection:bg-[#ccff00] selection:text-black">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        <TopBar activeTab={activeTab} kieKey={kieKey} onSetupKeysClick={() => setShowKeyPrompt(true)} />

        <div className="flex-1 overflow-hidden relative min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              {activeTab === 'generate' && (
                <GenerateTab
                  onSave={handleSaveToLibrary}
                  onAnimate={handleSendToAnimate}
                  onEdit={handleSendToEdit}
                  onPreview={handlePreview}
                  showToast={showToast}
                  kieKey={kieKey}
                />
              )}
              {activeTab === 'animate' && (
                <AnimateTab
                  initialImage={animateImage}
                  onSave={handleSaveToLibrary}
                  onPreview={handlePreview}
                  showToast={showToast}
                  kieKey={kieKey}
                />
              )}
              {activeTab === 'motion' && (
                <MotionControlTab
                  onSave={handleSaveToLibrary}
                  onPreview={handlePreview}
                  showToast={showToast}
                  kieKey={kieKey}
                />
              )}
              {activeTab === 'editor' && (
                <EditorTab
                  initialImage={editorImage}
                  onSave={handleSaveToLibrary}
                  showToast={showToast}
                />
              )}
              {activeTab === 'library' && (
                <LibraryTab
                  library={library}
                  setLibrary={setLibrary}
                  onEdit={handleSendToEdit}
                  onAnimate={handleSendToAnimate}
                  onPreview={handlePreview}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsTab
                  kieKey={kieKey} setKieKey={setKieKey}
                  showToast={showToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <PreviewModal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          item={previewItem}
          onEdit={handleSendToEdit}
          onAnimate={handleSendToAnimate}
          onSave={activeTab === 'generate' ? handleSaveToLibrary : undefined}
        />

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-20 md:bottom-6 left-1/2 z-50 flex items-center gap-2 bg-[#131318] border border-white/10 px-4 py-3 rounded-xl shadow-2xl"
            >
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#ccff00]" /> : <XCircle className="w-5 h-5 text-red-500" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showKeyPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <div className="bg-[#131318] border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl">
                <h2 className="text-2xl font-bold mb-2">Welcome to Studio</h2>
                <p className="text-gray-400 text-sm mb-6">Please enter your kie.ai API key to enable image and video generation. You can also do this later in Settings.</p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">kie.ai API Key</label>
                  <input
                    type="password" value={kieKey} onChange={e => setKieKey(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                    placeholder="sk-..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowKeyPrompt(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={() => {
                      if (kieKey) {
                        setShowKeyPrompt(false);
                        showToast('API Key saved');
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#ccff00] text-black hover:bg-[#b3e600] transition-colors font-semibold"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
