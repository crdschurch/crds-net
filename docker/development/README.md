# Build and Serve locally with Docker

The Dockerfile in this folder provides a development environment for crds-net that can be set up and used the same way on any OS. With it, a user can build and serve the crds-net site locally without needing to install Node.js and Ruby. 

## Setup and First Run
Start by getting all your code...
1. Clone the repo: `git clone https://github.com/crdschurch/crds-net.git` then `cd ./crds-net`
2. Initialize and update submodules: `git submodule init && git submodule update`. Issues? see the submodules section in the in [main readme](../README.md) for help.

...And your environment variables...
1. Make a copy of the `.env-sample` file and name it `.env`, then assign the environment variable values in it. The main README has more details about environment variables.

...And finally setup Docker and run the darn thing.
1. Install and start Docker, their [docs](https://docs.docker.com/get-docker/) have instructions for each OS. You'll also need to register for a Docker Hub account.
2. Navigate to the /docker/development folder (`cd ./docker/development`)
3. Build the Docker container with `$docker-compose build`. The first time you run this it'll take a loooong time because it's downloading and installing Node.js, Ruby and all the packages crds-net needs to build and serve. Once it's been built, this command will only need to be re-run if a npm or Ruby package changes, and that build will be much faster because of Docker caching.
4. Start the Docker container with `$docker-compose up`. By default this runs the `/bin/local-build-command.sh` script which fetches Contentful content then builds and serves the site. This step also takes a few minutes, but you'll know it's ready when you see `Server running... press ctrl-c to stop.` in the command line.
5. Access the site at `localhost:4000`

By default the server will listen for file changes and automatically rebuild and re-serve the site without needing to restart the server. It takes a minute or so to rebuild the site, so be patient!

Once you're done, stop the Docker container to stop the server with `$ctrl + c`

## Second Run and Beyond

- Docker containers persist once you've stopped them, so to re-start the server you'll just need to run `$docker-compose up` again and wait until the command line indicates the server is running. You do not need to run `$docker-compose build` again unless a Node or Ruby package has changed, or the container has been manually removed.
- Each time the container starts it will run the `local-build-command.sh` and fetch Contentful content. If you're stopping and starting the server often and don't want to do that step each time, uncomment the "endpoint" line in the [docker-compose.yml file](./docker-compose.yml) which will override the default startup command and start the server without fetching from Contentful.

## Maintaining the Dockerfile
- The Dockerfile uses node as it's base image, so to update node you'll need to change the `FROM node:10.15.3` line to match the image and version you want. We're using the official node image from Docker Hub found [here](https://hub.docker.com/_/node/) - check out the Tags section for more options. Once changed, the container will need to be re-built.
- Ruby is installed on top of the node image using the same script as the official Ruby docker image. To update that version, change the `RUBY_MAJOR`, `RUBY_VERSION` and `RUBY_DOWNLOAD_SHA256` ENV variables in the Dockerfile to what you want. Once changed, the container will need to be re-built.

## Details for the Curious
### What's with --host 0.0.0.0?
There's a quirk with Windows 10 where Jekyll sites served on docker are not accessible from the host machine unless the site is served on host 0.0.0.0. To confuse things more, the host machine still accesses the site from "localhost:4000".
I don't know if this workaround is necessary for Mac/Linux machines, but if the container says the server's running and "localhost:4000" isn't showing anything, add `command: [""]` to the `docker-compose.yml` file and re-run `$docker-compose up`.