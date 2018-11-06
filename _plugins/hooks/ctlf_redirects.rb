Jekyll::Hooks.register(:site, :post_render) do |site|
  # read hardcoded redirects file & seperate into first line / rest of file
  file_path = './hardcoded-redirects.csv'
  redirects_file = File.read(file_path)
  split_redirects = redirects_file.split("\n")
  first_line = split_redirects.shift
  first_line = first_line + "\n"
  redirects_minus_first = split_redirects.join("\n")

  # gather all redirects from Contentful
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

  # write new redirects file only if new redirects appear
  current_file = File.read('./redirects.csv')
  new_file = first_line + parsed_ctfl_redirects + redirects_minus_first
  File.open('redirects.csv', 'w+') { |f| f.write(new_file) } unless new_file == current_file
end
