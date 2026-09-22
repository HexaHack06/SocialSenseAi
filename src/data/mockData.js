// ============================================================
// SocialSense AI — Mock / Demo Data (Platform & Date-Range Aware)
// ============================================================

export function normalizeDateRange(dateRange) {
  if (!dateRange) return 'range1';
  if (dateRange.includes('May 12') || dateRange.includes('May 18')) return 'range1';
  if (dateRange.includes('May 5') || dateRange.includes('May 11')) return 'range2';
  if (dateRange.includes('Apr 28') || dateRange.includes('May 4')) return 'range3';
  if (dateRange.includes('30 Days') || dateRange.includes('30')) return 'range30';
  return 'range1';
}

// ── Multi-Range KPI Data ─────────────────────────────────────
export const multiRangeKpis = {
  range1: { // May 12 – May 18, 2026: 16.8K (Twitter) + 14.2K (Instagram) + 8.6K (Telegram) = 39.6K Total
    all: { mentions: 39600, positive: 61, negative: 23, neutral: 16, mentionsDelta: 14.2, posDelta: 8.8, negDelta: -5.6, neuDelta: -3.2 },
    twitter: { mentions: 16800, positive: 55, negative: 29, neutral: 16, mentionsDelta: 9.2, posDelta: 6.1, negDelta: -3.8, neuDelta: -2.3 },
    instagram: { mentions: 14200, positive: 68, negative: 18, neutral: 14, mentionsDelta: 16.4, posDelta: 10.2, negDelta: -6.5, neuDelta: -3.7 },
    telegram: { mentions: 8600, positive: 63, negative: 21, neutral: 16, mentionsDelta: 18.7, posDelta: 12.4, negDelta: -8.2, neuDelta: -4.2 },
  },
  range2: { // May 5 – May 11, 2026: 14.2K (Twitter) + 12.1K (Instagram) + 7.6K (Telegram) = 33.9K Total
    all: { mentions: 33900, positive: 55, negative: 29, neutral: 16, mentionsDelta: 6.4, posDelta: -1.8, negDelta: 2.8, neuDelta: -1.0 },
    twitter: { mentions: 14200, positive: 48, negative: 36, neutral: 16, mentionsDelta: 3.1, posDelta: -4.5, negDelta: 5.2, neuDelta: -0.7 },
    instagram: { mentions: 12100, positive: 62, negative: 23, neutral: 15, mentionsDelta: 7.9, posDelta: 4.1, negDelta: -1.8, neuDelta: -2.3 },
    telegram: { mentions: 7600, positive: 57, negative: 27, neutral: 16, mentionsDelta: 8.2, posDelta: -0.8, negDelta: 2.1, neuDelta: -1.3 },
  },
  range3: { // Apr 28 – May 4, 2026: 12.5K (Twitter) + 9.8K (Instagram) + 6.4K (Telegram) = 28.7K Total
    all: { mentions: 28700, positive: 49, negative: 35, neutral: 16, mentionsDelta: -3.8, posDelta: -5.4, negDelta: 6.8, neuDelta: -1.4 },
    twitter: { mentions: 12500, positive: 42, negative: 41, neutral: 17, mentionsDelta: -6.8, posDelta: -8.5, negDelta: 9.4, neuDelta: -0.9 },
    instagram: { mentions: 9800, positive: 56, negative: 28, neutral: 16, mentionsDelta: 2.3, posDelta: -1.2, negDelta: 3.4, neuDelta: -2.2 },
    telegram: { mentions: 6400, positive: 51, negative: 32, neutral: 17, mentionsDelta: -2.7, posDelta: -4.3, negDelta: 7.0, neuDelta: -2.7 },
  },
  range30: { // Last 30 Days: 68.9K (Twitter) + 58.4K (Instagram) + 35.3K (Telegram) = 162.6K Total
    all: { mentions: 162600, positive: 58, negative: 26, neutral: 16, mentionsDelta: 26.8, posDelta: 12.4, negDelta: -6.9, neuDelta: -5.5 },
    twitter: { mentions: 68900, positive: 51, negative: 32, neutral: 17, mentionsDelta: 21.8, posDelta: 9.4, negDelta: -5.2, neuDelta: -4.2 },
    instagram: { mentions: 58400, positive: 64, negative: 21, neutral: 15, mentionsDelta: 28.5, posDelta: 13.6, negDelta: -7.4, neuDelta: -6.2 },
    telegram: { mentions: 35300, positive: 60, negative: 23, neutral: 17, mentionsDelta: 30.2, posDelta: 14.8, negDelta: -8.8, neuDelta: -6.0 },
  },
};

// Fallback legacy kpiData
export const kpiData = multiRangeKpis.range1;

export function getKpiData(platform = 'all', dateRange = 'May 12, 2026 – May 18, 2026') {
  const rangeKey = normalizeDateRange(dateRange);
  const rangeObj = multiRangeKpis[rangeKey] || multiRangeKpis.range1;
  return rangeObj[platform] || rangeObj.all;
}

