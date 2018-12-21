require 'json'
enabled = ARGV.include?('--update-search-index')

if enabled
  @client = Jekyll::Cloudsearch::Client.new
  Jekyll::Hooks.register :documents, :post_render do |doc|
    @client.add_document(doc)
  end

  Jekyll::Hooks.register :site, :post_write do |site|
    Jekyll.logger.info('AWS Cloudsearch:', "#{@client.docs.size} static pages")

    system_pages = './system-pages.json'
    if File.exists?(system_pages)
      json = JSON.parse(File.read(system_pages))
      docs = json.dig('systemPages').collect do |page|
        url = page.dig('uRL')
        if url.present?
          doc = {
            id: "SP_#{page.dig('id')}",
            type: "add",
            fields: {
              title: page.dig('title'),
              content: ::Nokogiri::HTML(page.dig('description'), &:noblanks).text,
              link: page.dig('uRL'),
              type: 'SystemPage'
            }
          }
          @client.docs.push(doc)
          doc
        end
      end.compact
      Jekyll.logger.info('AWS Cloudsearch:', "#{docs.size} system pages")
    end

    Jekyll.logger.info('AWS Cloudsearch:', "Writing... #{@client.send(:filename)}")
    @client.instance_variable_set('@site', site)
    @client.write
    resp = @client.upload
    Jekyll.logger.info('AWS Cloudsearch:', resp)
  end
end
