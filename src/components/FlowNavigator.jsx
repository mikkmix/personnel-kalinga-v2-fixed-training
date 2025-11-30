import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FlowNavigator({ courseId, activities, activeIndex, completedSet, isWaiting, isAssessmentPassed }) {
  const navigate = useNavigate();

  const goNext = () => {
    // strict: current must be completed
    if (!completedSet.has(activities[activeIndex].uid)) return;
    if (activeIndex < activities.length - 1) {
      const next = activities[activeIndex + 1];
      navigate(`/modules/${courseId}/activity/${next.slug}`);
    } else {
      // end of module flow -> assessment
      navigate(`/modules/${courseId}/assessment/quiz`);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      const prev = activities[activeIndex - 1];
      navigate(`/modules/${courseId}/activity/${prev.slug}`);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button onClick={goPrev} disabled={activeIndex === 0} className="btn btn-light">Back</button>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <small>Section {activeIndex + 1} of {activities.length}</small>
      </div>
      <button
        onClick={goNext}
        disabled={!completedSet.has(activities[activeIndex].uid) || isWaiting || !isAssessmentPassed}
        className="btn btn-light"
      >
        Next
      </button>
    </div>
  );
}
