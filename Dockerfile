# Use Ruby 2.7 as base image (compatible with Jekyll 4.0)
FROM --platform=linux/amd64 ruby:2.7-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    python \
    make \
    g++ \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 12.5
RUN curl -fsSL https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@6

# Install the correct Bundler version
RUN gem install bundler:2.4.18

# Copy the entire project first
COPY . .

# Clean install Node.js dependencies with node-sass
RUN rm -rf node_modules package-lock.json && \
    npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm uninstall node-sass bootstrap-sass && \
    npm install node-sass@4.14.1 bootstrap-sass@3.4.1 --save-dev && \
    npm rebuild node-sass --force && \
    npm install gulp-cli -g

# Install Ruby dependencies
RUN bundle install

# Expose port 4000 for Jekyll server
EXPOSE 4000

# Start Jekyll server with force polling for better file watching in Docker
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--force_polling"] 