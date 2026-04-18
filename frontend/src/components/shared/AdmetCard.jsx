import React from 'react';
import ProbabilityBar from './ProbabilityBar';

const ADMET_PROPERTIES = [
  { key: 'absorption',   label: 'Absorption' },
  { key: 'distribution', label: 'Distribution' },
  { key: 'metabolism',   label: 'Metabolism' },
  { key: 'excretion',    label: 'Excretion' },
  { key: 'toxicity',     label: 'Toxicity' },
];

const getGrade = (score) => {
  if (score >= 80) return { grade: 'A', color: '#22c55e', bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.20)' };
  if (score >= 60) return { grade: 'B', color: '#eab308', bg: 'rgba(234,179,8,0.10)', border: 'rgba(234,179,8,0.20)' };
  if (score >= 40) return { grade: 'C', color: '#f97316', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.20)' };
  return { grade: 'D', color: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.20)' };
};

const AdmetCard = ({ admet }) => {
  const score = admet.overall_admet_score || 0;
  const gradeInfo = getGrade(score);

  return (
    <div className="bg-[#111113] border border-[#27272a] rounded-xl p-6 w-full flex-1 flex flex-col">
      <span className="text-[13px] font-medium text-neutral-400 uppercase tracking-[0.08em]">
        03 · ADMET PROFILE
      </span>
      
      <div className="flex items-center justify-between mt-3">
        <span className="text-[15px] font-medium text-neutral-300">Overall Score</span>
        <div className="flex items-center gap-2">
          <span className="text-[20px] font-bold text-[#fafafa]">{score.toFixed(1)}</span>
          <span 
            className="text-[13px] font-medium uppercase tracking-[0.06em] rounded-full px-[10px] py-[3px]"
            style={{
              color: gradeInfo.color,
              background: gradeInfo.bg,
              border: `1px solid ${gradeInfo.border}`
            }}
          >
            Grade {gradeInfo.grade}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-[#1f1f22] my-4" />

      <div className="flex flex-col flex-1 justify-between">
        {ADMET_PROPERTIES.map((prop, index) => {
          const data = admet[prop.key];
          if (!data) return null;

          let badgeText;
          if (prop.key === 'toxicity') {
            badgeText = data.pass ? 'Non-toxic' : 'Toxic';
          } else {
            badgeText = data.pass ? 'Pass' : 'Fail';
          }

          return (
            <React.Fragment key={prop.key}>
              <div className="py-3">
                <ProbabilityBar
                  label={prop.label}
                  probability={data.probability}
                  pass={data.pass}
                  badgeText={badgeText}
                />
              </div>
              {index < ADMET_PROPERTIES.length - 1 && (
                <div className="w-full h-px bg-[#1f1f22]" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AdmetCard;
