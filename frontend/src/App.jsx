import React, { useState } from 'react';
import { Navbar, HeroInput, ErrorState, ProteinTargetsSection, Footer } from './components/shared/AppStubs';
import LoadingGrid from './components/shared/LoadingGrid';
import ResultsGrid from './components/shared/ResultsGrid';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [sdfData, setSdfData] = useState(null);

  const handleAnalyze = async (inputValue) => {
    if (!inputValue) return;

    setLoading(true);
    setData(null);
    setErrorType(null);
    setSdfData(null);

    try {
      // 1. Primary analysis call
      const analyzeResponse = await fetch('http://localhost:8000/api/v1/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputValue }),
      });

      if (!analyzeResponse.ok) {
        setErrorType(analyzeResponse.status);
        setLoading(false);
        return;
      }

      const result = await analyzeResponse.json();
      setData(result);

      // 2. Secondary structure call (SDF)
      if (result.canonical_smiles) {
        const structureResponse = await fetch('http://localhost:8000/api/v1/structure/3d', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ smiles: result.canonical_smiles }),
        });

        if (structureResponse.ok) {
          const structureData = await structureResponse.json();
          // API might return standard structure with .sdf key
          setSdfData(structureData.sdf || '');
        }
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setErrorType(500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] font-sans selection:bg-white selection:text-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-8">
        <HeroInput 
          onAnalyze={handleAnalyze} 
          isLoading={loading} 
        />

        {loading && (
          <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LoadingGrid />
          </div>
        )}

        {data && !loading && (
          <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <ResultsGrid data={data} />
          </div>
        )}

        {errorType && (
          <div className="mb-20 animate-in zoom-in-95 duration-300">
            <ErrorState type={errorType} />
          </div>
        )}

        <ProteinTargetsSection />
        
        <Footer />
      </main>
    </div>
  );
};

export default App;