// ── Multi-Range Sentiment Timeline ───────────────────────────
export const multiRangeTimelines = {
  range1: {
    all: [
      { date: 'May 12', positive: 54, neutral: 18, negative: 28 },
      { date: 'May 13', positive: 56, neutral: 17, negative: 27 },
      { date: 'May 14', positive: 52, neutral: 20, negative: 28 },
      { date: 'May 15', positive: 60, neutral: 16, negative: 24 },
      { date: 'May 16', positive: 61, neutral: 15, negative: 24 },
      { date: 'May 17', positive: 59, neutral: 16, negative: 25 },
      { date: 'May 18', positive: 58, neutral: 16, negative: 26 },
    ],
    twitter: [
      { date: 'May 12', positive: 50, neutral: 19, negative: 31 },
      { date: 'May 13', positive: 52, neutral: 18, negative: 30 },
      { date: 'May 14', positive: 49, neutral: 21, negative: 30 },
      { date: 'May 15', positive: 57, neutral: 17, negative: 26 },
      { date: 'May 16', positive: 58, neutral: 16, negative: 26 },
      { date: 'May 17', positive: 56, neutral: 17, negative: 27 },
      { date: 'May 18', positive: 55, neutral: 16, negative: 29 },
    ],
    instagram: [
      { date: 'May 12', positive: 64, neutral: 15, negative: 21 },
      { date: 'May 13', positive: 66, neutral: 14, negative: 20 },
      { date: 'May 14', positive: 63, neutral: 16, negative: 21 },
      { date: 'May 15', positive: 70, neutral: 13, negative: 17 },
      { date: 'May 16', positive: 72, neutral: 12, negative: 16 },
      { date: 'May 17', positive: 69, neutral: 14, negative: 17 },
      { date: 'May 18', positive: 68, neutral: 14, negative: 18 },
    ],
    telegram: [
      { date: 'May 12', positive: 60, neutral: 16, negative: 24 },
      { date: 'May 13', positive: 62, neutral: 15, negative: 23 },
      { date: 'May 14', positive: 58, neutral: 18, negative: 24 },
      { date: 'May 15', positive: 65, neutral: 14, negative: 21 },
      { date: 'May 16', positive: 67, neutral: 13, negative: 20 },
      { date: 'May 17', positive: 64, neutral: 14, negative: 22 },
      { date: 'May 18', positive: 63, neutral: 16, negative: 21 },
    ],
  },
  range2: {
    all: [
      { date: 'May 05', positive: 48, neutral: 16, negative: 36 },
      { date: 'May 06', positive: 49, neutral: 15, negative: 36 },
      { date: 'May 07', positive: 46, neutral: 17, negative: 37 },
      { date: 'May 08', positive: 53, neutral: 16, negative: 31 },
      { date: 'May 09', positive: 55, neutral: 17, negative: 28 },
      { date: 'May 10', positive: 52, neutral: 16, negative: 32 },
      { date: 'May 11', positive: 51, neutral: 16, negative: 33 },
    ],
    twitter: [
      { date: 'May 05', positive: 45, neutral: 16, negative: 39 },
      { date: 'May 06', positive: 46, neutral: 15, negative: 39 },
      { date: 'May 07', positive: 43, neutral: 17, negative: 40 },
      { date: 'May 08', positive: 50, neutral: 17, negative: 33 },
      { date: 'May 09', positive: 52, neutral: 16, negative: 32 },
      { date: 'May 10', positive: 49, neutral: 16, negative: 35 },
      { date: 'May 11', positive: 48, neutral: 16, negative: 36 },
    ],
    instagram: [
      { date: 'May 05', positive: 59, neutral: 16, negative: 25 },
      { date: 'May 06', positive: 61, neutral: 15, negative: 24 },
      { date: 'May 07', positive: 58, neutral: 17, negative: 25 },
      { date: 'May 08', positive: 64, neutral: 15, negative: 21 },
      { date: 'May 09', positive: 66, neutral: 16, negative: 18 },
      { date: 'May 10', positive: 63, neutral: 15, negative: 22 },
      { date: 'May 11', positive: 62, neutral: 15, negative: 23 },
    ],
    telegram: [
      { date: 'May 05', positive: 54, neutral: 16, negative: 30 },
      { date: 'May 06', positive: 55, neutral: 15, negative: 30 },
      { date: 'May 07', positive: 52, neutral: 17, negative: 31 },
      { date: 'May 08', positive: 59, neutral: 15, negative: 26 },
      { date: 'May 09', positive: 61, neutral: 18, negative: 21 },
      { date: 'May 10', positive: 58, neutral: 16, negative: 26 },
      { date: 'May 11', positive: 57, neutral: 16, negative: 27 },
    ],
  },
  range3: {
    all: [
      { date: 'Apr 28', positive: 42, neutral: 18, negative: 40 },
      { date: 'Apr 29', positive: 43, neutral: 17, negative: 40 },
      { date: 'Apr 30', positive: 40, neutral: 18, negative: 42 },
      { date: 'May 01', positive: 46, neutral: 17, negative: 37 },
      { date: 'May 02', positive: 48, neutral: 16, negative: 36 },
      { date: 'May 03', positive: 47, neutral: 16, negative: 37 },
      { date: 'May 04', positive: 45, neutral: 17, negative: 38 },
    ],
    twitter: [
      { date: 'Apr 28', positive: 39, neutral: 18, negative: 43 },
      { date: 'Apr 29', positive: 40, neutral: 17, negative: 43 },
      { date: 'Apr 30', positive: 37, neutral: 18, negative: 45 },
      { date: 'May 01', positive: 43, neutral: 17, negative: 40 },
      { date: 'May 02', positive: 45, neutral: 16, negative: 39 },
      { date: 'May 03', positive: 44, neutral: 16, negative: 40 },
      { date: 'May 04', positive: 42, neutral: 17, negative: 41 },
    ],
    instagram: [
      { date: 'Apr 28', positive: 53, neutral: 17, negative: 30 },
      { date: 'Apr 29', positive: 54, neutral: 16, negative: 30 },
      { date: 'Apr 30', positive: 51, neutral: 18, negative: 31 },
      { date: 'May 01', positive: 57, neutral: 16, negative: 27 },
      { date: 'May 02', positive: 59, neutral: 15, negative: 26 },
      { date: 'May 03', positive: 58, neutral: 15, negative: 27 },
      { date: 'May 04', positive: 56, neutral: 16, negative: 28 },
    ],
    telegram: [
      { date: 'Apr 28', positive: 48, neutral: 18, negative: 34 },
      { date: 'Apr 29', positive: 49, neutral: 17, negative: 34 },
      { date: 'Apr 30', positive: 46, neutral: 18, negative: 36 },
      { date: 'May 01', positive: 52, neutral: 17, negative: 31 },
      { date: 'May 02', positive: 54, neutral: 16, negative: 30 },
      { date: 'May 03', positive: 53, neutral: 16, negative: 31 },
      { date: 'May 04', positive: 51, neutral: 17, negative: 32 },
    ],
  },
  range30: {
    all: [
      { date: 'Apr 20', positive: 46, neutral: 18, negative: 36 },
      { date: 'Apr 25', positive: 49, neutral: 17, negative: 34 },
      { date: 'Apr 30', positive: 45, neutral: 18, negative: 37 },
      { date: 'May 05', positive: 52, neutral: 16, negative: 32 },
      { date: 'May 10', positive: 55, neutral: 17, negative: 28 },
      { date: 'May 15', positive: 60, neutral: 16, negative: 24 },
      { date: 'May 18', positive: 58, neutral: 16, negative: 26 },
    ],
    twitter: [
      { date: 'Apr 20', positive: 43, neutral: 18, negative: 39 },
      { date: 'Apr 25', positive: 46, neutral: 17, negative: 37 },
      { date: 'Apr 30', positive: 42, neutral: 18, negative: 40 },
      { date: 'May 05', positive: 49, neutral: 16, negative: 35 },
      { date: 'May 10', positive: 52, neutral: 17, negative: 31 },
      { date: 'May 15', positive: 57, neutral: 16, negative: 27 },
      { date: 'May 18', positive: 55, neutral: 16, negative: 29 },
    ],
    instagram: [
      { date: 'Apr 20', positive: 55, neutral: 17, negative: 28 },
      { date: 'Apr 25', positive: 58, neutral: 16, negative: 26 },
      { date: 'Apr 30', positive: 54, neutral: 17, negative: 29 },
      { date: 'May 05', positive: 62, neutral: 15, negative: 23 },
      { date: 'May 10', positive: 65, neutral: 16, negative: 19 },
      { date: 'May 15', positive: 71, neutral: 14, negative: 15 },
      { date: 'May 18', positive: 68, neutral: 14, negative: 18 },
    ],
    telegram: [
      { date: 'Apr 20', positive: 52, neutral: 18, negative: 30 },
      { date: 'Apr 25', positive: 55, neutral: 17, negative: 28 },
      { date: 'Apr 30', positive: 51, neutral: 18, negative: 31 },
      { date: 'May 05', positive: 58, neutral: 16, negative: 26 },
      { date: 'May 10', positive: 61, neutral: 17, negative: 22 },
      { date: 'May 15', positive: 66, neutral: 16, negative: 18 },
      { date: 'May 18', positive: 63, neutral: 16, negative: 21 },
    ],
  },
};

