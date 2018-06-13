# CRDS-NET
## A Static Site Generator for crossroads.net

## Setup

### Mac
To get started with this project, first make sure you have Ruby installed. This
project requires the use of Ruby version >= 2.5.1. If you are on a Mac, Ruby should
already be installed but you may need to upgrade your version. rbenv is a great tool
to manage your Ruby versions. You can read about that
[here](https://github.com/rbenv/rbenv#installation).

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
First, make sure you have Ruby installed on your machine. There is a proven guide
for getting Ruby installed on your machine that you can read
[here](https://gorails.com/setup/windows/10#ruby). This particular
guide only needs to be followed up until the `Configuring Git` heading. Everything
from `Configuring Git` onward is unnecessary to follow.

At this point you are ready to build the project:

`bundle exec jekyll serve`

This will build the site and start up a preview server that allows you to view the
work that you have done.
