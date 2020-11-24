require 'active_support'
require_relative '../../lib/crds/has_many'

Jekyll::Hooks.register(:site, :post_read) do |site|
  ::CRDS::HasMany.new(site).run!
end