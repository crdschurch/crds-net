
require 'contentful/management'
require 'pry'

client = Contentful::Management::Client.new(ENV['CONTENTFUL_MANAGEMENT_TOKEN'])
environment = client.environments('y3a9myzsdjan').find('int')
systempages = environment.content_types.find('system_page')


# new_entry.save
# new_entry.publish

data = File.read("system-pages.json")
json = JSON.parse(data)

json['systemPages'].each do |entry|
  legacy = entry['legacyStyles'].to_i > 0
  if entry['image']
    puts entry['image']['id']
  end
  # new_entry = systempages.entries.create(title: entry['title'], url: entry['uRL'], description: entry['description'], stateName: entry['stateName'], legacyStyles: legacy)
  # new_entry.save
  # new_entry.publish
end
