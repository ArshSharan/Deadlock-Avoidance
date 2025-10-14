import React from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp } from 'lucide-react';

const ResourceSetup = ({ totalResources, available, resourceNames, onUpdateTotal }) => {
  const handleResourceChange = (index, value) => {
    const newTotal = [...totalResources];
    newTotal[index] = Math.max(0, parseInt(value) || 0);
    onUpdateTotal(newTotal);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="card"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Package className="text-primary-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Resource Pool</h2>
      </div>
      
      <div className="space-y-4">
        {resourceNames.map((name, idx) => (
          <div key={idx} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {name}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="0"
                value={totalResources[idx]}
                onChange={(e) => handleResourceChange(idx, e.target.value)}
                className="input-field flex-1"
              />
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Available:</span>
                <span className={`font-bold ${available[idx] >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {available[idx]}
                </span>
              </div>
            </div>
            
            {/* Visual bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${totalResources[idx] > 0 ? (available[idx] / totalResources[idx]) * 100 : 0}%` 
                }}
                transition={{ duration: 0.5 }}
                className={`h-2 rounded-full ${
                  available[idx] > totalResources[idx] * 0.5 
                    ? 'bg-success-500' 
                    : available[idx] > 0 
                    ? 'bg-warning-500' 
                    : 'bg-danger-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-primary-50 rounded-lg border border-primary-200">
        <div className="flex items-center space-x-2 text-primary-700">
          <TrendingUp size={16} />
          <span className="text-sm font-medium">
            Total: {totalResources.reduce((a, b) => a + b, 0)} units | 
            Available: {available.reduce((a, b) => a + b, 0)} units
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceSetup;
