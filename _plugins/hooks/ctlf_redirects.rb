require 'pry'

Jekyll::Hooks.register(:site, :post_read) do |site|
  # old redirects CSV
  file_path = './redirects.csv'
  redirects_file = File.read(file_path)

  # split file on \n and remove first line
  split_redirects = redirects_file.split("\n")
  first_line = split_redirects.shift
  first_line = first_line + "\n"

  # add newlines and join back into string
  redirects_minus_first = split_redirects.join("\n")

  # get all redirects from Contentful
  ctfl_redirects = site.collections["redirects"].docs

  # create empty string to store redirects
  parsed_ctfl_redirects = "";

  # loop through ctfl redirects and get contents
  x = 0
  while x < ctfl_redirects.size
    from_link = ctfl_redirects[x].data['from']
    to_link = ctfl_redirects[x].data['to']
    
    # if no type, default to 302 temp redirect
    type = ctfl_redirects[x].data['type'] || 302
    parsed_ctfl_redirects << from_link + ',' + to_link + ',' + type.to_s + "\n"
    x += 1
  end

  # write final file = first line from old file, new 
  File.open('./tmp/redirects.csv', 'w+') { |f| f.write(first_line, parsed_ctfl_redirects, redirects_minus_first) }
end
