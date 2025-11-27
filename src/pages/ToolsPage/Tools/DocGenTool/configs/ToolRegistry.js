
import { craConfig } from './craConfig';
import { willConfig } from './willConfig';
import { mfaConfig } from './mfaConfig';
import { sdConfig } from './sdConfig';

// 2. Business Contracts
import { ndaConfig } from './ndaConfig';
import { employmentConfig } from './employmentConfig';
import { partnershipConfig } from './partnershipConfig';
import { freelancerConfig } from './freelancerConfig';
import { saConfig } from './serviceConfig';

// 3. Personal & Legal
import { poaConfig } from './poaConfig';
import { rentalConfig } from './rentalConfig'; // Keep this one
import { aConfig } from './generalaffidavitConfig';
import { ncaConfig } from './ncaConfig';

// 4. Notices
import { ceaseDesistConfig } from './ceasedesistConfig';
import { legalNoticeDuesConfig } from './legalnoticeConfig';

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