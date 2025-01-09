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
        puts "Warning: No valid source file found for '#{page.url}' among these candidates:"
        candidates.each { |c| puts "  - #{c}" }
        next
      end

      dest_filename = page.name

      dest_path = File.join(static_output_dir, dest_filename)

      FileUtils.mkdir_p(File.dirname(dest_path))

      FileUtils.cp(source_path, dest_path)
      puts "Copied: #{source_path} -> #{dest_path}"
    end
  end
end
