import React from 'react';
import MoleculeCard from './MoleculeCard';
import BindingAffinityCard from './BindingAffinityCard';
import AdmetCard from './AdmetCard';
import DrugabilityCard from './DrugabilityCard';
import ChemblCard from './ChemblCard';
import AiInsightsCard from './AiInsightsCard';

const ResultsGrid = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      {/* Row 1: Molecule Identity & Binding */}
      <div className="col-span-12 lg:col-span-7">
        <MoleculeCard moleculeData={data} />
      </div>
      <div className="col-span-12 lg:col-span-5">
        <BindingAffinityCard bindingAffinity={data.binding_affinity} />
      </div>

      {/* Row 2: ADMET, Drugability & ChemBL */}
      <div className="col-span-12 lg:col-span-5">
        <AdmetCard admet={data.admet} />
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <DrugabilityCard druggability={data.druggability} />
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-3">
        <ChemblCard chemblData={data.chembl_data} />
      </div>

      {/* Row 3: AI Synthesis Insights */}
      <div className="col-span-12">
        <AiInsightsCard 
          aiInterpretation={data.ai_interpretation} 
          processingTime={data.processing_time_ms} 
        />
      </div>
    </div>
  );
};

export default ResultsGrid;
