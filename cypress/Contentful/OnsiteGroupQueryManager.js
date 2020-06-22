import {  EntryQueryManager } from 'crds-cypress-contentful';
import { OnsiteGroupEntry } from './OnsiteGroupEntry';



export class OnsiteGroupQueryManager extends EntryQueryManager {
    constructor() {
      super('onsite_group', OnsiteGroupEntry);
   
   }
}