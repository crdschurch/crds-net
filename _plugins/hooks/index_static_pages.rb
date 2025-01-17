require 'nokogiri'
require 'digest'
require 'json'
require 'securerandom'
require 'algolia'

module ObjectIDGenerator
  CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.chars.freeze
  BASE = CHARS.length

  def self.encode(number)
    return CHARS[0] if number == 0
    encoded = ''
    while number > 0
      remainder = number % BASE
      encoded = CHARS[remainder] + encoded
      number /= BASE
    end
    encoded
  end
end

# Copy static pages to the _site_static directory
Jekyll::Hooks.register :site, :post_write do |site|
  static_output_dir = "_site_static"
  FileUtils.mkdir_p(static_output_dir)

  site.pages.each do |page|
    if page.data['static'] == true
      base_path = File.join(site.dest, page.url)
      candidates = []

      if File.extname(page.url) == ".html"
        candidates << base_path
      else
        unless page.url.end_with?("/")
          candidates << "#{base_path}.html"
        end
      end

      candidates << File.join(base_path, "index.html")
      candidates.uniq!

      source_path = candidates.find { |candidate| File.file?(candidate) }

      unless source_path
        puts "Warning: No valid source file found for '#{page.url}' among these candidates for static page indexing:"
        candidates.each { |c| puts "  - #{c}" }
        next
      end

      dest_filename = page.name
      dest_path = File.join(static_output_dir, dest_filename)

      FileUtils.mkdir_p(File.dirname(dest_path))
      FileUtils.cp(source_path, dest_path)
      puts "Copied: #{source_path} -> #{dest_path} for static page indexing"
    end
  end
end

# Parse static pages for Algolia indexing
Jekyll::Hooks.register :site, :post_write do |site|
  directory_path = File.join(site.source, '_site_static')
  html_files = Dir.glob(File.join(directory_path, '**', '*.html'))

  records = []

  html_files.each do |file_path|
    doc = Nokogiri::HTML(File.read(file_path))

    # Use the <meta name="title"> tag as the title
    raw_title = doc.at('meta[name="title"]')&.attr('content') || "Untitled"
    title = raw_title.gsub(/\s*\|\s*Crossroads( Church)?/, "").strip

    # Extract and clean up the slug
    slug = File.basename(file_path, '.html')
    slug = "/#{slug}"

    # Generate an objectID using a hash of the slug
    slug_hash = Digest::MD5.hexdigest(slug).to_i(16)
    objectID = ObjectIDGenerator.encode(slug_hash)[0...22]

    description = doc.at('meta[name="description"]')&.attr('content') || ""
    image       = doc.at('meta[name="image"]')&.attr('content') || ""

    record = {
      objectID: objectID,
      title: title,
      description: description,
      image: image,
      slug: slug,
      contentType: "page"
    }

    records << record
  end

  algolia_app_id     = ENV['ALGOLIA_APP_ID']
  algolia_api_key    = ENV['ALGOLIA_API_KEY']
  algolia_index_name = ENV['ALGOLIA_INDEX_NAME']

  if algolia_app_id.nil? || algolia_api_key.nil? || algolia_index_name.nil?
    puts "Error: Missing Algolia configuration. Please set ALGOLIA_APP_ID, ALGOLIA_API_KEY, and ALGOLIA_INDEX_NAME."
    exit(1)
  end

  puts "algolia_app_id: #{algolia_app_id}"
  puts "algolia_api_key: #{algolia_api_key}"
  puts "algolia_index_name: #{algolia_index_name}"

  begin
    client = Algolia::Search::Client.create(algolia_app_id, algolia_api_key)
    index  = client.init_index(algolia_index_name)
    index.save_objects(records)

    puts "Successfully indexed #{records.size} records to Algolia index '#{algolia_index_name}'."
  rescue StandardError => e
    puts "Error during indexing: #{e.message}"
  end
end
