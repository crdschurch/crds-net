# CRDS-NET
## A Static Site Generator for crossroads.net

## Setup

### Mac
To get started with this project, first make sure you have Ruby installed. This
project requires the use of Ruby version >= 2.5.1. If you are on a Mac, Ruby should
already be installed but you may need to upgrade your version. rbenv is a great tool
to manage your Ruby versions. You can read about that [here](https://github.com/rbenv/rbenv#installation).

Once you have Ruby version >= 2.5.1 installed, make sure you have Ruby bundler
installed.

`gem install bundler`

After installing bundler, you will be able to install the project's dependencies that
are defined in the `Gemfile`. You can do that by running

`bundle install`

Once the project dependencies are installed, you can now kick off a build of the
project:

`bundle exec jekyll serve`

This will build the site and start up a preview server that allows you to view the
work that you have done.

### Windows
First, make sure you have Ruby v2.5.1 installed on your machine. There is a proven guide
for getting Ruby installed on your machine that you can read
[here](https://gorails.com/setup/windows/10#ruby). This particular
guide only needs to be followed up until the `Configuring Git` heading. Everything
from `Configuring Git` onward is unnecessary to follow.

Once you have Ruby v.2.5.1 installed on your machine, you are ready to build the project:

`bundle exec jekyll serve`

This will build the site and start up a preview server that allows you to view the
work that you have done.

### Linux
First, make sure you have Ruby v2.5.1 installed on your machine. There is a proven guide
for getting Ruby installed on your machine that you can read
[here](https://gorails.com/setup/ubuntu/16.04). This particular
guide only needs to be followed up until the `Configuring Git` heading. Everything
from `Configuring Git` onward is unnecessary to follow.

Once you have Ruby v.2.5.1 installed on your machine, you are ready to build the project:

`bundle exec jekyll serve`

This will build the site and start up a preview server that allows you to view the
work that you have done.

## Downloading Content

First, you need to export the following environment variables (you can get these
values directly from Contentful)...

```bash
CONTENTFUL_SPACE_ID=
CONTENTFUL_ENV=
CONTENTFUL_ACCESS_TOKEN=
```

Then run the following command in your bash prompt to download content to your local
`collections` directory.

```bash
bundle exec jekyll contentful
```

### Images

With the help of imgix, we are using two strategies to increase performance while rendering images:

- Pixellated placeholders
- `srcset` and `sizes` attributes

For more info on how this works, see the extended documentation in the [media repo](https://github.com/crdschurch/crds-media/blob/development/README.md#images).

#### Examples

**Inline Images**
```html
<img src="{{ page.image | imgix: site.imgix }}?{{ site.imgix_params.placeholder }}" sizes="{{ site.image_sizes.full_width }}" data-optimize-img>
```

This would translate to something like the following (before processing):

```html
<img src="//crds-media-int.imgix.net/5G62zla1zOsmKqSo8wmomI/d46b0ec8a96339c72f25b56b7c2dd99b/isle-of-skye.jpg?auto=format,compress&w=10" sizes="100vw" data-optimize-img>
```

**Background Images**

Background images work similarly, with three exceptions:

- A `data-optimize-bg-img` attribute is required for the processing.
- The dimensions of the imgix image are set automatically based on the container (i.e. it assumes a _cover_ background approach).
- The script watches for changes to the size of the window and will update the background image appropriately.