// Fallback legacy sentimentTimeline
export const sentimentTimeline = multiRangeTimelines.range1;

export function getSentimentTimeline(platform = 'all', dateRange = 'May 12, 2026 – May 18, 2026') {
  const rangeKey = normalizeDateRange(dateRange);
  const rangeObj = multiRangeTimelines[rangeKey] || multiRangeTimelines.range1;
  return rangeObj[platform] || rangeObj.all;
}

// ── Trending Topics ──────────────────────────────────────────
export const multiRangeTrending = {
  range1: [
    {
      id: 1, tag: '#Politics', mentions: 12400, growth: '+42%', status: 'Rising',
      sentiment: 'Mixed', relatedKeywords: ['voting', 'democracy', 'candidates', 'polls', 'results'],
      recentPosts: [
        { text: 'Democracy speaks today! Excited to see #Politics results unfold.', sentiment: 'Positive', platform: 'Twitter', time: '2 min ago' },
        { text: 'Behind-the-scenes Reel of the election booth coverage went viral!', sentiment: 'Positive', platform: 'Instagram', time: '4 min ago' },
        { text: 'Concerned about the voting irregularities in #Politics.', sentiment: 'Negative', platform: 'Twitter', time: '5 min ago' },
        { text: 'Historic turnout expected in #Politics across all districts.', sentiment: 'Neutral', platform: 'Telegram', time: '8 min ago' },
      ]
    },
    {
      id: 2, tag: '#Business', mentions: 8700, growth: '+28%', status: 'Rising',
      sentiment: 'Positive', relatedKeywords: ['tech', 'innovation', 'internet', 'government', 'startup'],
      recentPosts: [
        { text: '#Business initiative is transforming rural connectivity.', sentiment: 'Positive', platform: 'Twitter', time: '3 min ago' },
        { text: 'Infographic carousel on digital payments adoption reaching record saves.', sentiment: 'Positive', platform: 'Instagram', time: '6 min ago' },
        { text: 'Great progress under #Business but more work needed.', sentiment: 'Neutral', platform: 'Telegram', time: '7 min ago' },
        { text: 'New digital literacy programs launched under #Business.', sentiment: 'Positive', platform: 'Twitter', time: '12 min ago' },
      ]
    },
    {
      id: 3, tag: '#Technology', mentions: 6200, growth: '+35%', status: 'Rising',
      sentiment: 'Positive', relatedKeywords: ['machine learning', 'GPT', 'automation', 'future', 'jobs'],
      recentPosts: [
        { text: 'The #Technology is changing every industry imaginable.', sentiment: 'Positive', platform: 'Twitter', time: '1 min ago' },
        { text: 'Creators showcasing mind-blowing AI video generation workflows.', sentiment: 'Positive', platform: 'Instagram', time: '3 min ago' },
        { text: 'Is #Technology creating or destroying jobs? Big debate!', sentiment: 'Negative', platform: 'Telegram', time: '6 min ago' },
        { text: '#Technology: India poised to lead the next wave.', sentiment: 'Positive', platform: 'Twitter', time: '10 min ago' },
      ]
    },
    {
      id: 4, tag: '#StartupIndia', mentions: 4300, growth: '+18%', status: 'Stable',
      sentiment: 'Positive', relatedKeywords: ['entrepreneurship', 'funding', 'unicorn', 'innovation', 'VC'],
      recentPosts: [
        { text: '#StartupIndia sees record funding in Q2 2026!', sentiment: 'Positive', platform: 'Twitter', time: '4 min ago' },
        { text: 'Founder spotlight Reel trending on Explore page.', sentiment: 'Positive', platform: 'Instagram', time: '7 min ago' },
        { text: 'New incubation centers launched under #StartupIndia.', sentiment: 'Positive', platform: 'Telegram', time: '9 min ago' },
      ]
    },
    {
      id: 5, tag: '#ClimateAction', mentions: 3100, growth: '-4%', status: 'Declining',
      sentiment: 'Mixed', relatedKeywords: ['environment', 'carbon', 'green energy', 'pollution', 'policy'],
      recentPosts: [
        { text: 'Urgent action needed on #ClimateAction before COP30.', sentiment: 'Negative', platform: 'Telegram', time: '11 min ago' },
        { text: 'Earth Day visual campaign driving eco-conscious conversations.', sentiment: 'Positive', platform: 'Instagram', time: '14 min ago' },
        { text: 'India pledges renewable energy expansion for #ClimateAction.', sentiment: 'Positive', platform: 'Twitter', time: '18 min ago' },
      ]
    },
  ],
  range2: [
    {
      id: 1, tag: '#PolicyReform', mentions: 10900, growth: '+38%', status: 'Rising',
      sentiment: 'Positive', relatedKeywords: ['governance', 'parliament', 'bills', 'reform', 'laws'],
      recentPosts: [
        { text: 'Landmark #PolicyReform bill passed today with bipartisan support.', sentiment: 'Positive', platform: 'Twitter', time: '10 min ago' },
        { text: 'Policy explainer carousels trending among youth demographics.', sentiment: 'Positive', platform: 'Instagram', time: '18 min ago' },
        { text: 'Public consultation opened on latest #PolicyReform draft.', sentiment: 'Neutral', platform: 'Telegram', time: '25 min ago' },
      ]
    },
    {
      id: 2, tag: '#Politics', mentions: 9800, growth: '+19%', status: 'Rising',
      sentiment: 'Mixed', relatedKeywords: ['manifestos', 'rallies', 'campaigns', 'debates'],
      recentPosts: [
        { text: 'Voter registration camps seeing massive queues ahead of #Politics.', sentiment: 'Positive', platform: 'Twitter', time: '15 min ago' },
        { text: 'First-time voters sharing their registration badges on Stories.', sentiment: 'Positive', platform: 'Instagram', time: '20 min ago' },
      ]
    },
    {
      id: 3, tag: '#TechSummit', mentions: 7600, growth: '+44%', status: 'Rising',
      sentiment: 'Positive', relatedKeywords: ['keynote', 'founders', 'startups', 'AI', 'investors'],
      recentPosts: [
        { text: 'Incredible keynote presentations at the annual #TechSummit.', sentiment: 'Positive', platform: 'Twitter', time: '1 hour ago' },
        { text: 'Product demo Reels from the startup pavilion hitting 100K+ views.', sentiment: 'Positive', platform: 'Instagram', time: '1 hour ago' },
      ]
    },
    {
      id: 4, tag: '#Business', mentions: 6400, growth: '+12%', status: 'Stable',
      sentiment: 'Positive', relatedKeywords: ['broadband', 'fintech', 'UPI', 'citizens'],
      recentPosts: [
        { text: 'UPI transaction volume hits new monthly peak #Business.', sentiment: 'Positive', platform: 'Telegram', time: '2 hours ago' },
      ]
    },
    {
      id: 5, tag: '#GreenEnergy', mentions: 4200, growth: '+22%', status: 'Rising',
      sentiment: 'Positive', relatedKeywords: ['solar', 'wind', 'EV', 'sustainability', 'netzero'],
      recentPosts: [
        { text: 'Major solar grid expansion commissioned this week #GreenEnergy.', sentiment: 'Positive', platform: 'Twitter', time: '3 hours ago' },
      ]
    },
  ],
  range3: [
    {
      id: 1, tag: '#Q1Earnings', mentions: 11500, growth: '+52%', status: 'Rising',
      sentiment: 'Mixed', relatedKeywords: ['revenue', 'growth', 'stocks', 'guidance', 'profit'],
      recentPosts: [
        { text: 'Tech sector beats consensus estimates in #Q1Earnings results.', sentiment: 'Positive', platform: 'Twitter', time: '40 min ago' },
      ]
    },
    {
      id: 2, tag: '#TechSummit', mentions: 9100, growth: '+29%', status: 'Rising',
      sentiment: 'Positive', relatedKeywords: ['expo', 'networking', 'demos', 'product'],
      recentPosts: [
        { text: 'Over 500 startups showcasing breakthroughs at #TechSummit.', sentiment: 'Positive', platform: 'Telegram', time: '1 hour ago' },
      ]
    },
    {
      id: 3, tag: '#Technology', mentions: 5800, growth: '+15%', status: 'Stable',
      sentiment: 'Positive', relatedKeywords: ['models', 'compute', 'open-source', 'agents'],
      recentPosts: [
        { text: 'Autonomous agents represent the next milestone in #Technology.', sentiment: 'Positive', platform: 'Twitter', time: '2 hours ago' },
      ]
    },
    {
      id: 4, tag: '#Politics', mentions: 5100, growth: '+8%', status: 'Stable',
      sentiment: 'Neutral', relatedKeywords: ['schedules', 'dates', 'phases', 'security'],
      recentPosts: [
        { text: 'Official phase schedule announced for #Politics.', sentiment: 'Neutral', platform: 'Twitter', time: '3 hours ago' },
      ]
    },
    {
      id: 5, tag: '#EducationPolicy', mentions: 3900, growth: '-2%', status: 'Declining',
      sentiment: 'Neutral', relatedKeywords: ['curriculum', 'universities', 'research', 'grants'],
      recentPosts: [
        { text: 'National review of vocational integration in #EducationPolicy.', sentiment: 'Neutral', platform: 'Telegram', time: '4 hours ago' },
      ]
    },
  ],
  range30: [
    {
      id: 1, tag: '#Politics', mentions: 48600, growth: '+64%', status: 'Rising',
      sentiment: 'Mixed', relatedKeywords: ['voting', 'candidates', 'debates', 'democracy', 'polls'],
      recentPosts: [
        { text: 'Record citizen participation seen throughout the month #Politics.', sentiment: 'Positive', platform: 'Twitter', time: '5 min ago' },
      ]
    },
    {
      id: 2, tag: '#Business', mentions: 34200, growth: '+31%', status: 'Rising',
      sentiment: 'Positive', relatedKeywords: ['infrastructure', 'e-governance', 'UPI', 'startups'],
      recentPosts: [
        { text: '30-day overview shows tremendous growth in rural connectivity #Business.', sentiment: 'Positive', platform: 'Twitter', time: '15 min ago' },
      ]
    },
    {
      id: 3, tag: '#Technology', mentions: 25800, growth: '+49%', status: 'Rising',
      sentiment: 'Positive', relatedKeywords: ['LLMs', 'automation', 'productivity', 'research'],
      recentPosts: [
        { text: 'AI adoption index up 35% across Indian enterprises this month #Technology.', sentiment: 'Positive', platform: 'Twitter', time: '30 min ago' },
      ]
    },
    {
      id: 4, tag: '#PolicyReform', mentions: 21500, growth: '+24%', status: 'Stable',
      sentiment: 'Positive', relatedKeywords: ['governance', 'bills', 'frameworks', 'development'],
      recentPosts: [
        { text: 'Key economic reforms gaining strong institutional backing #PolicyReform.', sentiment: 'Positive', platform: 'Telegram', time: '1 hour ago' },
      ]
    },
    {
      id: 5, tag: '#TechSummit', mentions: 18900, growth: '+17%', status: 'Stable',
      sentiment: 'Positive', relatedKeywords: ['events', 'founders', 'venture', 'innovation'],
      recentPosts: [
        { text: 'Annual tech conference wraps up with historic deal flows #TechSummit.', sentiment: 'Positive', platform: 'Twitter', time: '2 hours ago' },
      ]
    },
  ],
};

