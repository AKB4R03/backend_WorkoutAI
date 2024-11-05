export function calculateCurrentWeight(
  initialWeight: number,
  totalCaloriesBurned: number
): number {
  // 1 kg of fat is approximately equivalent to 7700 calories
  const caloriesPerKg = 7700;

  // Calculate weight loss in kg
  const weightLoss = totalCaloriesBurned / caloriesPerKg;

  // Calculate current weight
  const currentWeight = initialWeight - weightLoss;

  // Round to 2 decimal places
  return Math.round(currentWeight * 100) / 100;
}
