"use client";

import { Facebook, Twitter, Linkedin, Link as LinkIcon, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-1.5">
        <a 
          href={shareLinks.whatsapp} target="_blank" rel="noopener"
          className="p-1.5 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
        >
          <MessageCircle size={14} />
        </a>
        <a 
          href={shareLinks.facebook} target="_blank" rel="noopener"
          className="p-1.5 rounded-full bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
        >
          <Facebook size={14} />
        </a>
        <a 
          href={shareLinks.twitter} target="_blank" rel="noopener"
          className="p-1.5 rounded-full bg-foreground/10 text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          <Twitter size={14} />
        </a>
        <button 
          onClick={copyToClipboard}
          className={`p-1.5 rounded-full transition-colors ${copied ? "bg-green-500 text-white" : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"}`}
        >
          <LinkIcon size={14} />
        </button>
      </div>
    </div>
  );
}