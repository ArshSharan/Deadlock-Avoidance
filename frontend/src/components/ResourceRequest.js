import React from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader } from 'lucide-react';

const ResourceRequest = ({
  clubs,
  selectedClub,
  requestResources,
  resourceNames,
  available,
  loading,
  onSelectClub,
  onUpdateRequest,
  onSubmit,
  onCheckSafety
}) => {
  const handleRequestChange = (index, value) => {
    const newRequest = [...requestResources];
    newRequest[index] = Math.max(0, parseInt(value) || 0);
    onUpdateRequest(newRequest);
  };

  const isRequestValid = () => {
    return requestResources.some(r => r > 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Send className="text-primary-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Resource Request</h2>
      </div>

      {/* Club Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Club
        </label>
        <select
          value={selectedClub}
          onChange={(e) => onSelectClub(parseInt(e.target.value))}
          className="input-field"
          disabled={loading}
        >
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>
      </div>

      {/* Request Inputs */}
      <div className="space-y-3 mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Request Resources
        </label>
        {resourceNames.map((name, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{name}</span>
              <span className="text-xs text-gray-500">
                Available: <span className="font-semibold">{available[idx]}</span>
              </span>
            </div>
            <input
              type="number"
              min="0"
              max={available[idx]}
              value={requestResources[idx]}
              onChange={(e) => handleRequestChange(idx, e.target.value)}
              className="input-field"
              disabled={loading}
              placeholder="0"
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          disabled={loading || !isRequestValid()}
          className={`w-full btn-primary flex items-center justify-center space-x-2 ${
            loading || !isRequestValid() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Check Safety & Allocate</span>
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCheckSafety}
          disabled={loading}
          className={`w-full btn-secondary flex items-center justify-center space-x-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <CheckCircle size={20} />
          <span>Check Current State</span>
        </motion.button>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> The system will only allocate resources if it maintains a safe state,
          preventing potential deadlocks.
        </p>
      </div>
    </motion.div>
  );
};

export default ResourceRequest;
