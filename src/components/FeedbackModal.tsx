"use client";

import { useState, useEffect } from "react";
import { X, Star, Send, CheckCircle2 } from "lucide-react";
import { AppItem } from "@/lib/mockData";

interface Props {
  app: AppItem;
  onClose: () => void;
}

export default function FeedbackModal({ app, onClose }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !message.trim()) return;
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Beri masukan untuk ${app.name}`}
    >
      <div className="w-full max-w-md bg-foundry-slate border border-foundry-border relative card-clip shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-molten" />

        <div className="flex items-start justify-between p-6 border-b border-foundry-border">
          <div>
            <div
              className="text-molten uppercase tracking-widest mb-1"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
            >
              Beri Masukan
            </div>
            <h2
              className="text-foundry-white"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "20px" }}
            >
              {app.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-foundry-muted hover:text-foundry-white transition-colors p-1"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-active" />
            <p
              className="text-foundry-white"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "18px" }}
            >
              Masukan terkirim!
            </p>
            <p className="text-foundry-muted text-sm">Terima kasih atas laporan kamu.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            <div>
              <label
                className="block text-foundry-muted mb-3 uppercase tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
              >
                Rating
              </label>
              <div className="flex gap-2" role="group" aria-label="Pilih rating bintang">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110 active:scale-95"
                    aria-label={`${star} bintang`}
                    aria-pressed={rating >= star}
                  >
                    <Star
                      className="w-8 h-8 transition-colors duration-100"
                      style={{
                        color: (hover || rating) >= star ? "#FF6B2B" : "#2E3A55",
                        fill: (hover || rating) >= star ? "#FF6B2B" : "#2E3A55",
                      }}
                    />
                  </button>
                ))}
              </div>
              {!rating && (
                <p className="text-foundry-muted mt-1.5" style={{ fontSize: "12px" }}>
                  Pilih rating terlebih dahulu
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="feedback-message"
                className="block text-foundry-muted mb-2 uppercase tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
              >
                Pesan / Laporan Bug
              </label>
              <textarea
                id="feedback-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Contoh: Tombol input lot number tidak responsif saat shift malam..."
                className="w-full bg-foundry-steel border border-foundry-border text-foundry-text placeholder-foundry-muted/50 resize-none p-3 focus:outline-none focus:border-molten transition-colors duration-200"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
              />
            </div>

            <button
              type="submit"
              disabled={!rating || !message.trim()}
              className="flex items-center justify-center gap-2 py-3 bg-molten text-foundry-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-molten-bright transition-all duration-200 card-clip"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "14px", letterSpacing: "0.1em" }}
            >
              <Send className="w-4 h-4" />
              KIRIM MASUKAN
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
