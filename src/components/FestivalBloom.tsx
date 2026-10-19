import React from 'react';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

export interface FestivalBloomProps {
  intensity?: number;
  luminanceThreshold?: number;
  luminanceSmoothing?: number;
}

/**
 * Reusable Festival Bloom component using @react-three/postprocessing
 * Creates warm, golden magical festival sunlight bloom aligning with Bambino World aesthetic
 */
export const FestivalBloom: React.FC<FestivalBloomProps> = ({
  intensity = 0.55,
  luminanceThreshold = 0.82,
  luminanceSmoothing = 0.4
}) => {
  return (
    <EffectComposer>
      <Bloom
        intensity={intensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        mipmapBlur
      />
    </EffectComposer>
  );
};

export default FestivalBloom;
