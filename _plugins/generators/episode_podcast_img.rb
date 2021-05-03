module EpisodePodcastImg
  class Generator < Jekyll::Generator
    def generate(site)
      episodes = site.collections['episodes'].docs
      episodes.each do |episode|
        id = episode.data.dig('podcast', 'id')
        podcast = site.collections['podcasts'].docs.detect{ |doc| doc.data.dig('contentful_id') == id}
        if podcast.present?
          episode.data['podcast_img'] = (podcast.data.dig('image', 'url'))
        end
      end
    end
  end
end
