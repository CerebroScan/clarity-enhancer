import { useState, useCallback } from "react";
import { Upload, FileImage, X, Loader2, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ScanStatus = "idle" | "ready" | "scanning" | "complete";
type ResultConfidence = "certain" | "uncertain" | null;

interface ScanResult {
  stage: string;
  confidence: number;
  description: string;
  confidenceLevel: ResultConfidence;
  allPredictions?: { stage: string; confidence: number }[];
}

const MODELS = [
  { id: "atlas", name: "Atlas", architecture: "ResNet-50" },
  { id: "orion", name: "Orion", architecture: "ResNet-101" },
  { id: "pulse", name: "Pulse", architecture: "EfficientNet-B2" },
];

const MOCK_RESULTS: Record<string, ScanResult> = {
  normal: {
    stage: "Normal",
    confidence: 94.2,
    description: "No significant signs of cognitive impairment detected.",
    confidenceLevel: "certain",
    allPredictions: [
      { stage: "Normal", confidence: 94.2 },
      { stage: "Very Mild Dementia", confidence: 3.8 },
      { stage: "Mild Dementia", confidence: 1.5 },
      { stage: "Moderate Dementia", confidence: 0.5 },
    ],
  },
  mild: {
    stage: "Very Mild Dementia",
    confidence: 67.3,
    description: "Early signs of cognitive decline detected. Further evaluation recommended.",
    confidenceLevel: "uncertain",
    allPredictions: [
      { stage: "Very Mild Dementia", confidence: 67.3 },
      { stage: "Normal", confidence: 22.1 },
      { stage: "Mild Dementia", confidence: 8.4 },
      { stage: "Moderate Dementia", confidence: 2.2 },
    ],
  },
  moderate: {
    stage: "Moderate Dementia",
    confidence: 88.7,
    description: "Significant neurological changes consistent with moderate-stage Alzheimer's disease.",
    confidenceLevel: "certain",
    allPredictions: [
      { stage: "Moderate Dementia", confidence: 88.7 },
      { stage: "Mild Dementia", confidence: 7.2 },
      { stage: "Very Mild Dementia", confidence: 3.1 },
      { stage: "Normal", confidence: 1.0 },
    ],
  },
};

export function ScanSection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAllPredictions, setShowAllPredictions] = useState(false);
  const [selectedModel, setSelectedModel] = useState("atlas");

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("ready");
    setResult(null);
    setShowAllPredictions(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const runScan = useCallback(() => {
    if (!file) return;
    setStatus("scanning");
    setShowAllPredictions(false);
    
    // Simulate API call
    setTimeout(() => {
      const results = Object.values(MOCK_RESULTS);
      const randomResult = results[Math.floor(Math.random() * results.length)];
      setResult(randomResult);
      setStatus("complete");
    }, 2500);
  }, [file]);

  const newScan = useCallback(() => {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setResult(null);
    setShowAllPredictions(false);
  }, []);

  const getStatusDisplay = () => {
    switch (status) {
      case "idle":
        return { text: "Upload an image to begin", icon: <Upload className="w-5 h-5" /> };
      case "ready":
        return { text: "Ready for scan", icon: <FileImage className="w-5 h-5" /> };
      case "scanning":
        return { text: "Analyzing MRI...", icon: <Loader2 className="w-5 h-5 animate-spin" /> };
      case "complete":
        return result?.confidenceLevel === "certain"
          ? { text: "Analysis Complete", icon: <CheckCircle2 className="w-5 h-5 text-success" /> }
          : { text: "Analysis Complete (Uncertain)", icon: <AlertTriangle className="w-5 h-5 text-warning" /> };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Upload Card */}
        <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3 text-muted-foreground">
                {statusDisplay.icon}
                <span className={`font-medium ${status === "scanning" ? "scan-pulse" : ""}`}>
                  {statusDisplay.text}
                </span>
              </div>
              
              {/* Model Selector */}
              <Select value={selectedModel} onValueChange={setSelectedModel} disabled={status === "scanning"}>
                <SelectTrigger className="w-[200px] bg-background">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <span className="font-medium">{model.name}</span>
                      <span className="text-muted-foreground ml-2">– {model.architecture}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-3">
              {status === "ready" && (
                <Button onClick={runScan} variant="glow">
                  Run Scan
                </Button>
              )}
              {status === "scanning" && (
                <Button disabled variant="secondary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning...
                </Button>
              )}
              {status === "complete" && (
                <Button onClick={newScan} variant="outline">
                  New Scan
                </Button>
              )}
            </div>
          </div>

          {/* Drop Zone */}
          {!preview && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById("fileInput")?.click()}
              className={`upload-zone ${isDragging ? "dragover" : ""}`}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-foreground font-medium mb-2">
                Drag & drop or paste (Ctrl+V) an MRI image
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG • Brain-only slices recommended
              </p>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-video max-w-md mx-auto">
                <img
                  src={preview}
                  alt="MRI Preview"
                  className="w-full h-full object-contain"
                />
                {status !== "scanning" && status !== "complete" && (
                  <button
                    onClick={newScan}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur text-foreground hover:bg-background transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {status === "scanning" && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <span className="text-sm font-medium text-foreground">Analyzing...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Card */}
        {result && status === "complete" && (
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                result.confidenceLevel === "certain" 
                  ? "bg-success/10" 
                  : "bg-warning/10"
              }`}>
                {result.confidenceLevel === "certain" 
                  ? <CheckCircle2 className="w-6 h-6 text-success" />
                  : <AlertTriangle className="w-6 h-6 text-warning" />
                }
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-foreground">{result.stage}</h3>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    result.confidenceLevel === "certain"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}>
                    {result.confidence.toFixed(1)}% confidence
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{result.description}</p>
                
                {/* Show most likely button - only for uncertain results */}
                {result.confidenceLevel === "uncertain" && !showAllPredictions && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllPredictions(true)}
                  >
                    <HelpCircle className="w-4 h-4" />
                    Show most likely result
                  </Button>
                )}

                {/* All predictions */}
                {showAllPredictions && result.allPredictions && (
                  <div className="mt-4 p-4 rounded-xl bg-muted/50 space-y-2 animate-scale-in">
                    <h4 className="text-sm font-semibold text-foreground mb-3">All Predictions:</h4>
                    {result.allPredictions.map((pred, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-foreground">{pred.stage}</span>
                            <span className="text-xs text-muted-foreground">{pred.confidence.toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${pred.confidence}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Examples Card */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Examples</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Supported Example */}
            <div className="space-y-3">
              <div className="success-badge">
                <CheckCircle2 className="w-4 h-4" />
                Supported Example
              </div>
              <p className="text-sm text-muted-foreground">
                Brain-only MRI slice (no skull visible). These images produce the most accurate results.
              </p>
              <div className="rounded-xl overflow-hidden border-2 border-success/30 bg-success/5">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <div className="text-center p-4">
                    <FileImage className="w-12 h-12 mx-auto mb-2 text-success/50" />
                    <span className="text-sm text-muted-foreground">Brain-only MRI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Unsupported Example */}
            <div className="space-y-3">
              <div className="warning-badge">
                <AlertTriangle className="w-4 h-4" />
                Unsupported Example
              </div>
              <p className="text-sm text-muted-foreground">
                Skull visible — please upload a brain-only slice for accurate classification.
              </p>
              <div className="rounded-xl overflow-hidden border-2 border-warning/50 bg-warning/5 relative">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <div className="text-center p-4">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-warning/70" />
                    <span className="text-sm text-muted-foreground">MRI with skull visible</span>
                  </div>
                </div>
                {/* Warning overlay stripe */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: "repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--warning) / 0.1) 10px, hsl(var(--warning) / 0.1) 20px)"
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
