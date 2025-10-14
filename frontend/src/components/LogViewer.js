import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, RefreshCw, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { exportLogs, resetSystem } from '../services/api';

const LogViewer = ({ logs, onRefresh }) => {
  const [expanded, setExpanded] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportLogs();
      
      // Create blob and download
      const blob = new Blob([data.csv_content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export logs:', error);
      alert('Failed to export logs. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all logs?')) {
      return;
    }
    
    setClearing(true);
    try {
      await resetSystem();
      onRefresh(); // Refresh to show empty logs
    } catch (error) {
      console.error('Failed to clear logs:', error);
      alert('Failed to clear logs. Please try again.');
    } finally {
      setClearing(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="text-primary-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Request Logs</h2>
          <span className="badge-pending text-xs">{logs.length} total</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Action Buttons */}
            {logs.length > 0 && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-sm"
                >
                  <Download size={16} />
                  <span>{exporting ? 'Exporting...' : 'Export as CSV'}</span>
                </button>
                <button
                  onClick={handleClearLogs}
                  disabled={clearing}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  <span>{clearing ? 'Clearing...' : 'Clear Logs'}</span>
                </button>
              </div>
            )}

            {/* Logs List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No requests logged yet</p>
                </div>
              ) : (
                logs.slice().reverse().map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-3 rounded-lg border ${
                      log.decision === 'GRANTED'
                        ? 'bg-success-50 border-success-200'
                        : 'bg-danger-50 border-danger-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-800 text-sm">
                            {log.club_name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            log.decision === 'GRANTED'
                              ? 'bg-success-200 text-success-800'
                              : 'bg-danger-200 text-danger-800'
                          }`}>
                            {log.decision}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      <strong>Requested:</strong> [{log.requested_resources.join(', ')}]
                    </div>
                    
                    {log.safe_sequence && log.safe_sequence.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <strong>Safe Sequence:</strong> {log.safe_sequence.join(' → ')}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LogViewer;
