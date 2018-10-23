require_relative '../utils/colorized_string'
require 'csv'

module CRDS
  class RedirectWriter

    attr_accessor :output, :src, :dest, :csv, :debug, :redirs

    def initialize(dest_dir=nil)
      FileUtils.mkdir_p dest_dir unless dest_dir.nil?
      @dest = File.join(dest_dir || Dir.pwd, '_redirects')
      @src = File.join(Dir.pwd, 'redirects.csv')
      @redirs = []
      @total = 0
      @debug = true
      setup()
    end

    def setup
      @csv = CSV.read(src)
      @redirs = @csv.collect do |row|
        Redirect.new(row)
      end
    end

    def write!
      log "Writing _redirects...", :green
      @output = File.new(@dest, "w")
      @redirs.each do |redir|
        if redir.context_included?
          printf colorized_s, redir.path, redir.dest, redir.status if @debug
          @output.puts(redir.to_s)
        else
          log "\s\s#{redir.error}", :red
        end
        @total += 1
      end
      @output.close
      log "#{@total} rows written to _redirects file", :green
    end

    private

      # Returns the length of the longest lines in our CSV
      # so we can format the build output real nice
      def tabs
        [
          Redirect.replace(@csv.collect(&:first).max_by(&:length)).length + 3,
          Redirect.replace(@csv.collect{|row| row.drop(1).each_slice(2).map(&:first) }.flatten.max_by(&:length)).length + 15
        ]
      end

      def colorized_s
        ColorizedString.new("\s\s%-#{tabs[0]}s %-#{tabs[1]}s %s\n").send(:yellow)
      end

      def log(str, color=nil)
        if @debug
          STDOUT.write color ? ColorizedString.new(str).send(color) : str
          STDOUT.write("\n")
        end
      end

      class Redirect
        attr_accessor :path, :dest, :status, :context

        def initialize(csv)
          @path, @dest, @status, @context = csv
        end

        def to_s
          path = self.class.replace(@path)
          dest = self.class.replace(@dest)
          "#{path}\t#{dest}\t#{@status}"
        end

        def context_included?
          @context.nil? || @context.split(',').include?(deployment_context)
        end

        def deployment_context
          if ENV['CONTEXT'].nil? || ENV['CONTEXT'] == 'production'
            ENV['BRANCH'].nil? ? self.class.git_branch : ENV['BRANCH']
          elsif ENV['CONTEXT'] == 'deploy-preview'
            # If deploy preview, build against 'development' branch
            'development'
          else
            ENV['CONTEXT']
          end
        end

        def error
          unless context_included?
            if deployment_context.nil?
              "#{@path} specified context but none was defined."
            else
              "#{@path} did not match context '#{deployment_context}'."
            end
          end
        end

        def self.replace(str)
          if matches = str.match(/(\$\{env\:(.*)})/)
            str.gsub matches[1], ENV[matches[2]]
          else
            str
          end
        rescue
          str
        end

        def self.git_branch
          `git rev-parse --abbrev-ref HEAD | tr -d '\n'`
        end

      end

  end
end