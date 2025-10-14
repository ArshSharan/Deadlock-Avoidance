import React from 'react';
import { motion } from 'framer-motion';
import { Table } from 'lucide-react';

const MatrixDisplay = ({ clubs, available, resourceNames }) => {
  // Calculate need matrix
  const needMatrix = clubs.map(club => 
    club.maxNeed.map((max, idx) => max - club.allocation[idx])
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Table className="text-primary-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">System Matrices</h2>
      </div>

      {/* Allocation Matrix */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Allocation Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-primary-100">
                <th className="px-3 py-2 text-left font-semibold">Club</th>
                {resourceNames.map((name, idx) => (
                  <th key={idx} className="px-3 py-2 text-center font-semibold">
                    {name.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clubs.map((club, idx) => (
                <motion.tr
                  key={club.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-3 py-2 font-medium text-gray-700">{club.name}</td>
                  {club.allocation.map((val, valIdx) => (
                    <td key={valIdx} className="px-3 py-2 text-center">
                      <span className="font-semibold text-success-700">{val}</span>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Max Need Matrix */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Maximum Need Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-primary-100">
                <th className="px-3 py-2 text-left font-semibold">Club</th>
                {resourceNames.map((name, idx) => (
                  <th key={idx} className="px-3 py-2 text-center font-semibold">
                    {name.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clubs.map((club, idx) => (
                <motion.tr
                  key={club.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-3 py-2 font-medium text-gray-700">{club.name}</td>
                  {club.maxNeed.map((val, valIdx) => (
                    <td key={valIdx} className="px-3 py-2 text-center">
                      <span className="font-semibold text-primary-700">{val}</span>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Need Matrix */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Need Matrix (Max - Allocation)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-primary-100">
                <th className="px-3 py-2 text-left font-semibold">Club</th>
                {resourceNames.map((name, idx) => (
                  <th key={idx} className="px-3 py-2 text-center font-semibold">
                    {name.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clubs.map((club, idx) => (
                <motion.tr
                  key={club.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-3 py-2 font-medium text-gray-700">{club.name}</td>
                  {needMatrix[idx].map((val, valIdx) => (
                    <td key={valIdx} className="px-3 py-2 text-center">
                      <span className={`font-semibold ${
                        val === 0 ? 'text-success-700' : 'text-warning-700'
                      }`}>
                        {val}
                      </span>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Resources Summary */}
      <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Resources</h3>
        <div className="flex justify-around text-sm">
          {resourceNames.map((name, idx) => (
            <div key={idx} className="text-center">
              <div className="text-xs text-gray-600">{name.split(' ')[0]}</div>
              <div className={`text-lg font-bold ${
                available[idx] > 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {available[idx]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MatrixDisplay;
