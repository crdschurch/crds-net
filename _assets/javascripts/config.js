module.exports = [
  {
    name: 'application',
    deps: ['vendor/jquery-3.3.1.min'],
    files: []
  },
  {
    name: 'application_deferred',
    deps: [
      'vendor/bootstrap.min',
      'vendor/imgix.min',
      'vendor/clipboard.min',
      'vendor/crds-card-carousel-v0.2.2.min',
      'vendor/flickity.pkgd.min',
      'vendor/imgix-optimizer-0.0.10.min',
      'vendor/moment.min',
      'vendor/reactive-auth-v0.0.1.umd',
      'vendor/knockout-3.4.2',
      'vendor/crds-status-message-v0.1.3.min',
    ],
    files: [
      'components/audio_video_toggler',
      'components/clipboard',
      'components/discussion-questions',
      'components/images',
      'components/carousels',
      'components/pagination',
      'components/tabs',
      'components/track-viewport',
      'components/roll-call',
      'components/dates',
      'components/menu-squencher',
      'components/status-message',
      'components/youtube',
    ],
  },
  {
    name: 'preview_deferred',
    deps: [
      'vendor/bootstrap.min',
      'vendor/imgix.min',
      'vendor/clipboard.min',
      'vendor/marked',
      'vendor/imgix-optimizer-0.0.10.min',
    ],
    files: [
      'components/clipboard',
      'components/images',
      'components/preview',
      'components/menu-squencher',
    ],
  },
  {
    name: 'bitmovin',
    files: [
      'components/bitmovin',
    ],
  },
  {
    name: 'autoplay',
    files: [
      'components/autoplay-controller',
    ],
  },
];
