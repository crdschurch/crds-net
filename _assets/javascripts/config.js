module.exports = [
  {
    name: "application",
    deps: ["vendor/jquery-3.3.1.min"],
    files: ["lib/set-redirect-url"]
  },
  {
    name: "application_deferred",
    deps: [
      "vendor/webcomponents-lite.min",
      "vendor/imgix.min",
      "vendor/imgix-optimizer-0.0.10.min",
      "vendor/bootstrap.min",
      "vendor/flickity.pkgd.min",
      "vendor/crds-card-carousel-v0.2.2.min",
      "vendor/crds-jumbotron-video-v0.2.1.min",
      "vendor/crds-status-message-v0.1.3.min",
      "vendor/feature-flags.min",
      "vendor/isotope.min",
      "vendor/smart-app-banner-2.0.0.min"
    ],
    files: [
      "lib/location-finder",
      "lib/distance-sorter",
      "lib/data-tracker",
      "lib/environment",
      "lib/card-filters",
      "lib/height-watcher",
      "lib/smooth-scroller",
      "components/legacy-imgix",
      "components/images",
      "components/carousels",
      "components/chat",
      "components/countdown",
      "components/jumbotron-video",
      "components/filters",
      "components/smart-banner",
      "components/status-message",
      "components/global",
      "components/youtube",
      "components/toggle-tooltip"
    ]
  },
  {
    name: "parallax",
    files: ["vendor/rellax-1.10.0.min"]
  },
  {
    name: "masonry_deferred",
    files: ["components/masonry"]
  },
  {
    name: "set-redirect-url",
    files: ["lib/set-redirect-url"]
  },
  {
    name: "reachout-trip",
    files: ["lib/reachout-trip"]
  },
  {
    name: "family-meeting-stream",
    files: ["views/family-meeting-stream"]
  },
  {
    name: "live",
    files: ["views/live"]
  },
  {
    name: "location-search",
    files: ["components/location-search"]
  },
  {
    name: "live-stream",
    deps: ["vendor/crds-rollcall-v1.0.1.min"],
    files: ["views/live-stream"]
  },
  {
    name: "explore",
    deps: [
      "vendor/jquery.fullPage-2.7.4.min",
      "vendor/tweenMax-1.18.0.min",
      "vendor/animations.min"
    ]
  },
  {
    name: "ash-wednesday-experience",
    deps: [
      "vendor/jquery.fullPage-2.7.4.min",
      "vendor/tweenMax-1.18.0.min",
      "vendor/animations.min",
      "vendor/ash-wednesday-experience"
    ]
  },
  {
    name: "bitmovin",
    deps: ["vendor/moment-2.24.min", "vendor/moment-timezone-0.5.25.min"],
    files: ["components/bitmovin"]
  },
  {
    name: "events",
    files: [
      "vendor/jquery.cycle2.min",
      "vendor/scrollVert.min",
      "vendor/events.min"
    ]
  },
  {
    name: "autoplay",
    files: ["components/autoplay-controller"]
  },
  {
    name: "skeleton",
    files: ["components/skeleton"]
  },
  {
    name:"video-modal-close",
    files: ["lib/video-modal-close"]
  },
   {
    name: "iFrameResizer",
    deps: ["vendor/iframeResizer.min"]
  },
];