// Fallback legacy trendingTopics
export const trendingTopics = multiRangeTrending.range1;

export function getTrendingTopics(platform = 'all', dateRange = 'May 12, 2026 – May 18, 2026') {
  const rangeKey = normalizeDateRange(dateRange);
  return multiRangeTrending[rangeKey] || multiRangeTrending.range1;
}

// ── Trends Page Data ─────────────────────────────────────────
export const trendsTableData = [
  { topic: 'Artificial Intelligence', mentions: 8420, growth: '+42%', status: 'Rising', platform: 'Twitter' },
  { topic: 'Creator Economy', mentions: 7850, growth: '+36%', status: 'Rising', platform: 'Instagram' },
  { topic: 'Cybersecurity', mentions: 6120, growth: '+31%', status: 'Rising', platform: 'All Platforms' },
  { topic: 'Digital India', mentions: 5890, growth: '+18%', status: 'Stable', platform: 'All Platforms' },
  { topic: 'Short-Form Video', mentions: 5420, growth: '+26%', status: 'Rising', platform: 'Instagram' },
  { topic: 'Blockchain', mentions: 4650, growth: '+22%', status: 'Rising', platform: 'Telegram' },
  { topic: 'Electric Vehicles', mentions: 4210, growth: '+14%', status: 'Stable', platform: 'Twitter' },
  { topic: 'Climate Change', mentions: 3210, growth: '-4%', status: 'Declining', platform: 'All Platforms' },
  { topic: 'Space Technology', mentions: 2980, growth: '+9%', status: 'Stable', platform: 'Twitter' },
  { topic: 'Cryptocurrency', mentions: 2540, growth: '-12%', status: 'Declining', platform: 'Telegram' },
];

