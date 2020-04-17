import {  EntryQueryManager } from 'crds-cypress-contentful';
import { OnsiteGroupEntry } from './OnsiteGroupEntry';



export class OnsiteGroupQueryManager extends EntryQueryManager {
    constructor() {
      super('onsite_group', OnsiteGroupEntry);
    }
  

    /** Pre-defined queries */
   get query(){
       return{
        onsitegrouplist(exists = true) {
            return exists == true ? 'fields.title[exists]=trues': 'fields.title[exists]=true' & 'fields.slug';
       },
      };
    }

    get query(){
        return{
            orderBy: {
                title: 'order=fields.title',
                publishedMostRecently: 'order=fields.published_at',
                updatedMostRecently: 'order=-sys.updatedAt'
              },
        };
    }
}