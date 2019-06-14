import { Utils } from './utils';
export class Config {
    space_id() {
        return Utils.getMeta('cfl:space_id') || process.env.CONTENTFUL_SPACE_ID;
    }
    env() {
        return Utils.getMeta('cfl:env') || process.env.CONTENTFUL_ENV || 'master';
    }
    token() {
        return Utils.getMeta('cfl:token') || process.env.CONTENTFUL_ACCESS_TOKEN;
    }
    endpoint() {
        return `https://cdn.contentful.com/spaces/${this.space_id()}/environments/${this.env()}`;
    }
}
