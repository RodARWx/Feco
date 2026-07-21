export function calculateNextReviewDate(isCorrect: boolean, timesAnswered: number, timesCorrect: number): Date {
  const now = new Date();
  
  if (!isCorrect) {
    // If wrong, review again tomorrow
    now.setDate(now.getDate() + 1);
    return now;
  }
  
  // Calculate difficulty based on correct ratio
  const correctRatio = timesCorrect / Math.max(1, timesAnswered);
  
  let daysToAdd = 1;
  
  if (timesCorrect === 1) {
    daysToAdd = 1;
  } else if (timesCorrect === 2) {
    daysToAdd = 3;
  } else if (timesCorrect === 3) {
    daysToAdd = 7;
  } else {
    // If they get it right many times, the interval grows
    daysToAdd = Math.round(7 * (timesCorrect - 2) * (correctRatio + 0.5));
  }
  
  now.setDate(now.getDate() + daysToAdd);
  return now;
}
