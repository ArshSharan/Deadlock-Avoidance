import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const ResultDisplay = ({ result, loading }) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
          />
          <p className="mt-4 text-gray-600 font-medium">Analyzing request...</p>
        </div>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
      >
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <AlertTriangle size={48} />
          <p className="mt-4 text-center">
            No results yet. Make a request to see the analysis.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result.safe ? 'safe' : 'unsafe'}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`card ${
          result.safe 
            ? 'border-2 border-success-300 bg-success-50' 
            : 'border-2 border-danger-300 bg-danger-50'
        }`}
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          {result.safe ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="text-success-600" size={32} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <XCircle className="text-danger-600" size={32} />
            </motion.div>
          )}
          <div>
            <h2 className={`text-xl font-bold ${
              result.safe ? 'text-success-800' : 'text-danger-800'
            }`}>
              {result.safe ? 'Safe State ✓' : 'Unsafe State ✗'}
            </h2>
            <p className={`text-sm ${
              result.safe ? 'text-success-600' : 'text-danger-600'
            }`}>
              {result.safe ? 'Request can be granted' : 'Request denied'}
            </p>
          </div>
        </div>

        {/* Message */}
        <div className={`p-4 rounded-lg mb-4 ${
          result.safe ? 'bg-white border border-success-200' : 'bg-white border border-danger-200'
        }`}>
          <p className="text-gray-700 text-sm">{result.message}</p>
        </div>

        {/* Safe Sequence */}
        {result.safe && result.safe_sequence && result.safe_sequence.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Safe Execution Sequence:</h3>
            <div className="flex flex-wrap items-center gap-2">
              {result.safe_sequence.map((club, idx) => (
                <React.Fragment key={idx}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="px-3 py-2 bg-success-100 text-success-800 rounded-lg font-medium text-sm border border-success-300"
                  >
                    {club}
                  </motion.div>
                  {idx < result.safe_sequence.length - 1 && (
                    <ArrowRight className="text-success-600" size={16} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Need Matrix */}
        {result.need_matrix && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Updated Need Matrix:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-1 text-left">Club</th>
                    <th className="px-2 py-1 text-center">🎤</th>
                    <th className="px-2 py-1 text-center">🎥</th>
                    <th className="px-2 py-1 text-center">🎶</th>
                  </tr>
                </thead>
                <tbody>
                  {result.need_matrix.map((need, idx) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="px-2 py-1 font-medium">Club {idx}</td>
                      {need.map((val, valIdx) => (
                        <td key={valIdx} className="px-2 py-1 text-center">
                          <span className={`font-semibold ${
                            val === 0 ? 'text-success-600' : 'text-warning-600'
                          }`}>
                            {val}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Available Resources After Allocation */}
        {result.new_available && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Available After Allocation:</h3>
            <div className="flex space-x-4 text-sm">
              <span>🎤 Stage: <strong>{result.new_available[0]}</strong></span>
              <span>🎥 Projector: <strong>{result.new_available[1]}</strong></span>
              <span>🎶 Sound: <strong>{result.new_available[2]}</strong></span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultDisplay;
