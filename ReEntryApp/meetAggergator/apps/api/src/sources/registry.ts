import { arizonaNaAdapter } from './arizona-na.js';
import { phoenixAaAdapter } from './phoenix-aa.js';
import { arizonaCmaAdapter } from './arizona-cma.js';
import { arizonaMaAdapter } from './arizona-ma.js';
import { tucsonAaAdapter } from './tucson-aa.js';
import { recoveryDharmaAdapter } from './recovery-dharma.js';
export const sourceRegistry = {
  'recovery-dharma': {
    name:'Recovery Dharma Global',url:'https://recoverydharma.org/meetings/',
    attribution:'Recovery Dharma Global — https://recoverydharma.org/meetings/',adapter:recoveryDharmaAdapter
  },
  'tucson-aa': {
    name:'Tucson AA Intergroup',url:'https://aatucson.org/meetings/',
    attribution:'Tucson AA Intergroup — https://aatucson.org/meetings/',adapter:tucsonAaAdapter
  },
  'arizona-na': {
    name:'Arizona Region of Narcotics Anonymous',url:'https://arizona-na.org/meetings/full-arizona-regional-meeting-finder/',
    attribution:'Arizona Region of Narcotics Anonymous — https://arizona-na.org/meetings/full-arizona-regional-meeting-finder/',adapter:arizonaNaAdapter
  },
  'phoenix-aa': {
    name:'Salt River Intergroup / Phoenix AA',url:'https://aaphoenix.org/meetings/',
    attribution:'Salt River Intergroup — https://aaphoenix.org/meetings/',adapter:phoenixAaAdapter
  },
  'arizona-cma': {
    name:'Crystal Meth Anonymous World Services',url:'https://www.crystalmeth.org/cma-meeting-directory/',
    attribution:'Crystal Meth Anonymous World Services — https://www.crystalmeth.org/cma-meeting-directory/',adapter:arizonaCmaAdapter
  },
  'arizona-ma': {
    name:'Marijuana Anonymous World Services',url:'https://marijuana-anonymous.org/find-a-meeting/',
    attribution:'Marijuana Anonymous World Services — https://marijuana-anonymous.org/find-a-meeting/',adapter:arizonaMaAdapter
  }
} as const;
