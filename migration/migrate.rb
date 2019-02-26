require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'contentful-management'
  gem 'csv'
  gem 'pry'
end


def extract_value(line)
  line[line.index(" ") + 1,line.index("\n")].chomp
end

if File.exist?("migrated-pages.csv")
  File.delete("migrated-pages.csv")
end

csv = CSV.open("migrated-pages.csv", "wb")
csv << ["title","permalink","layout","requires_auth", "entry_id"] #header

client = Contentful::Management::Client.new(ENV['CONTENTFUL_MANAGEMENT_TOKEN'])
environment = client.environments(ENV['CONTENTFUL_SPACE_ID']).find(ENV['CONTENTFUL_ENV'])
page = environment.content_types.find('page')

file_list = Dir["./../*.html"]

file_list.each do |file|
  frontmatter = true
  layout = nil
  title = nil
  permalink = nil
  file_content = '';
  loaded_page = File.open(file)
  requires_auth = false
  monetate_page_type = ''
  
  loaded_page.each do |line|
    if line.chomp == "---" && !title.nil?
      frontmatter = false
    end

    if frontmatter == true
      if line.include? "layout: "
        layout = extract_value(line)
      elsif line.include? "title: "
        title = extract_value(line)
      elsif line.include? "permalink: "
        permalink = extract_value(line)
      end
    elsif line.chomp != "---"
      file_content << line
    end
  end

  file_content << "<!-- migrated from crds-net -->"

  unless layout.nil? || title.nil? || permalink.nil? || layout == "default"
    begin
      entry = page.entries.create(
        title: title,
        permalink: permalink,
        body: file_content,
        layout: layout,
        search_excluded: false
      )

      entry.save
      entry.publish
      csv << [title, permalink, layout]
      puts "created #{title}"
    rescue => exception
      puts "Had an issue creating title: #{title} permalink: #{permalink}"
      next
    end
  end  
end
