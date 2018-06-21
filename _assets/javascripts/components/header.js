(function(){
  var options = {
    cmsEndpoint: CRDS.media.cms,
    appEndpoint: CRDS.media.app,
    imgEndpoint: CRDS.media.img,
    crdsCookiePrefix: CRDS.media.prefix
  };
  var header = new CRDS.SharedHeader(options);
      header.render();
})();