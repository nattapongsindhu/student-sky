import { RiskLevel, SubmissionStatus } from '@/types';

export interface RiskEvaluation {
  riskLevel: RiskLevel;
  riskReason: string;
}

export function evaluateAssignmentRisk(
  dueAt: string | null,
  submissionStatus: SubmissionStatus,
  pointsPossible: number,
  score: number | null
): RiskEvaluation {
  // If already submitted or graded
  if (submissionStatus === 'submitted') {
    return { riskLevel: 'NORMAL', riskReason: 'Submitted and awaiting instructor review' };
  }
  if (submissionStatus === 'graded' && score !== null) {
    const percentage = pointsPossible > 0 ? (score / pointsPossible) * 100 : 100;
    if (percentage < 70) {
      return {
        riskLevel: 'AT_RISK',
        riskReason: `Graded below target threshold: ${percentage.toFixed(1)}% (${score}/${pointsPossible} pts)`,
      };
    }
    return { riskLevel: 'NORMAL', riskReason: `Completed: ${score}/${pointsPossible} pts` };
  }
  if (submissionStatus === 'excused') {
    return { riskLevel: 'NORMAL', riskReason: 'Excused assignment' };
  }

  // If no due date
  if (!dueAt) {
    return { riskLevel: 'NORMAL', riskReason: 'No scheduled due date' };
  }

  const now = new Date();
  const dueDate = new Date(dueAt);
  const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Overdue
  if (diffHours < 0) {
    return {
      riskLevel: 'CRITICAL',
      riskReason: `Overdue by ${Math.abs(Math.round(diffHours))} hours without recorded submission`,
    };
  }

  // Imminent deadline (< 24 hours)
  if (diffHours <= 24) {
    return {
      riskLevel: 'CRITICAL',
      riskReason: `Due in ${Math.round(diffHours)} hours! Unsubmitted flight/academic work`,
    };
  }

  // High priority window (24h - 72h)
  if (diffHours <= 72) {
    const isHighStakes = pointsPossible >= 50;
    return {
      riskLevel: isHighStakes ? 'CRITICAL' : 'AT_RISK',
      riskReason: `Due within 3 days (${Math.round(diffHours)} hrs remaining) [${pointsPossible} pts]`,
    };
  }

  // Upcoming in 7 days
  if (diffHours <= 168) {
    return {
      riskLevel: 'WATCH',
      riskReason: `Due this week (${Math.ceil(diffHours / 24)} days left)`,
    };
  }

  return {
    riskLevel: 'NORMAL',
    riskReason: 'Due later in the term',
  };
}