export const trendForecast = [
  { date: 'May 19', ai: 8800, cyber: 6400, digital: 5950 },
  { date: 'May 20', ai: 9200, cyber: 6700, digital: 6100 },
  { date: 'May 21', ai: 9600, cyber: 7000, digital: 6050 },
  { date: 'May 22', ai: 10100, cyber: 7200, digital: 6200 },
  { date: 'May 23', ai: 10800, cyber: 7500, digital: 6400 },
  { date: 'May 24', ai: 11200, cyber: 7800, digital: 6300 },
  { date: 'May 25', ai: 12000, cyber: 8100, digital: 6500 },
];

// ── Audience Data ────────────────────────────────────────────
export const audienceData = {
  ageGroups: [
    { name: '18–24', value: 35, color: '#6366f1' },
    { name: '25–34', value: 40, color: '#3b82f6' },
    { name: '35–44', value: 15, color: '#22d3ee' },
    { name: '45+', value: 10, color: '#a78bfa' },
  ],
  gender: [
    { name: 'Male', value: 58, color: '#3b82f6' },
    { name: 'Female', value: 38, color: '#ec4899' },
    { name: 'Other', value: 4, color: '#22d3ee' },
  ],
  locations: [
    { city: 'Delhi', count: 4820 },
    { city: 'Mumbai', count: 3960 },
    { city: 'Bengaluru', count: 3410 },
    { city: 'Hyderabad', count: 2780 },
    { city: 'Chennai', count: 2150 },
    { city: 'Kolkata', count: 1890 },
    { city: 'Pune', count: 1640 },
    { city: 'Ahmedabad', count: 1320 },
  ],
  interests: [
    { topic: 'Technology', pct: 78 },
    { topic: 'Politics', pct: 64 },
    { topic: 'Entertainment & Creators', pct: 58 },
    { topic: 'Sports', pct: 52 },
    { topic: 'Finance', pct: 43 },
    { topic: 'Health', pct: 38 },
    { topic: 'Travel', pct: 31 },
  ],
  platforms: [
    { name: 'Twitter/X', value: 46, color: '#1d9bf0' },
    { name: 'Instagram', value: 34, color: '#e1306c' },
    { name: 'Telegram', value: 20, color: '#2ca5e0' },
  ],
  engagementLevels: [
    { level: 'Highly Active', value: 22 },
    { level: 'Active', value: 38 },
    { level: 'Moderate', value: 28 },
    { level: 'Passive', value: 12 },
  ],
};

