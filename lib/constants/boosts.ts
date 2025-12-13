/**
 * Era boost multipliers for pNode rewards
 * Based on when the pNode was purchased/licensed
 */
export const ERA_BOOSTS = {
  'Deep South': {
    multiplier: 16,
    percentage: 1500, // 1500% boost
    description: 'First 300 pNodes sold',
    color: '#872f77',
  },
  'South': {
    multiplier: 10,
    percentage: 900,
    description: 'Early adopters',
    color: '#2596be',
  },
  'Mine': {
    multiplier: 7,
    percentage: 600,
    description: 'Mid-stage participants',
    color: '#0f9c84',
  },
  'Coal': {
    multiplier: 3.5,
    percentage: 250,
    description: 'Standard participants',
    color: '#c6731d',
  },
  'Central': {
    multiplier: 2,
    percentage: 100,
    description: 'Late participants',
    color: '#6c757d',
  },
  'North': {
    multiplier: 1.25,
    percentage: 25,
    description: 'Latest participants',
    color: '#4a5568',
  },
} as const;

/**
 * NFT boost multipliers for pNode rewards
 * Based on NFT ownership
 */
export const NFT_BOOSTS = {
  'Titan': {
    multiplier: 11,
    percentage: 1000, // 1000% boost
    description: 'Highest tier NFT boost',
    rarity: 'legendary',
    color: '#ffd700', // Gold
    maxSupply: 52,
  },
  'Dragon': {
    multiplier: 4,
    percentage: 300,
    description: 'High tier NFT boost',
    rarity: 'epic',
    color: '#ff4500', // Red-orange
  },
  'Coyote': {
    multiplier: 2.5,
    percentage: 150,
    description: 'Mid tier NFT boost',
    rarity: 'rare',
    color: '#8b4513', // Brown
  },
  'Rabbit': {
    multiplier: 1.5,
    percentage: 50,
    description: 'Low tier NFT boost',
    rarity: 'uncommon',
    color: '#90ee90', // Light green
  },
  'Cricket': {
    multiplier: 1.1,
    percentage: 10,
    description: 'Base tier NFT boost',
    rarity: 'common',
    color: '#98fb98', // Pale green
  },
  'Xeno': {
    multiplier: 1.1,
    percentage: 10,
    description: 'Early adopter bonus NFT',
    rarity: 'special',
    color: '#00ffff', // Cyan
  },
} as const;

/**
 * Future MainNet Alpha NFT boost (not yet released)
 */
export const ALPHA_NFT_BOOST = {
  name: 'Alpha',
  multiplier: 'TBD',
  percentage: 'TBD',
  description: 'Early MainNet adopter bonus',
  rarity: 'legendary',
  color: '#9b59b6', // Purple
  releaseDate: 'Q4 2025',
} as const;

/**
 * Combined boost calculation examples
 */
export const BOOST_EXAMPLES = [
  {
    era: 'Deep South',
    nft: 'Titan',
    combined: 176, // 16 * 11
    percentage: 17500,
    description: 'Maximum possible boost',
  },
  {
    era: 'Deep South',
    nft: null,
    combined: 16,
    percentage: 1500,
    description: 'Era only (Deep South)',
  },
  {
    era: 'South',
    nft: 'Dragon',
    combined: 40, // 10 * 4
    percentage: 3900,
    description: 'Strong combination',
  },
  {
    era: 'Mine',
    nft: 'Coyote',
    combined: 17.5, // 7 * 2.5
    percentage: 1650,
    description: 'Average combination',
  },
  {
    era: 'North',
    nft: null,
    combined: 1.25,
    percentage: 25,
    description: 'Minimum boost',
  },
] as const;

/**
 * Reward thresholds
 */
export const REWARD_THRESHOLDS = {
  // Need 80% of 95th percentile credits to qualify
  qualificationPercentage: 80,
  percentileTarget: 95,
  
  // Monthly XAND allocation per qualifying pNode (DevNet)
  monthlyDevNetReward: 10000,
  
  // STOINC (Storage Income) distribution (MainNet)
  stoinc: {
    totalFeePercentage: 94, // 94% of app fees go to pNodes
    foundationCut: 3,
    investorCut: 3,
  },
} as const;

/**
 * Boost utilities
 */
export const boostUtils = {
  /**
   * Calculate combined boost multiplier
   */
  calculateCombinedBoost: (
    eraBoost: keyof typeof ERA_BOOSTS | null,
    nftBoost: keyof typeof NFT_BOOSTS | null
  ): number => {
    const era = eraBoost ? ERA_BOOSTS[eraBoost].multiplier : 1;
    const nft = nftBoost ? NFT_BOOSTS[nftBoost].multiplier : 1;
    return era * nft;
  },
  
  /**
   * Calculate total credits with boosts
   */
  calculateBoostedCredits: (
    baseCredits: number,
    eraBoost: keyof typeof ERA_BOOSTS | null,
    nftBoost: keyof typeof NFT_BOOSTS | null
  ): number => {
    const multiplier = boostUtils.calculateCombinedBoost(eraBoost, nftBoost);
    return baseCredits * multiplier;
  },
  
  /**
   * Get boost description
   */
  getBoostDescription: (
    eraBoost: keyof typeof ERA_BOOSTS | null,
    nftBoost: keyof typeof NFT_BOOSTS | null
  ): string => {
    const parts: string[] = [];
    
    if (eraBoost) {
      parts.push(`${eraBoost} Era (${ERA_BOOSTS[eraBoost].multiplier}x)`);
    }
    
    if (nftBoost) {
      parts.push(`${nftBoost} NFT (${NFT_BOOSTS[nftBoost].multiplier}x)`);
    }
    
    if (parts.length === 0) {
      return 'No boost active';
    }
    
    return parts.join(' + ');
  },
  
  /**
   * Get all eras sorted by multiplier
   */
  getErasSorted: () => {
    return Object.entries(ERA_BOOSTS)
      .sort(([, a], [, b]) => b.multiplier - a.multiplier)
      .map(([name, data]) => ({ name, ...data }));
  },
  
  /**
   * Get all NFTs sorted by multiplier
   */
  getNFTsSorted: () => {
    return Object.entries(NFT_BOOSTS)
      .sort(([, a], [, b]) => b.multiplier - a.multiplier)
      .map(([name, data]) => ({ name, ...data }));
  },
};

/**
 * Type exports
 */
export type EraBoostName = keyof typeof ERA_BOOSTS;
export type NFTBoostName = keyof typeof NFT_BOOSTS;