import Image from './image';
import BackgroundImage from './background_image';
import * as IntObs from 'intersection-observer';
import * as ObjectAssign from './polyfills/object_assign';

export default class Optimizer {
  constructor(options = {}) {
    this.initDependencies();
    this.initOptions(options);
    this.optimizeImages();
    this.optimizeBgImages();
  }

  // ---------------------------------------- | Dependencies

  initDependencies() {
    IntObs;
    ObjectAssign;
  }

  // ---------------------------------------- | Options

  initOptions(options = {}) {
    this.options = options;
    const defaultOptions = {
      parent: 'body'
    };
    for (let key in defaultOptions) {
      if (defaultOptions.hasOwnProperty(key) && !this.options[key]) {
        this.options[key] = defaultOptions[key];
      }
    }
  }

  // ---------------------------------------- | Inline Images

  optimizeImages() {
    $(`${this.options.parent} img[data-optimize-img]`).each((idx, img) => {
      new Image(img);
    });
  }

  // ---------------------------------------- | Background Images

  optimizeBgImages() {
    $(`${this.options.parent} [data-optimize-bg-img]`).each((idx, img) => {
      new BackgroundImage(img);
    });
    return true;
  }
}
