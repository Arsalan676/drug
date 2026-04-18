import React from 'react';
import DrugabilityGauge from './DrugabilityGauge';
import ProbabilityBar from './ProbabilityBar';

const DrugabilityCard = ({ druggability }) => {
  const { druggability_score: score, grade, interpretation, breakdown } = druggability;

  const gradeColors = {
    A: { text: '#22c55e', bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.20)' },
    B: { text: '#eab308', bg: 'rgba(234,179,8,0.10)', border: 'rgba(234,179,8,0.20)' },
    C: { text: '#f97316', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.20)' },
    D: { text: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.20)' },
  };

  const currentGradeStyle = gradeColors[grade] || gradeColors.A;

  return (
    <div className="bg-[#111113] border border-[#27272a] rounded-xl p-6 w-full flex flex-col">
      <span className="text-[13px] font-medium text-neutral-400 uppercase tracking-[0.08em] mb-6">
        04 · DRUGGABILITY
      </span>

      <div className="flex flex-col items-center">
        <DrugabilityGauge score={score} grade={grade} />
        
        <div 
          className="mt-4 text-[13px] font-medium uppercase tracking-[0.06em] rounded-full px-[10px] py-[3px]"
          style={{
            color: currentGradeStyle.text,
            backgroundColor: currentGradeStyle.bg,
            border: `1px solid ${currentGradeStyle.border}`
          }}
        >
          Grade {grade}
        </div>

        <p className="text-[15px] font-normal text-neutral-300 italic text-center max-w-[240px] mx-auto mt-4 leading-relaxed">
          {interpretation}
        </p>
      </div>

      <div className="w-full h-px bg-[#1f1f22] my-4" />

      <div className="flex flex-col gap-4">
        <ProbabilityBar
          label="Binding Contribution"
          probability={breakdown.binding_contribution / 100}
          pass={true}
          badgeText={`${breakdown.binding_contribution}%`}
          barColor="#3b82f6"
        />
        <ProbabilityBar
          label="ADMET Contribution"
          probability={breakdown.admet_contribution / 100}
          pass={true}
          badgeText={`${breakdown.admet_contribution}%`}
          barColor="#3b82f6"
        />
        <ProbabilityBar
          label="Lipinski Contribution"
          probability={breakdown.lipinski_contribution / 100}
          pass={true}
          badgeText={`${breakdown.lipinski_contribution}%`}
          barColor="#3b82f6"
        />
      </div>
    </div>
  );
};

export default DrugabilityCard;
