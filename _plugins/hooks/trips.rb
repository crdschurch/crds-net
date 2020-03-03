Jekyll::Hooks.register :site, :post_read do |site|
  include ActiveSupport::Inflector
  site.collections['trips'].docs.each do |trip|
    trip.data['country_slug'] = trip.data['country'].parameterize
  end
end

