import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ResourceSetup from './components/ResourceSetup';
import ClubManager from './components/ClubManager';
import ResourceRequest from './components/ResourceRequest';
import ResultDisplay from './components/ResultDisplay';
import MatrixDisplay from './components/MatrixDisplay';
import LogViewer from './components/LogViewer';
import ScenarioLoader from './components/ScenarioLoader';
import { runBankersAlgorithm, checkSafety, getLogs } from './services/api';

function App() {
  // System state
  const [numClubs, setNumClubs] = useState(3);
  const [numResources] = useState(3); // Fixed: Stage, Projector, Sound
  const [totalResources, setTotalResources] = useState([10, 5, 7]);
  const [available, setAvailable] = useState([10, 5, 7]);
  
  // Club data
  const [clubs, setClubs] = useState([
    { id: 0, name: 'Drama Club', maxNeed: [7, 5, 3], allocation: [0, 1, 0] },
    { id: 1, name: 'Music Club', maxNeed: [3, 2, 2], allocation: [2, 0, 0] },
    { id: 2, name: 'Dance Club', maxNeed: [9, 0, 2], allocation: [3, 0, 2] },
  ]);
  
  // Request state
  const [selectedClub, setSelectedClub] = useState(0);
  const [requestResources, setRequestResources] = useState([0, 0, 0]);
  
  // Result state
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Logs
  const [logs, setLogs] = useState([]);
  
  // Resource names
  const resourceNames = ['🎤 Stage', '🎥 Projector', '🎶 Sound System'];
  
  // Calculate available resources based on allocations
  useEffect(() => {
    const allocated = clubs.reduce((acc, club) => {
      return acc.map((val, idx) => val + club.allocation[idx]);
    }, [0, 0, 0]);
    
    const newAvailable = totalResources.map((total, idx) => total - allocated[idx]);
    setAvailable(newAvailable);
  }, [clubs, totalResources]);
  
  // Fetch logs periodically
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const fetchLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };
  
  const handleRunBankers = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Prepare data
      const allocation = clubs.map(club => club.allocation);
      const maxNeed = clubs.map(club => club.maxNeed);
      const clubNames = clubs.map(club => club.name);
      
      const requestData = {
        allocation,
        max_need: maxNeed,
        available,
        request: {
          club_id: selectedClub,
          resources: requestResources
        },
        club_names: clubNames
      };
      
      const response = await runBankersAlgorithm(requestData);
      
      setResult(response);
      
      // If request was granted, update allocations
      if (response.safe && response.new_allocation) {
        const updatedClubs = clubs.map((club, idx) => ({
          ...club,
          allocation: response.new_allocation[idx]
        }));
        setClubs(updatedClubs);
        setRequestResources([0, 0, 0]);
      }
      
      // Refresh logs
      fetchLogs();
      
    } catch (err) {
      setError(err.error || 'An error occurred while processing the request');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckSafety = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allocation = clubs.map(club => club.allocation);
      const maxNeed = clubs.map(club => club.maxNeed);
      const clubNames = clubs.map(club => club.name);
      
      const response = await checkSafety({
        allocation,
        max_need: maxNeed,
        available,
        club_names: clubNames
      });
      
      setResult(response);
    } catch (err) {
      setError(err.error || 'Failed to check safety');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadScenario = (scenarioData) => {
    setTotalResources(scenarioData.available);
    setAvailable(scenarioData.available);
    
    const loadedClubs = scenarioData.allocation.map((alloc, idx) => ({
      id: idx,
      name: scenarioData.club_names[idx],
      maxNeed: scenarioData.max_need[idx],
      allocation: alloc
    }));
    
    setClubs(loadedClubs);
    setNumClubs(loadedClubs.length);
    setResult(null);
    setError(null);
  };
  
  const handleReset = () => {
    setClubs([
      { id: 0, name: 'Drama Club', maxNeed: [7, 5, 3], allocation: [0, 1, 0] },
      { id: 1, name: 'Music Club', maxNeed: [3, 2, 2], allocation: [2, 0, 0] },
      { id: 2, name: 'Dance Club', maxNeed: [9, 0, 2], allocation: [3, 0, 2] },
    ]);
    setNumClubs(3);
    setTotalResources([10, 5, 7]);
    setAvailable([10, 5, 7]);
    setRequestResources([0, 0, 0]);
    setSelectedClub(0);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-danger-50 border-l-4 border-danger-500 p-4 rounded-lg"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-danger-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-danger-700 font-medium">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-danger-500 hover:text-danger-700"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Scenario Loader */}
        <ScenarioLoader onLoadScenario={handleLoadScenario} onReset={handleReset} />
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Setup */}
          <div className="lg:col-span-1 space-y-6">
            <ResourceSetup
              totalResources={totalResources}
              available={available}
              resourceNames={resourceNames}
              onUpdateTotal={setTotalResources}
            />
            
            <ClubManager
              clubs={clubs}
              resourceNames={resourceNames}
              onUpdateClubs={setClubs}
            />
          </div>
          
          {/* Middle Column - Request & Matrices */}
          <div className="lg:col-span-1 space-y-6">
            <ResourceRequest
              clubs={clubs}
              selectedClub={selectedClub}
              requestResources={requestResources}
              resourceNames={resourceNames}
              available={available}
              loading={loading}
              onSelectClub={setSelectedClub}
              onUpdateRequest={setRequestResources}
              onSubmit={handleRunBankers}
              onCheckSafety={handleCheckSafety}
            />
            
            <MatrixDisplay
              clubs={clubs}
              available={available}
              resourceNames={resourceNames}
            />
          </div>
          
          {/* Right Column - Results & Logs */}
          <div className="lg:col-span-1 space-y-6">
            <ResultDisplay result={result} loading={loading} />
            <LogViewer logs={logs} onRefresh={fetchLogs} />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            🎓 <strong>The Kernel Crew</strong> - Arsh Sharan & Keshav Gujrathi
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Operating Systems Project: Deadlock Avoidance using Banker's Algorithm
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
