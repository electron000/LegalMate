// src/configs/ToolRegistry.js

// 1. Existing Tools
import { craConfig } from './craConfig';
import { willConfig } from './willConfig';
import { mfaConfig } from './mfaConfig';
import { sdConfig } from './sdConfig';

// 2. Business Contracts
import { ndaConfig } from './ndaConfig';
import { employmentConfig } from './eConfig';
import { partnershipConfig } from './pConfig';
import { freelancerConfig } from './fConfig';
import { saConfig } from './saConfig';

// 3. Personal & Legal
import { poaConfig } from './poaConfig';
import { rentalConfig } from './rentalConfig'; // Keep this one
import { aConfig } from './aConfig';
import { ncaConfig } from './ncaConfig';

// 4. Notices
import { ceaseDesistConfig } from './cdConfig';
import { legalNoticeDuesConfig } from './lndConfig';

export const ToolRegistry = {
  // Existing
  [craConfig.id]: craConfig,
  // [rentalConfig.id]: rentalConfig, <--- REMOVED DUPLICATE FROM HERE
  [willConfig.id]: willConfig,
  [mfaConfig.id]: mfaConfig,
  [sdConfig.id]: sdConfig,

  // New Business
  [ndaConfig.id]: ndaConfig,
  [employmentConfig.id]: employmentConfig,
  [partnershipConfig.id]: partnershipConfig,
  [freelancerConfig.id]: freelancerConfig,
  [saConfig.id]: saConfig,

  // New Personal
  [poaConfig.id]: poaConfig,
  [rentalConfig.id]: rentalConfig, // Kept this one
  [aConfig.id]: aConfig,
  [ncaConfig.id]: ncaConfig,

  // New Notices
  [ceaseDesistConfig.id]: ceaseDesistConfig,
  [legalNoticeDuesConfig.id]: legalNoticeDuesConfig,
};