// ── Influencers ──────────────────────────────────────────────
export const influencers = [
  {
    id: 1, name: 'Aarav Sharma', username: '@aarav_tech',
    community: 'Technology', score: 94.2, pagerank: 0.042, connections: 1840,
    followers: '284K', engagement: '6.8%', bio: 'Tech journalist & AI researcher. Covering South Asian innovation ecosystem across X & Instagram.'
  },
  {
    id: 2, name: 'Priya Patel', username: '@priya_policy',
    community: 'Policy & Gov', score: 88.7, pagerank: 0.038, connections: 1420,
    followers: '196K', engagement: '5.2%', bio: 'Public policy analyst. Fellow at Center for Digital Governance.'
  },
  {
    id: 3, name: 'Vikram Mehta', username: '@vikram_news',
    community: 'Media & News', score: 84.3, pagerank: 0.033, connections: 1210,
    followers: '412K', engagement: '4.1%', bio: 'Senior editor & visual journalist. Fact-checking and breaking social trends.'
  },
  {
    id: 4, name: 'Neha Gupta', username: '@neha_startups',
    community: 'Startups', score: 79.8, pagerank: 0.029, connections: 980,
    followers: '145K', engagement: '7.4%', bio: 'Angel investor, creator & podcast host. Early-stage deep tech champion.'
  },
  {
    id: 5, name: 'Rohan Verma', username: '@rohan_cyber',
    community: 'Cybersecurity', score: 74.5, pagerank: 0.024, connections: 830,
    followers: '88K', engagement: '8.1%', bio: 'Security researcher & ethical hacker. Threat intelligence analyst.'
  },
  {
    id: 6, name: 'Ananya Roy', username: '@ananya_climate',
    community: 'Environment', score: 68.2, pagerank: 0.019, connections: 640,
    followers: '72K', engagement: '6.5%', bio: 'Climate scientist & visual creator. Sustainable future advocate.'
  },
];

// ── Network Graph Data (nodes & edges) ────────────────────────
export const networkNodes = [
  { id: 1, label: '@aarav_tech', community: 'Technology', size: 28, x: 260, y: 170, color: '#6366f1' },
  { id: 2, label: '@priya_policy', community: 'Policy & Gov', size: 24, x: 440, y: 140, color: '#3b82f6' },
  { id: 3, label: '@vikram_news', community: 'Media & News', size: 22, x: 170, y: 280, color: '#22d3ee' },
  { id: 4, label: '@neha_startups', community: 'Startups', size: 20, x: 380, y: 290, color: '#f59e0b' },
  { id: 5, label: '@rohan_cyber', community: 'Cybersecurity', size: 18, x: 500, y: 230, color: '#ef4444' },
  { id: 6, label: '@ananya_climate', community: 'Environment', size: 16, x: 290, y: 350, color: '#10b981' },
  { id: 7, label: '@data_guru', community: 'Technology', size: 12, x: 190, y: 100, color: '#6366f1' },
  { id: 8, label: '@ai_daily', community: 'Technology', size: 14, x: 340, y: 80, color: '#6366f1' },
  { id: 9, label: '@gov_watch', community: 'Policy & Gov', size: 12, x: 520, y: 100, color: '#3b82f6' },
  { id: 10, label: '@fact_check_in', community: 'Media & News', size: 13, x: 110, y: 220, color: '#22d3ee' },
  { id: 11, label: '@vc_insights', community: 'Startups', size: 12, x: 440, y: 370, color: '#f59e0b' },
  { id: 12, label: '@threat_intel', community: 'Cybersecurity', size: 11, x: 570, y: 300, color: '#ef4444' },
];

export const networkEdges = [
  { source: 1, target: 2, weight: 3 },
  { source: 1, target: 3, weight: 2 },
  { source: 1, target: 4, weight: 4 },
  { source: 1, target: 7, weight: 3 },
  { source: 1, target: 8, weight: 4 },
  { source: 2, target: 3, weight: 3 },
  { source: 2, target: 5, weight: 2 },
  { source: 2, target: 9, weight: 3 },
  { source: 3, target: 6, weight: 2 },
  { source: 3, target: 10, weight: 4 },
  { source: 4, target: 6, weight: 1 },
  { source: 4, target: 8, weight: 2 },
  { source: 4, target: 11, weight: 3 },
  { source: 5, target: 8, weight: 2 },
  { source: 5, target: 12, weight: 3 },
  { source: 6, target: 1, weight: 1 },
];

// ── Alerts ───────────────────────────────────────────────────
export const alertsData = [
  {
    id: 'a1', severity: 'high', title: 'High Negative Sentiment Spike',
    topic: 'Service Outage', time: '10 minutes ago', read: false,
    description: 'Negative sentiment around "Service X" has surged by 35% in the last hour across Twitter and Instagram comments.',
    action: 'Review recent discussions and issue a status update across all channels.',
    details: { volume: '1,240 posts/hr', change: '+35% negative', affectedPlatform: 'Twitter / Instagram', urgency: 'Immediate' }
  },
  {
    id: 'a2', severity: 'medium', title: 'Trend Alert: AI Regulation',
    topic: 'AI Regulation', time: '28 minutes ago', read: false,
    description: '"AI Regulation" mentions increased by 48% following a parliamentary discussion. High positive engagement on Instagram explainers.',
    action: 'Monitor discussion closely. Consider publishing a position statement.',
    details: { volume: '620 posts/hr', change: '+48% growth', affectedPlatform: 'All Platforms', urgency: 'Today' }
  },
  {
    id: 'a3', severity: 'info', title: 'New High-Influence Creator Detected',
    topic: 'Emerging Influencer', time: '1 hour ago', read: false,
    description: 'Instagram creator @tech_explained reached 38,000 saves on their AI tools carousel in 24 hours. Influence score 74.2.',
    action: 'Review creator content for potential collaboration or brand monitoring.',
    details: { volume: '38K saves', change: 'New entry', affectedPlatform: 'Instagram', urgency: 'Low' }
  },
  {
    id: 'a4', severity: 'high', title: 'Misinformation Risk Detected',
    topic: 'Election Rumours', time: '2 hours ago', read: true,
    description: 'A viral video containing unverified election claims is gaining traction across Instagram Reels and Twitter.',
    action: 'Flag for review. Coordinate with fact-checking teams.',
    details: { volume: '12.4K shares', change: 'Viral spread', affectedPlatform: 'Instagram / Twitter', urgency: 'Immediate' }
  },
  {
    id: 'a5', severity: 'medium', title: 'Community Engagement Drop',
    topic: 'Digital India', time: '3 hours ago', read: true,
    description: 'Engagement on #Business Telegram broadcasts dropped 22% compared to previous week average.',
    action: 'Investigate broadcast timing and format. Test interactive poll updates.',
    details: { volume: '820 posts/hr', change: '-22% drop', affectedPlatform: 'Telegram', urgency: 'This Week' }
  },
];

