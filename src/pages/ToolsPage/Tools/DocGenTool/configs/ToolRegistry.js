// 1. Finance & Asset & Job Contracts
import { craConfig } from './craConfig';
import { willConfig } from './willConfig';
import { mfaConfig } from './mfaConfig';
import { sdConfig } from './sdConfig';
import { contractConfig } from './contractConfig';


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
  // Contracts
  [craConfig.id]: craConfig,
  [willConfig.id]: willConfig,
  [mfaConfig.id]: mfaConfig,
  [sdConfig.id]: sdConfig,
  [contractConfig.id]: contractConfig,

  // Business
  [ndaConfig.id]: ndaConfig,
  [employmentConfig.id]: employmentConfig,
  [partnershipConfig.id]: partnershipConfig,
  [freelancerConfig.id]: freelancerConfig,
  [saConfig.id]: saConfig,

  // Personal
  [poaConfig.id]: poaConfig,
  [rentalConfig.id]: rentalConfig, // Kept this one
  [aConfig.id]: aConfig,
  [ncaConfig.id]: ncaConfig,

  // Notices
  [ceaseDesistConfig.id]: ceaseDesistConfig,
  [legalNoticeDuesConfig.id]: legalNoticeDuesConfig,
};