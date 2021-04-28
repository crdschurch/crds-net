require 'yaml'
require 'fileutils'

Jekyll::Hooks.register :site, :after_init do |site|
  collections_dir = File.join(site.config.dig('source'), site.config.dig('collections_dir'))
  articles_dir = File.join(collections_dir, '_articles')
  destination_dir = File.join(collections_dir, '_humans_of_crossroads')
  if File.exist?(articles_dir)
    # Create HOC dir if needed
    FileUtils.mkdir_p(destination_dir)
    # Iterate through articles
    Dir[File.join(articles_dir, '**/*.md')].collect do |source|
      # Parse the document's frontmatter
      yml = YAML.load_file(source)
      is_hoc = (yml.dig('collections') || []).collect{|c|c['slug'].gsub(/[^a-z\-]/,'')}.include?('humans-of-crossroads')
      # If this doc belongs to HOC
      if is_hoc
        destination = File.join(destination_dir, File.basename(source))
        # Move the file into the HOC collection dir
        FileUtils.mv(source, destination_dir)
      end
    end
  end
end