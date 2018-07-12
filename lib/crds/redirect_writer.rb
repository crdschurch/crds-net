require_relative '../utils/colorized_string'
require 'csv'

module CRDS
  class RedirectWriter

    attr_accessor :output, :src, :csv

    def initialize(dest_dir=nil)
      FileUtils.mkdir_p dest_dir unless dest_dir.nil?
      @output = File.new(File.join(dest_dir || Dir.pwd, '_redirects'), "w")
      @src = File.join(Dir.pwd, 'redirects.csv')
    end

    def write!(silence=false)
      log "Writing _redirects...", :green unless silence

      i = 0
      @csv = CSV.read(src)

      # Compute length of tabs for formatting STDOUT
      tabs = [
        replace(@csv.collect(&:first).max_by(&:length)).length + 3,
        replace(@csv.collect{|row| row.drop(1).each_slice(2).map(&:first) }.flatten.max_by(&:length)).length + 3
      ]

      @csv.each do |row|
        path, dest, status = row
        dest = replace(dest)

        printf ColorizedString.new("\s\s%-#{tabs[0]}s %-#{tabs[1]}s %s\n").send(:yellow), path, dest, status unless silence
        @output.puts("#{path}\t#{dest}\t#{status}")
        i += 1
      end

      log "#{i} rows written to _redirects file", :green unless silence
      @output.close
    end

    private

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
        STDOUT.write color ? ColorizedString.new(str).send(color) : str
        STDOUT.write("\n")
      end

  end
end