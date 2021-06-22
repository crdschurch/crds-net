module TripPartnerImg
  class Generator < Jekyll::Generator
    def generate(site)
      trips = site.collections['trips'].docs
      trips.each do |trip|
        id = trip.data.dig('partner') ? trip.data.dig('partner').first['id'] : ''
        trip_partner = site.collections['trip_partners'].docs.detect{ |doc| doc.data.dig('contentful_id') == id}
        if trip_partner.present?
          trip.data['trip_partner_img'] = (trip_partner.data.dig('partner_image', 'url'))
        end
      end
    end
  end
end
