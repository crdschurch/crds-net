var title = document.querySelector('[data-title]');
var authorNames = document.querySelectorAll('[data-author-name]');
var authorLinks = document.querySelectorAll('[data-author-link]');
var authorBio = document.querySelector('[data-author-bio]');
var authorImg = document.querySelector('[data-author-img]');
var postDate = document.querySelector('[data-post-date]');
var postBody = document.querySelector('[data-body]');
var tagContainer = document.querySelector('[data-tags]');
var heroContainer = document.querySelector('[data-hero-image]');
var heroCaption = document.querySelector('[data-hero-caption]');
var preloader = document.querySelector('[data-preview-preloader]');

function hidePreloader() {
  preloader.style.opacity = 0;
  preloader.style.zIndex = -1;
}

function parseBodyMarkdown(obj) {
  var Marked = marked;
  Marked.setOptions({
    sanitize: false,
    smartLists: true,
    smartypants: false
  });
  var parsedMd = Marked(obj);
  postBody.innerHTML = parsedMd;
}

function setTags(arr) {
  for (var i = 0; i < arr.length; i += 1) {
    var elm = document.createElement('a');
    elm.classList.add('article_tag');
    elm.innerText = arr[i];
    tagContainer.appendChild(elm);
  }
}

function setHeroImage(src) {
  var imgUrl = `${src}?auto=format,compress&w=100&fit=crop`;
  replaceImg(imgUrl, heroContainer);
}

function setAuthorInfo(name, slug, bio, img) {
  for (var i = 0; i < authorNames.length; i += 1) {
    authorNames[i].innerText = name;
  }

  for (var k = 0; k < authorLinks.length; k += 1) {
    authorLinks[k].href = `/media/authors/${slug}`;
  }

  authorBio.innerText = bio;

  if (img) {
    getAsset(img).then(function(res) {
      var imgUrl = `${res.fields.file.url}?auto=format,compress&w=80&h=80&fit=crop`;
      replaceImg(imgUrl, authorImg);
    });
  }
}

function replaceImg(src, el) {
  el.removeAttribute('src');
  el.setAttribute('ix-src', src.replace(IMGIX_SRC, IMGIX_DOMAIN));
  el.classList.add('img-responsive');
  imgix.init({
    force: true
  })
}

function setText(obj) {
  title.innerText = obj.title;
  postDate.innerText = obj.published_at;
  parseBodyMarkdown(obj.body);
}

function renderPage(data) {
  setText(data);
  if (data.tags !== undefined) { setTags(data.tags) }

  if (data.image) {
    getAsset(data.image.sys.id).then(function(res) {
      setHeroImage(res.fields.file.url);
      bgImageLoaded(res.fields.file.url);
    }).catch(function(err) {
      console.log(err);
    });
  } else {
    //  🛠  Even if image does not exist yet, do not hide preloader until author
    //  has loaded, if author exists.
    hidePreloader();
  }

  if (data.person && data.person.length) {
    Promise.all(data.person.map(function(personRef) {
      return getEntry(personRef.sys.id);
    })).then(function(people) {
      var author = people.find(function(person) {
        return person.fields.roles && person.fields.roles.indexOf('Author') > -1;
      });

      if (author) {
        setAuthorInfo(
          author.fields.name || author.fields.full_name,
          author.fields.slug,
          author.fields.bio || author.fields.summary,
          author.fields.image && author.fields.image.sys ? author.fields.image.sys.id : null
        );
      } else {
        hidePreloader();
      }
    }).catch(function(err) {
      console.log(err);
    });
  } else if (data.author && data.author.sys && data.author.sys.id) {
    getEntry(data.author.sys.id).then(function(res) {
      setAuthorInfo(
        res.fields.name || res.fields.full_name,
        res.fields.slug,
        res.fields.bio || res.fields.summary,
        res.fields.image && res.fields.image.sys ? res.fields.image.sys.id : null
      );
    }).catch(function(err) {
      console.log(err);
    });
  }
}

function getAsset(id) {
  return new Promise(function(resolve, reject) {
    var accessToken = getUrlParameter('access_token'),
        spaceId = getUrlParameter('space_id');
    var assetUrl = `https://preview.contentful.com/spaces/${spaceId}/assets/${id}?access_token=${accessToken}`;
    resolve(makeRequest(assetUrl));
  })
}

function getEntry(id) {
  return new Promise(function(resolve, reject) {
    if (id === undefined) { id = getUrlParameter('id') }
    var accessToken = getUrlParameter('access_token'),
        spaceId = getUrlParameter('space_id');
    if (id && accessToken && spaceId) {
      var url = `https://preview.contentful.com/spaces/${spaceId}/entries/${id}?access_token=${accessToken}`;
      makeRequest(url).then(function(res) {
        resolve(res);
      });
    }
  });
}

function getUrlParameter(name) {
  var url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function makeRequest(url) {
  return new Promise(function(resolve, reject)  {
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', url );
    xhr.send();
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.response);
        resolve(data);
      } else {
        reject('data not received');
      }
    }
  });
};

function init() {
  getEntry().then(function(res) {
    renderPage(res.fields);
  }).catch(function(err) {
    console.log(err);
  });
}

init();

function bgImageLoaded(src) {
  var img = new Image();
  img.onload = function() {
    hidePreloader();
  }
  img.src = src;
}
