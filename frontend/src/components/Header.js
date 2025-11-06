import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Shield } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <GraduationCap size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">College Fest Resource Allocation</h1>
              <p className="text-primary-100 text-sm mt-1">
                Deadlock Avoidance using Banker's Algorithm
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-primary-700 px-4 py-2 rounded-lg">
            <Shield size={20} />
            <span className="text-sm font-medium">Safe State Guaranteed</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
