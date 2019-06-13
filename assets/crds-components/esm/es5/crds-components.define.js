
// CrdsComponents: Custom Elements Define Library, ES Module/es5 Target

import { defineCustomElement } from './crds-components.core.js';
import { COMPONENTS } from './crds-components.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, COMPONENTS, opts);
}
