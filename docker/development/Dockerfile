FROM node:10.15.3

# Install Ruby
# To change versions you should just need to update the 3 ENV variables below
# SHA is for .tar.xz version. Found here https://www.ruby-lang.org/en/downloads/releases/
ENV RUBY_MAJOR 2.6
ENV RUBY_VERSION 2.6.2
ENV RUBY_DOWNLOAD_SHA256 91fcde77eea8e6206d775a48ac58450afe4883af1a42e5b358320beb33a445fa

# Below copied from the official Ruby docker image https://github.com/docker-library/ruby/blob/a564feaaee4c8647c299ab11d41498468bb9af7b/2.6/buster/Dockerfile
# some of ruby's build scripts are written in ruby
#   we purge system ruby later to make sure our final image uses what we just built
RUN set -eux; \
	\
	savedAptMark="$(apt-mark showmanual)"; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		bison \
		dpkg-dev \
		libgdbm-dev \
		ruby \
	; \
	rm -rf /var/lib/apt/lists/*; \
	\
	wget -O ruby.tar.xz "https://cache.ruby-lang.org/pub/ruby/${RUBY_MAJOR%-rc}/ruby-$RUBY_VERSION.tar.xz"; \
	echo "$RUBY_DOWNLOAD_SHA256 *ruby.tar.xz" | sha256sum --check --strict; \
	\
	mkdir -p /usr/src/ruby; \
	tar -xJf ruby.tar.xz -C /usr/src/ruby --strip-components=1; \
	rm ruby.tar.xz; \
	\
	cd /usr/src/ruby; \
	\
# hack in "ENABLE_PATH_CHECK" disabling to suppress:
#   warning: Insecure world writable dir
	{ \
		echo '#define ENABLE_PATH_CHECK 0'; \
		echo; \
		cat file.c; \
	} > file.c.new; \
	mv file.c.new file.c; \
	\
	autoconf; \
	gnuArch="$(dpkg-architecture --query DEB_BUILD_GNU_TYPE)"; \
	./configure \
		--build="$gnuArch" \
		--disable-install-doc \
		--enable-shared \
	; \
	make -j "$(nproc)"; \
	make install; \
	\
	apt-mark auto '.*' > /dev/null; \
	apt-mark manual $savedAptMark > /dev/null; \
	find /usr/local -type f -executable -not \( -name '*tkinter*' \) -exec ldd '{}' ';' \
		| awk '/=>/ { print $(NF-1) }' \
		| sort -u \
		| xargs -r dpkg-query --search \
		| cut -d: -f1 \
		| sort -u \
		| xargs -r apt-mark manual \
	; \
	apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
	\
	cd /; \
	rm -r /usr/src/ruby; \
# verify we have no "ruby" packages installed
	! dpkg -l | grep -i ruby; \
	[ "$(command -v ruby)" = '/usr/local/bin/ruby' ]; \
# rough smoke test
	ruby --version; \
	gem --version; \
	bundle --version

# Done installing Ruby (phew). Onto crds-net stuff

WORKDIR /crds-net

RUN gem install bundler jekyll --no-doc 

# Copy just the package files for js and ruby
COPY package*.json ./
COPY Gemfile* ./
ADD ./vendor/gems ./vendor/gems
ADD ./bin	./bin

# Don't install Cypress
ENV CYPRESS_INSTALL_BINARY 0 

# install packages
RUN npm ci 
RUN bundle install

# This script will be executed when container is started. Define an "entrypoint" in the docker-compose file to
#  override this default and ignore the CMD below.
ENTRYPOINT [ "./bin/local-build-command.sh" ]

# This value is appended to the default entrypoint command as its first argument.
#  There's a quirk with Windows 10 where Jekyll sites served on docker are not accessible on localhost
#  unless the site is served on host 0.0.0.0. To confuse things more, still use "localhost:4000" to 
#  access the site once it's served.
# I do not know if this workaround is necessary for Mac/Linux machines. If the site isn't accessible from "localhost:4000"
#  on those OSs with this default, add "command: [""]" to the docker-compose file to override this command.
CMD ["0.0.0.0"]
