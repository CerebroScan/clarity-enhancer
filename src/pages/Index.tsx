import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScanSection } from "@/components/ScanSection";
import { AboutSection } from "@/components/AboutSection";

const Index = () => {
  const [activeTab, setActiveTab] = useState("scan");

  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Handle paste events for image upload
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (activeTab !== "scan") return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            // Dispatch custom event that ScanSection can listen to
            window.dispatchEvent(new CustomEvent("paste-image", { detail: file }));
          }
          break;
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1">
        {activeTab === "scan" && <ScanSection />}
        {activeTab === "about" && <AboutSection />}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
