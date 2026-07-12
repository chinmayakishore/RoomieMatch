const API_URL = 'https://api.anthropic.com/v1/messages';

export async function getCompatibilityScore(userProfile, candidateProfile) {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('EXPO_PUBLIC_ANTHROPIC_API_KEY is not set');

  const prompt = `You are a roommate compatibility analyzer. Compare these two people and return ONLY a JSON object, no other text.

Person A (the user):
- Lifestyle: ${userProfile.lifestyle || 'Not specified'}
- Smoking: ${userProfile.smoking || 'Not specified'}
- Pets: ${userProfile.pets || 'Not specified'}
- Budget: ${userProfile.budget || 'Not specified'}
- Bio: ${userProfile.bio || 'Not specified'}

Person B (potential roommate):
- Lifestyle: ${candidateProfile.lifestyle || 'Not specified'}
- Smoking: ${candidateProfile.smoking || 'Not specified'}
- Pets: ${candidateProfile.pets || 'Not specified'}
- Budget: ${candidateProfile.budget || 'Not specified'}
- Bio: ${candidateProfile.bio || 'Not specified'}

Return exactly this JSON with no markdown:
{"score": <integer 50-99>, "reason": "<one sentence explaining their compatibility>"}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Claude API error ${response.status}: ${err.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  const text = data.content[0].text.trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Unexpected Claude response format');

  const result = JSON.parse(jsonMatch[0]);
  result.score = Math.max(50, Math.min(99, Math.round(result.score)));
  return result;
}
