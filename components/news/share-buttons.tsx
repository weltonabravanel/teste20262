"use client";

import { useState } from "react";
import { 
  Facebook, 
  Twitter, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  Linkedin, 
  MessageSquare 
} from "lucide-react";

interface ShareProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareProps) {
  const [copied, setCopied] = useState(false);
  
  // URL do site para branding
  const portalName = "Portal RSS";
  const portalUrl = "https://seusite.com.br"; // Ajuste para sua URL real
  
  // Monta a mensagem base
  const shareMessage = `${title}\n\nLido em: ${portalName}\n\nLink: `;

  // Encoders para garantir que caracteres especiais não quebrem os links
  const encodedUrl = encodeURIComponent(url);
  const encodedFullMessage = encodeURIComponent(shareMessage + url);
  const encodedTitle = encodeURIComponent(title);

  const links = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedFullMessage}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  };

  const copyToClipboard = async (e: React.MouseEvent) => {
    // Impede que o clique propague se estiver dentro de uma área clicável maior
    e.preventDefault(); 
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(`${shareMessage}${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Garante que clicar no ícone não abra a notícia
  };

  return (
    <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-border/40" onClick={handleShareClick}>
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">
          Compartilhar
        </span>
        
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-[9px] font-bold text-primary hover:text-primary/70 transition-all uppercase focus:outline-none"
          title="Copiar link com créditos"
        >
          {copied ? (
            <>
              <Check size={10} className="text-green-500" />
              <span className="text-green-600">Copiado</span>
            </>
          ) : (
            <>
              <Copy size={10} />
              <span>Copiar Link</span>
            </>
          )}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#25D366] transition-colors" title="WhatsApp"><Share2 size={15} /></a>
        <a href={links.telegram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#0088cc] transition-colors" title="Telegram"><Send size={15} /></a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#0077b5] transition-colors" title="LinkedIn"><Linkedin size={15} /></a>
        <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-sky-400 transition-colors" title="Twitter"><Twitter size={15} /></a>
        <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1877F2] transition-colors" title="Facebook"><Facebook size={15} /></a>
        <a href={links.reddit} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#FF4500] transition-colors" title="Reddit"><MessageSquare size={15} /></a>
      </div>
    </div>
  );
}