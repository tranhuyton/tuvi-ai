'use client';

import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertCircle, Loader2, X, RefreshCw } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.1-pro-preview');
  const [testStatus, setTestStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
    latency?: number;
    model?: string;
  }>({ loading: false });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('user_gemini_api_key') || '';
      setApiKey(savedKey);
      const savedModel = localStorage.getItem('user_gemini_model') || 'gemini-3.1-pro-preview';
      setSelectedModel(savedModel);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    setTestStatus({ loading: true });
    try {
      const res = await fetch('/api/tuvi/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.trim() || undefined,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      setTestStatus({
        loading: false,
        success: data.success,
        message: data.message,
        latency: data.latencyMs,
        model: data.model,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestStatus({
        loading: false,
        success: false,
        message: 'Lỗi mạng khi kiểm tra API key: ' + msg,
      });
    }
  };

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (typeof window !== 'undefined') {
      if (trimmed) {
        localStorage.setItem('user_gemini_api_key', trimmed);
      } else {
        localStorage.removeItem('user_gemini_api_key');
      }
      localStorage.setItem('user_gemini_model', selectedModel);
    }
    onKeySaved(trimmed);
    onClose();
  };

  const handleResetDefault = () => {
    setApiKey('');
    setSelectedModel('gemini-3.1-pro-preview');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_gemini_api_key');
      localStorage.setItem('user_gemini_model', 'gemini-3.1-pro-preview');
    }
    onKeySaved('');
    setTestStatus({ loading: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-400 font-serif">
              Cài Đặt Gemini API Key
            </h3>
            <p className="text-xs text-slate-400">
              Cấu hình khóa kết nối trí tuệ nhân tạo Thầy Tôn
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 mb-4 space-y-2">
          <p>
            🔮 Mô hình AI mặc định: <b className="text-amber-400">Gemini 3.1 Pro Preview</b> thế hệ mới nhất — tư duy đa bước sâu sắc, am tường tinh diệu 14 chính tinh &amp; các cách cục Tử Vi cổ truyền.
          </p>
          <p className="text-slate-400">
            Nếu quý khách có Google Gemini API Key cá nhân, có thể dán vào bên dưới để dùng hạn mức riêng không giới hạn.
          </p>
        </div>

        {/* Model Selector */}
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
            Chọn Mô Hình AI Bình Giải:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
              className={`p-2.5 rounded-lg border text-left text-xs transition ${
                selectedModel === 'gemini-3.1-pro-preview'
                  ? 'bg-amber-500/15 border-amber-500/70 text-amber-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Gemini 3.1 Pro Preview</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">Ưu tiên</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Luận giải sâu sắc, uyên thâm bậc nhất, văn phong đắc ý.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedModel('gemini-2.5-flash')}
              className={`p-2.5 rounded-lg border text-left text-xs transition ${
                selectedModel === 'gemini-2.5-flash'
                  ? 'bg-amber-500/15 border-amber-500/70 text-amber-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Gemini 2.5 Flash</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Nhanh</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Tốc độ tức thì (~5-10s), cô đọng, nhẹ nhàng.
              </div>
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
            Gemini API Key của bạn (Tùy chọn):
          </label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Để trống sẽ dùng API Key mặc định của hệ thống..."
            className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition"
          />
        </div>

        {/* Test Result Box */}
        {testStatus.message && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs flex items-start gap-2.5 ${
              testStatus.success
                ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/50 border border-red-500/40 text-red-200'
            }`}
          >
            {testStatus.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{testStatus.message}</p>
              {testStatus.latency && (
                <p className="text-[11px] opacity-80 mt-0.5">
                  Thời gian phản hồi: {testStatus.latency}ms | Mô hình: {testStatus.model}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={testStatus.loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition disabled:opacity-50"
          >
            {testStatus.loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Kiểm tra kết nối</span>
          </button>

          <div className="flex items-center gap-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Dùng mặc định
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase transition shadow-lg shadow-amber-500/20"
            >
              Lưu &amp; Áp Dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
