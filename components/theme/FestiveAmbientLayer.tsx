'use client';

import { AmbientEffectType } from '@/lib/theme/festivalThemeTypes';

interface FestiveAmbientLayerProps {
  effectType?: AmbientEffectType;
  intensity?: 'subtle' | 'moderate' | 'festive';
}

/**
 * FestiveAmbientLayer:
 * Moving light bubbles / floating canvas particles removed per user preference.
 */
export function FestiveAmbientLayer({ effectType, intensity }: FestiveAmbientLayerProps) {
  // Moving light bubbles and canvas animation layer permanently removed
  return null;
}
