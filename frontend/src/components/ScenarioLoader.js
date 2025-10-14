import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Loader } from 'lucide-react';
import { loadScenario } from '../services/api';

const ScenarioLoader = ({ onLoadScenario, onReset }) => {
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('basic');

  const scenarios = [
    { id: 'basic', name: '🎭 Basic (3 Clubs)', description: 'Simple safe state scenario' },
    { id: 'complex', name: '🎪 Complex (5 Clubs)', description: 'Advanced scenario with more resources' },
    { id: 'unsafe', name: '⚠️ Unsafe State', description: 'Demonstrates unsafe state detection' },
  ];

  const handleLoad = async () => {
    setLoading(true);
    try {
      const data = await loadScenario(selectedScenario);
      onLoadScenario(data);
    } catch (error) {
      console.error('Failed to load scenario:', error);
      alert('Failed to load scenario. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Quick Start</h3>
          <p className="text-sm text-gray-600 mb-3">
            Load a pre-configured scenario or reset to default
          </p>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="input-field text-sm"
            disabled={loading}
          >
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name} - {scenario.description}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoad}
            disabled={loading}
            className={`btn-primary flex items-center space-x-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={18} />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span>Load</span>
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScenarioLoader;
