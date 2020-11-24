require 'sass'
require 'bootstrap-sass'

module CRDS
  module Styles
    class << self
      def load!
        register_sprockets if sprockets?
        configure_sass
      end

      def gem_path
        @gem_path ||= File.expand_path('..', File.dirname(__FILE__))
      end

      def stylesheets_path
        File.join(assets_path, 'stylesheets')
      end

      def assets_path
        @assets_path ||= File.join(gem_path, 'assets')
      end

      def sprockets?
        defined?(::Sprockets)
      end

      private

      def configure_sass
        ::Sass.load_paths << stylesheets_path
      end

      def register_sprockets
        Sprockets.append_path(stylesheets_path)
      end
    end
  end
end

CRDS::Styles.load!
Bootstrap.load!
