import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Edit2, Check, X } from 'lucide-react';

const ClubManager = ({ clubs, resourceNames, onUpdateClubs }) => {
  const [editingClub, setEditingClub] = useState(null);
  const [editData, setEditData] = useState(null);

  const startEdit = (club) => {
    setEditingClub(club.id);
    setEditData({ ...club });
  };

  const cancelEdit = () => {
    setEditingClub(null);
    setEditData(null);
  };

  const saveEdit = () => {
    const updatedClubs = clubs.map(club => 
      club.id === editingClub ? editData : club
    );
    onUpdateClubs(updatedClubs);
    setEditingClub(null);
    setEditData(null);
  };

  const updateEditField = (field, index, value) => {
    const newData = { ...editData };
    if (index !== undefined) {
      newData[field][index] = Math.max(0, parseInt(value) || 0);
    } else {
      newData[field] = value;
    }
    setEditData(newData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="card"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Users className="text-primary-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Clubs</h2>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {clubs.map((club, clubIdx) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: clubIdx * 0.1 }}
              className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200"
            >
              {editingClub === club.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => updateEditField('name', undefined, e.target.value)}
                    className="input-field text-lg font-semibold"
                    placeholder="Club Name"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">
                        Max Need
                      </label>
                      {resourceNames.map((_, idx) => (
                        <input
                          key={`max-${idx}`}
                          type="number"
                          min="0"
                          value={editData.maxNeed[idx]}
                          onChange={(e) => updateEditField('maxNeed', idx, e.target.value)}
                          className="input-field mb-2 text-sm"
                        />
                      ))}
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">
                        Allocation
                      </label>
                      {resourceNames.map((_, idx) => (
                        <input
                          key={`alloc-${idx}`}
                          type="number"
                          min="0"
                          value={editData.allocation[idx]}
                          onChange={(e) => updateEditField('allocation', idx, e.target.value)}
                          className="input-field mb-2 text-sm"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button onClick={saveEdit} className="btn-success flex-1 flex items-center justify-center space-x-1">
                      <Check size={16} />
                      <span>Save</span>
                    </button>
                    <button onClick={cancelEdit} className="btn-secondary flex-1 flex items-center justify-center space-x-1">
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{club.name}</h3>
                    <button
                      onClick={() => startEdit(club)}
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {resourceNames.map((name, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">{name.split(' ')[0]}</div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-gray-600">
                            Max: <span className="font-semibold text-primary-700">{club.maxNeed[idx]}</span>
                          </span>
                          <span className="text-xs text-gray-600">
                            Alloc: <span className="font-semibold text-success-700">{club.allocation[idx]}</span>
                          </span>
                          <span className="text-xs text-gray-600">
                            Need: <span className="font-semibold text-warning-700">
                              {club.maxNeed[idx] - club.allocation[idx]}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ClubManager;