// ── Sentiment Posts ──────────────────────────────────────────
export const sentimentPosts = [
  {
    id: 1, post: 'SocialSense AI dashboard is incredibly intuitive and fast! Great tool for intelligence teams.',
    sentiment: 'Positive', emotion: 'Joy', confidence: 96, platform: 'Twitter', time: '4 min ago'
  },
  {
    id: 2, post: 'Visual analysis breakdown on Instagram Reels performance gave our campaign a 3x boost in engagement!',
    sentiment: 'Positive', emotion: 'Excitement', confidence: 97, platform: 'Instagram', time: '8 min ago'
  },
  {
    id: 3, post: 'Experiencing intermittent delays in Telegram data sync. Hope this gets resolved soon.',
    sentiment: 'Negative', emotion: 'Frustration', confidence: 89, platform: 'Telegram', time: '12 min ago'
  },
  {
    id: 4, post: 'New policy announcement covered in parliamentary briefing. Analyzing potential sector impact.',
    sentiment: 'Neutral', emotion: 'Neutral', confidence: 94, platform: 'Twitter', time: '18 min ago'
  },
  {
    id: 5, post: 'The new design infographics on Instagram are receiving overwhelmingly positive feedback in comments.',
    sentiment: 'Positive', emotion: 'Joy', confidence: 95, platform: 'Instagram', time: '22 min ago'
  },
  {
    id: 6, post: 'Fantastic accuracy on sentiment breakdown! Caught the trend 2 hours before mainstream media.',
    sentiment: 'Positive', emotion: 'Excitement', confidence: 98, platform: 'Twitter', time: '25 min ago'
  },
  {
    id: 7, post: 'Misleading information circulating around the new voting guidelines. Needs urgent fact-checking.',
    sentiment: 'Negative', emotion: 'Anger', confidence: 92, platform: 'Telegram', time: '34 min ago'
  },
  {
    id: 8, post: 'Q2 digital adoption figures released. India continues rapid expansion in digital public infra.',
    sentiment: 'Positive', emotion: 'Optimism', confidence: 95, platform: 'Twitter', time: '45 min ago'
  },
  {
    id: 9, post: 'Creator video tutorial explaining SocialSense intelligence workflows reached 50K views on Reels.',
    sentiment: 'Positive', emotion: 'Optimism', confidence: 96, platform: 'Instagram', time: '52 min ago'
  },
  {
    id: 10, post: 'Network influence mapping feature helped us identify key opinion leaders in minutes.',
    sentiment: 'Positive', emotion: 'Joy', confidence: 97, platform: 'Twitter', time: '1 hr ago'
  },
];

