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

First, make sure you have Ruby v2.5.1 installed on your machine. You can find Windows installers (with devkit) [here](https://rubyinstaller.org/downloads/).
Once you have Ruby version v2.5.1 installed, use Powershell to install the Ruby bundler by running
`gem install bundler`
After installing bundler, navigate to this project and install the project's dependencies that are defined in the `Gemfile`. You can do that by running
`bundle install`
Once the project dependencies are installed, you can now kick off a build of the
project:
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

## Contributing To The Repo

As with most crdschurch repos, local feature development should be done against the `development` branch. Follow these simple steps to contribute:

1. `git checkout development` and make sure that you are up to date (run `git pull`)
2. Checkout a fresh branch based off of development: `git checkout -b feature/my-branch-name`
3. Make local code changes and commit to your new branch
4. When the time is right, create a pull request comparing your new branch to development
5. After a review, your work will be merged into `development`
   After these first 5 steps, there are 2 deployment possibilities: Standard or Expedited. See below and choose the right choice for your work.

- Standard: Wait until the normal production deploy which takes place every 2 weeks on Wednesday afternoon. This is the best choice and should be used unless the work is extremely time sensative.
- Expedited: Sometimes things just need to go to `prod` immediately. If this is the case follow the steps listed [in this doc](https://slack-files.com/T02C3F91X-FD2HHNMT7-c6400a04c1) or reachout to a Bearsharks team member.

### Editing Meta Data (in the codebase)

There will be times when you might want to provide custom meta data for page that lives in the repo (think /oakley). Simple add this block to your front matter above the last `---`:

```yaml
meta:
  title: My Amazing Page
  description: You won't believe how amazing this page is.
  image:
    url: "https://amazing-photos.net/cool"
```

**Note: indentation matters in `yaml`. Make sure you follow the pattern above.**

## Requesting Content

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
<img
  src="{{ page.image | imgix: site.imgix }}?{{ site.imgix_params.placeholder }}"
  sizes="{{ site.image_sizes.full_width }}"
  data-optimize-img
/>
```

This would translate to something like the following (before processing):

```html
<img
  src="//crds-media-int.imgix.net/5G62zla1zOsmKqSo8wmomI/d46b0ec8a96339c72f25b56b7c2dd99b/isle-of-skye.jpg?auto=format,compress&w=10"
  sizes="100vw"
  data-optimize-img
/>
```

**Background Images**
Background images work similarly, with three exceptions:

- A `data-optimize-bg-img` attribute is required for processing.
- The dimensions of the imgix image are set automatically based on the container (i.e. it assumes a _cover_ background approach).
- The script watches for changes to the size of the window and will update the background image appropriately.

## Shared Templates

We’re using submodules to share files across multiple Jekyll instances. You can think of a submodule as a repository within a repository. The same rules that govern your interaction with a Git repo apply here. You’ll make commits against the submodule and then another commit against the parent project which is tracking the position of the submodule.
When you first clone a repository with submodules, you’ll need to initialize and the pull in the latest changes. Like so…

```bash
$ git clone git@github.com:crdschurch/crds-net.git
Cloning into 'crds-net'...
remote: Enumerating objects: 71, done.
remote: Counting objects: 100% (71/71), done.
remote: Compressing objects: 100% (63/63), done.
remote: Total 6544 (delta 27), reused 32 (delta 8), pack-reused 6473
Receiving objects: 100% (6544/6544), 4.07 MiB | 7.93 MiB/s, done.
Resolving deltas: 100% (3877/3877), done
$ cd crds-net
$ git submodule init
Submodule '_pages' (git@github.com:crdschurch/crds-jekyll-shared-templates.git) registered for path '_pages'
$ git submodule update
Cloning into '/Users/tcmacdonald/Sites/tmp/crds-net/_pages'...
Submodule path '_pages': checked out '995bfc915e66962451107f29d69ad8e4d19fe840'
```

As you can see from the above, the `_pages` directory of our project now contains the contents of the [crdschurch/crds-jekyll-shared-templates](https://github.com/crdschurch/crds-jekyll-shared-templates/tree/_pages) repository’s `_pages` branch. You can edit the contents of this directory like normal. When you’re ready to commit your work, you’ll want to make a commit relative to the `_pages` directory and push it up the [crdschurch/crds-jekyll-shared-templates](https://github.com/crdschurch/crds-jekyll-shared-templates/tree/_pages) repository’s `_pages` branch. Then you’ll need to make one more commit within the parent project so we can track the current state of our submodule.

```bash
$ cd _pages
$ git checkout _pages
$ git commit -am “Did something”
[_pages c5337c2] Did something
 Date: Mon Dec 17 08:50:25 2018 -0500
$ git push origin _pages
Counting objects: 2, done.
Delta compression using up to 12 threads.
Compressing objects: 100% (1/1), done.
Writing objects: 100% (2/2), 3.59 KiB | 3.59 MiB/s, done.
Total 2 (delta 1), reused 1 (delta 1)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To github.com:crdschurch/crds-jekyll-shared-templates.git
 + 995bfc9...c5337c2 _pages -> _pages
$ cd ../
$ git status -s
 M _pages
$ git commit -am "Update _pages submodule"
[feature/US15878-shared-templates-v2 95469de] Update _pages submodule
 1 file changed, 1 insertion(+), 1 deletion(-)
```

## License

This project is licensed under the [3-Clause BSD License](https://opensource.org/licenses/BSD-3-Clause).
