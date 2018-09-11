Jekyll::Hooks.register(:site, :after_init) do |_site|
  # Before we begin building, delete any lingering CSS files. This ensures we
  # don't purge the incorrect file.
  Dir.glob('_site/assets/*.css').each { |f| File.delete(f) }
end

Jekyll::Hooks.register(:site, :post_write) do |_site|
  # Temp file to store options. Command line would not accept a series of
  # whitelist classes, and there are a few classes purgecss is missing.
  config_file = 'tmp/purgecss.js'
  # Make sure the tmp directory exists.
  FileUtils.mkdir('tmp') unless Dir.exist?('tmp')
  # Delete existing config file, if it exists.
  File.delete(config_file) if File.exist?(config_file)
  # Configuration JS to write to the file. (Docs: https://www.purgecss.com/configuration)
  config_text = """module.exports = #{{
    content: ['_site/**/*.html'],
    css: [Dir.glob('_site/assets/*.css').first],
    whitelist: %w(pull-right border-bottom flickity-viewport tmp-img-placeholder card-deck--expanded-layout carousel-cell)
  }.stringify_keys.to_json}"""
  # Write configuration file.
  File.open(config_file, 'w+') { |f| f.write(config_text) }
  # Run purgecss command.
  system("purgecss --config #{config_file} --out _site/assets")
end