// ── Multi-Range Emotion Breakdown ────────────────────────────
export const multiRangeEmotions = {
  range1: {
    all: [
      { emotion: 'Joy', value: 44, fullMark: 100 },
      { emotion: 'Trust', value: 39, fullMark: 100 },
      { emotion: 'Optimism', value: 37, fullMark: 100 },
      { emotion: 'Anger', value: 15, fullMark: 100 },
      { emotion: 'Frustration', value: 18, fullMark: 100 },
      { emotion: 'Surprise', value: 25, fullMark: 100 },
    ],
    twitter: [
      { emotion: 'Joy', value: 34, fullMark: 100 },
      { emotion: 'Trust', value: 32, fullMark: 100 },
      { emotion: 'Optimism', value: 29, fullMark: 100 },
      { emotion: 'Anger', value: 25, fullMark: 100 },
      { emotion: 'Frustration', value: 27, fullMark: 100 },
      { emotion: 'Surprise', value: 26, fullMark: 100 },
    ],
    instagram: [
      { emotion: 'Joy', value: 58, fullMark: 100 },
      { emotion: 'Trust', value: 45, fullMark: 100 },
      { emotion: 'Optimism', value: 51, fullMark: 100 },
      { emotion: 'Anger', value: 8, fullMark: 100 },
      { emotion: 'Frustration', value: 10, fullMark: 100 },
      { emotion: 'Surprise', value: 33, fullMark: 100 },
    ],
    telegram: [
      { emotion: 'Joy', value: 39, fullMark: 100 },
      { emotion: 'Trust', value: 48, fullMark: 100 },
      { emotion: 'Optimism', value: 38, fullMark: 100 },
      { emotion: 'Anger', value: 16, fullMark: 100 },
      { emotion: 'Frustration', value: 21, fullMark: 100 },
      { emotion: 'Surprise', value: 19, fullMark: 100 },
    ],
  },
  range2: {
    all: [
      { emotion: 'Joy', value: 38, fullMark: 100 },
      { emotion: 'Trust', value: 42, fullMark: 100 },
      { emotion: 'Optimism', value: 33, fullMark: 100 },
      { emotion: 'Anger', value: 20, fullMark: 100 },
      { emotion: 'Frustration', value: 24, fullMark: 100 },
      { emotion: 'Surprise', value: 22, fullMark: 100 },
    ],
    twitter: [
      { emotion: 'Joy', value: 29, fullMark: 100 },
      { emotion: 'Trust', value: 35, fullMark: 100 },
      { emotion: 'Optimism', value: 26, fullMark: 100 },
      { emotion: 'Anger', value: 31, fullMark: 100 },
      { emotion: 'Frustration', value: 33, fullMark: 100 },
      { emotion: 'Surprise', value: 24, fullMark: 100 },
    ],
    instagram: [
      { emotion: 'Joy', value: 52, fullMark: 100 },
      { emotion: 'Trust', value: 47, fullMark: 100 },
      { emotion: 'Optimism', value: 45, fullMark: 100 },
      { emotion: 'Anger', value: 12, fullMark: 100 },
      { emotion: 'Frustration', value: 14, fullMark: 100 },
      { emotion: 'Surprise', value: 28, fullMark: 100 },
    ],
    telegram: [
      { emotion: 'Joy', value: 35, fullMark: 100 },
      { emotion: 'Trust', value: 51, fullMark: 100 },
      { emotion: 'Optimism', value: 34, fullMark: 100 },
      { emotion: 'Anger', value: 21, fullMark: 100 },
      { emotion: 'Frustration', value: 26, fullMark: 100 },
      { emotion: 'Surprise', value: 17, fullMark: 100 },
    ],
  },
  range3: {
    all: [
      { emotion: 'Joy', value: 32, fullMark: 100 },
      { emotion: 'Trust', value: 36, fullMark: 100 },
      { emotion: 'Optimism', value: 28, fullMark: 100 },
      { emotion: 'Anger', value: 27, fullMark: 100 },
      { emotion: 'Frustration', value: 31, fullMark: 100 },
      { emotion: 'Surprise', value: 20, fullMark: 100 },
    ],
    twitter: [
      { emotion: 'Joy', value: 24, fullMark: 100 },
      { emotion: 'Trust', value: 30, fullMark: 100 },
      { emotion: 'Optimism', value: 21, fullMark: 100 },
      { emotion: 'Anger', value: 36, fullMark: 100 },
      { emotion: 'Frustration', value: 39, fullMark: 100 },
      { emotion: 'Surprise', value: 22, fullMark: 100 },
    ],
    instagram: [
      { emotion: 'Joy', value: 46, fullMark: 100 },
      { emotion: 'Trust', value: 41, fullMark: 100 },
      { emotion: 'Optimism', value: 39, fullMark: 100 },
      { emotion: 'Anger', value: 17, fullMark: 100 },
      { emotion: 'Frustration', value: 19, fullMark: 100 },
      { emotion: 'Surprise', value: 25, fullMark: 100 },
    ],
    telegram: [
      { emotion: 'Joy', value: 30, fullMark: 100 },
      { emotion: 'Trust', value: 44, fullMark: 100 },
      { emotion: 'Optimism', value: 29, fullMark: 100 },
      { emotion: 'Anger', value: 28, fullMark: 100 },
      { emotion: 'Frustration', value: 33, fullMark: 100 },
      { emotion: 'Surprise', value: 15, fullMark: 100 },
    ],
  },
  range30: {
    all: [
      { emotion: 'Joy', value: 41, fullMark: 100 },
      { emotion: 'Trust', value: 40, fullMark: 100 },
      { emotion: 'Optimism', value: 36, fullMark: 100 },
      { emotion: 'Anger', value: 18, fullMark: 100 },
      { emotion: 'Frustration', value: 22, fullMark: 100 },
      { emotion: 'Surprise', value: 24, fullMark: 100 },
    ],
    twitter: [
      { emotion: 'Joy', value: 31, fullMark: 100 },
      { emotion: 'Trust', value: 34, fullMark: 100 },
      { emotion: 'Optimism', value: 28, fullMark: 100 },
      { emotion: 'Anger', value: 28, fullMark: 100 },
      { emotion: 'Frustration', value: 30, fullMark: 100 },
      { emotion: 'Surprise', value: 25, fullMark: 100 },
    ],
    instagram: [
      { emotion: 'Joy', value: 55, fullMark: 100 },
      { emotion: 'Trust', value: 46, fullMark: 100 },
      { emotion: 'Optimism', value: 48, fullMark: 100 },
      { emotion: 'Anger', value: 10, fullMark: 100 },
      { emotion: 'Frustration', value: 13, fullMark: 100 },
      { emotion: 'Surprise', value: 30, fullMark: 100 },
    ],
    telegram: [
      { emotion: 'Joy', value: 37, fullMark: 100 },
      { emotion: 'Trust', value: 49, fullMark: 100 },
      { emotion: 'Optimism', value: 36, fullMark: 100 },
      { emotion: 'Anger', value: 19, fullMark: 100 },
      { emotion: 'Frustration', value: 23, fullMark: 100 },
      { emotion: 'Surprise', value: 18, fullMark: 100 },
    ],
  },
};

// Fallback legacy emotionData
export const emotionData = multiRangeEmotions.range1.all;

export function getEmotionData(platform = 'all', dateRange = 'May 12, 2026 – May 18, 2026') {
  const rangeKey = normalizeDateRange(dateRange);
  const rangeObj = multiRangeEmotions[rangeKey] || multiRangeEmotions.range1;
  return rangeObj[platform] || rangeObj.all;
}

// ── Keywords ─────────────────────────────────────────────────
export const positiveKeywords = [
  { word: 'growth', count: 4820 },
  { word: 'innovation', count: 4210 },
  { word: 'success', count: 3890 },
  { word: 'breakthrough', count: 3410 },
  { word: 'efficient', count: 2980 },
  { word: 'reliable', count: 2640 },
  { word: 'inspiring', count: 2310 },
  { word: 'transformative', count: 2150 },
  { word: 'fast', count: 1980 },
  { word: 'empowering', count: 1760 },
];

export const negativeKeywords = [
  { word: 'outage', count: 3120 },
  { word: 'delay', count: 2840 },
  { word: 'error', count: 2410 },
  { word: 'frustrated', count: 2190 },
  { word: 'misleading', count: 1870 },
  { word: 'bug', count: 1640 },
  { word: 'slow', count: 1490 },
  { word: 'unreliable', count: 1280 },
  { word: 'confusing', count: 1120 },
  { word: 'crash', count: 980 },
];
