'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, X, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { SyncLog } from '@/types';

interface SyncConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastSync: SyncLog | null;
  onSyncComplete?: () => void;
}

export default function SyncConsoleModal({
  isOpen,
  onClose,
  lastSync,
  onSyncComplete,
}: SyncConsoleModalProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; stats?: any } | null>(null);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const response = await fetch('/api/sync/canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-dashboard-trigger': 'student-sky-dashboard',
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSyncResult({
          success: true,
          message: data.message || 'Sync completed successfully',
          stats: data.stats,
        });
        if (onSyncComplete) onSyncComplete();
      } else {
        setSyncResult({
          success: false,
          message: data.error || data.message || 'Sync failed',
        });
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err.message || 'Network error triggering sync',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-gray-900">GCC Canvas Sync Console</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Provider Endpoint:</span>
              <span className="font-mono font-medium text-gray-800">https://glendale.instructure.com</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Automated Cron Schedule:</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold">
                Daily at 06:00 AM PST (14:00 UTC)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Last Synced Status:</span>
              <span className="inline-flex items-center space-x-1">
                {lastSync?.status === 'SUCCESS' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">SUCCESS</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-700 font-medium">{lastSync?.status || 'NOT RUN YET'}</span>
                  </>
                )}
              </span>
            </div>
            {lastSync?.synced_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Last Synced Timestamp:</span>
                <span className="text-gray-700">
                  {new Date(lastSync.synced_at).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Sync Result Notice */}
          {syncResult && (
            <div
              className={`rounded-lg p-3 text-sm flex items-start space-x-2 ${
                syncResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {syncResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{syncResult.message}</p>
                {syncResult.stats && (
                  <p className="text-xs mt-1 text-emerald-700">
                    Courses: {syncResult.stats.courses} | Assignments: {syncResult.stats.assignments} | Announcements: {syncResult.stats.announcements}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Canvas API Key Instruction */}
          <div className="rounded-lg bg-sky-50 p-3 border border-sky-100 text-xs text-sky-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-sky-800">
              <ShieldCheck className="h-4 w-4" />
              <span>GCC Canvas API Token Configuration</span>
            </div>
            <p className="text-sky-700">
              To fetch live Canvas courses and grades, generate a token in <strong>GCC Canvas &gt; Account &gt; Settings &gt; Approved Integrations &gt; + New Access Token</strong>, then add <code className="bg-sky-100 px-1 py-0.5 rounded">CANVAS_API_TOKEN</code> in your environment variables.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="inline-flex items-center space-x-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 disabled:opacity-50 transition"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing GCC Canvas...' : 'Trigger Manual Sync Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
