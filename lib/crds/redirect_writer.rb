require_relative '../utils/colorized_string'
require 'csv'

module CRDS
  class RedirectWriter

    attr_accessor :output, :src, :csv, :debug

    def initialize(dest_dir=nil)
      FileUtils.mkdir_p dest_dir unless dest_dir.nil?
      @output = File.new(File.join(dest_dir || Dir.pwd, '_redirects'), "w")
      @src = File.join(Dir.pwd, 'redirects.csv')
      @total = 0
      @debug = true
    end

    def write!
      log "Writing _redirects...", :green
      @csv = CSV.read(src)
      @csv.map{|row| parse_row(row) }
      @output.close
      log "#{@total} rows written to _redirects file", :green
    end

    private

      def parse_row(row)
        path, dest, status = row
        dest = replace(dest)
        printf colorized_s, path, dest, status if @debug
        @output.puts("#{path}\t#{dest}\t#{status}")
        @total += 1
      end

      # Returns the length of the longest lines in our CSV
      # so we can format the build output real nice
      def tabs
        [
          replace(@csv.collect(&:first).max_by(&:length)).length + 3,
          replace(@csv.collect{|row| row.drop(1).each_slice(2).map(&:first) }.flatten.max_by(&:length)).length + 3
        ]
      end

      def colorized_s
        ColorizedString.new("\s\s%-#{tabs[0]}s %-#{tabs[1]}s %s\n").send(:yellow)
      end

      def replace(str)
        if matches = str.match(/(\$\{env\:(.*)})/)
          str.gsub matches[1], ENV[matches[2]]
        else
          str
        end
      rescue
        str
      end

      def log(str, color=nil)
        if @debug
          STDOUT.write color ? ColorizedString.new(str).send(color) : str
          STDOUT.write("\n")
        end
      end

  end
end