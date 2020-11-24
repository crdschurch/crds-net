require 'active_support/core_ext/hash'

class JekyllHelper

  class << self

    attr_reader :options

    def scaffold(opts = {})
      @options = opts
      # We don't need to read Jekyll's logs while running the specs.
      Jekyll.logger.adjust_verbosity(quiet: true)
      # Sets our options. The defaults in place suggest we're working only with
      # articles in the crds-media project, but that be adjusted based on the
      # spec's needs.
      default_opts = default_scaffold_options(options[:base_path])
      @options = options.deep_symbolize_keys.reverse_merge(default_opts)
      # Initialize the site after merging Jekyll's default config with the
      # spec's options.
      site = Jekyll::Site.new(jekyll_config)
      # Read only the collections necessary for the spec. Limiting the site to
      # only read the necessary collection drasticaly speeds up the suite.
      options[:collections].each { |key| site.collections[key].read }
      # Return the site instance to the spec.
      site
    end

    private

    def default_scaffold_options(base_path = nil)
      # By default, we work within the crds-media's root directory. All other
      # directory config options are derived from this option, although they can
      # be overridden indivudally.
      base_path ||= File.expand_path('../../', __dir__)
      {
        collections_dir: File.join(base_path, 'collections'),
        collections: %w(articles),
        config_file: File.join(base_path, '_config.yml'),
        destination_path: File.join(base_path, '_site'),
        source_path: base_path
      }
    end

    def jekyll_config
      # Jekyll's default configuration.
      default_config = Jekyll::Configuration::DEFAULTS
      # Site configuration. This defaults to the crds-media site's config file.
      site_config = Jekyll::Configuration.new.read_config_file(options[:config_file])
      # Optional overrides. These come in handy when the spec needs to change
      # one of these values and doesn't want to rewrite the entire config file.
      config_overrides = {
        "collections_dir" => options[:collections_dir],
        "destination" => options[:destination_path],
        "source" => options[:source_path]
      }
      # Option to override config values directly rather than reading an entire
      # file.
      config_overrides.merge!((@options[:config_overrides] || {}).deep_stringify_keys)
      # Merge the overrides into the site's config
      site_config.merge!(config_overrides)
      # Merge the site's config into Jekyll's default config and return the
      # result.
      Jekyll::Utils.deep_merge_hashes(default_config, site_config)
    end
  end


end