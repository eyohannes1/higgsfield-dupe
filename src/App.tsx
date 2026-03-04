import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Image as ImageIcon, Video, Edit3, Library as LibraryIcon, Settings, 
  Wand2, Download, Trash2, Copy, Play, Maximize2, 
  CheckCircle2, XCircle, UploadCloud, SlidersHorizontal,
  Undo, Redo, Type, Eraser, MousePointer2, Crop, RotateCw, FlipHorizontal,
  ChevronDown, ChevronUp, Sparkles, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'generate' | 'animate' | 'editor' | 'library' | 'settings';

type LibraryItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
  metadata: any;
};

const GenerateTab = ({ onSave, onAnimate, onEdit, showToast, kieKey }: any) => {
  const [prompt, setPrompt] = useState('');
  const [negPrompt, setNegPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
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
          model: 'NanoBanana 2',
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
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <div className="w-full md:w-80 bg-[#131318] border-r border-white/10 p-5 overflow-y-auto flex flex-col gap-6 custom-scrollbar shrink-0">
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
          <div className="grid grid-cols-5 gap-2">
            {['1:1', '16:9', '9:16', '4:3', '3:4'].map(ar => (
              <button key={ar} onClick={() => setAspectRatio(ar)}
                className={`py-2 text-xs rounded-lg border ${aspectRatio === ar ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
              >
                {ar}
              </button>
            ))}
          </div>
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

      <div className="flex-1 bg-[#0a0a0f] p-4 md:p-6 overflow-y-auto flex items-center justify-center custom-scrollbar">
        {results.length > 0 ? (
          <div className={`grid gap-4 w-full max-w-4xl ${results.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {results.map((url, i) => (
              <div key={i} className="relative group aspect-square bg-black/50 rounded-2xl overflow-hidden border border-white/10">
                <img src={url} alt="Generated" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => onSave(url, prompt, 'image')} className="p-2 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-full text-white transition-colors" title="Save to Library"><LibraryIcon className="w-5 h-5" /></button>
                  <button onClick={() => onEdit(url)} className="p-2 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-full text-white transition-colors" title="Edit"><Edit3 className="w-5 h-5" /></button>
                  <button onClick={() => onAnimate(url)} className="p-2 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-full text-white transition-colors" title="Animate"><Video className="w-5 h-5" /></button>
                  <a href={url} download className="p-2 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-full text-white transition-colors" title="Download"><Download className="w-5 h-5" /></a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 flex flex-col items-center gap-4">
            <ImageIcon className="w-16 h-16 opacity-20" />
            <p>Enter a prompt to generate images</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AnimateTab = ({ initialImage, onSave, showToast, kieKey }: any) => {
  const [sourceImage, setSourceImage] = useState<string | null>(initialImage);
  const [motionPrompt, setMotionPrompt] = useState('');
  const [duration, setDuration] = useState('5s');
  const [fps, setFps] = useState('30');
  const [intensity, setIntensity] = useState('Medium');
  const [camera, setCamera] = useState('None');
  const [isAnimating, setIsAnimating] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);

  const handleAnimate = async () => {
    setIsAnimating(true);
    try {
      // Simulate API call to kie.ai
      const response = await fetch('https://api.kie.ai/v1/videos/animate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${kieKey || 'mock-key'}`,
        },
        body: JSON.stringify({
          model: 'Kling AI 3.0',
          image: sourceImage,
          prompt: motionPrompt,
          duration,
          fps,
          intensity,
          camera,
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
      setIsAnimating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <div className="w-full md:w-80 bg-[#131318] border-r border-white/10 p-5 overflow-y-auto flex flex-col gap-6 custom-scrollbar shrink-0">
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
        </div>

        <button 
          onClick={handleAnimate}
          disabled={isAnimating || !sourceImage}
          className="mt-auto w-full bg-[#ccff00] text-black font-semibold py-3.5 rounded-xl hover:bg-[#b3e600] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAnimating ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Play className="w-5 h-5" />}
          {isAnimating ? 'Animating...' : 'Animate'}
        </button>
      </div>

      <div className="flex-1 bg-[#0a0a0f] p-4 md:p-6 overflow-y-auto flex items-center justify-center custom-scrollbar">
        {videoResult ? (
          <div className="relative group w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
            <video src={videoResult} autoPlay loop controls className="w-full h-full object-contain" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => onSave(videoResult, motionPrompt, 'video')} className="p-2 bg-black/50 hover:bg-[#ccff00] hover:text-black rounded-full text-white transition-colors" title="Save to Library"><LibraryIcon className="w-5 h-5" /></button>
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
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <div className="w-full md:w-80 bg-[#131318] border-r border-white/10 p-5 overflow-y-auto flex flex-col gap-6 custom-scrollbar shrink-0">
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

      <div className="flex-1 bg-[#0a0a0f] p-4 md:p-6 overflow-y-auto flex items-center justify-center relative custom-scrollbar">
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

const LibraryTab = ({ library, setLibrary, onEdit, onAnimate }: any) => {
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
    <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item: LibraryItem) => (
            <div key={item.id} className="group relative aspect-square bg-[#131318] rounded-xl overflow-hidden border border-white/10">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
              ) : (
                <video src={item.url} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider">
                {item.type}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-xs line-clamp-2 mb-3 text-gray-200">{item.prompt}</p>
                <div className="flex gap-2">
                  {item.type === 'image' && (
                    <>
                      <button onClick={() => onEdit(item.url)} className="p-1.5 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-lg text-white transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => onAnimate(item.url)} className="p-1.5 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-lg text-white transition-colors" title="Animate"><Video className="w-4 h-4" /></button>
                    </>
                  )}
                  <a href={item.url} download className="p-1.5 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-lg text-white transition-colors" title="Download"><Download className="w-4 h-4" /></a>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-white/10 hover:bg-red-500 hover:text-white rounded-lg text-white transition-colors ml-auto" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
    <div className="p-6 max-w-2xl mx-auto w-full overflow-y-auto h-full custom-scrollbar">
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
            className={`flex flex-col md:flex-row items-center justify-center lg:justify-start p-2 lg:p-3 rounded-xl transition-colors min-w-[64px] md:min-w-0 ${
              activeTab === item.id 
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

const TopBar = ({ activeTab, kieKey }: any) => {
  const isConnected = !!kieKey;
  return (
    <div className="h-14 md:h-16 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 md:px-6 shrink-0 z-10 absolute top-0 left-0 right-0">
      <h1 className="text-base md:text-lg font-medium capitalize">{activeTab}</h1>
      <div className="flex items-center gap-2 text-xs md:text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#ccff00]' : 'bg-gray-500'}`} />
        <span className={isConnected ? 'text-white' : 'text-gray-400'}>{isConnected ? 'Connected' : 'Setup Keys'}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [kieKey, setKieKey] = useState('');
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [showKeyPrompt, setShowKeyPrompt] = useState(true);

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
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

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden selection:bg-[#ccff00] selection:text-black">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        <TopBar activeTab={activeTab} kieKey={kieKey} />
        
        <div className="flex-1 overflow-hidden relative pt-14 md:pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full absolute inset-0 pt-14 md:pt-16"
            >
              {activeTab === 'generate' && (
                <GenerateTab 
                  onSave={handleSaveToLibrary} 
                  onAnimate={handleSendToAnimate} 
                  onEdit={handleSendToEdit} 
                  showToast={showToast} 
                  kieKey={kieKey}
                />
              )}
              {activeTab === 'animate' && (
                <AnimateTab 
                  initialImage={animateImage} 
                  onSave={handleSaveToLibrary} 
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
          {showKeyPrompt && !kieKey && (
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
