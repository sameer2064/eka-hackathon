export function calculateAIScore(provider: any) {

  let score = 0;

  score +=
    (provider.total_bookings || 0) * 5;

  score +=
    (provider.total_views || 0) * 2;

  score +=
    (provider.rating || 0) * 20;

  score +=
    (provider.trust_score || 0);

  if (provider.verified) {
    score += 100;
  }

  if (provider.premium) {
    score += 150;
  }

  if (provider.featured) {
    score += 200;
  }

  return Math.floor(score);
}