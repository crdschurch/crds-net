module Jekyll
  class AudioArticleLinksGenerator < Jekyll::Generator
    def generate(site)
      episodes = site.collections['episodes'].docs
      episode_id_slug_hashes = episodes.map{ |episode| { id: episode["id"], slug: episode["slug"] }}
      articles = site.collections['articles'].docs
      articles.each do | article |
        if article["podcast_episode"] != nil
          episode_data = episode_id_slug_hashes.select{ |item| item[:id] == article["podcast_episode"]["id"] }.first
          slug = episode_data[:slug]
          if slug.present?
            audio_article_url = "https://www.crossroads.net/media/podcasts/audio-articles"
            if ENV["JEKYLL_ENV"] == "demo" || ENV["JEKYLL_ENV"] == "int"
              audio_article_url = "https://demo.crossroads.net/media/podcasts/audio-articles"
            end
            article.data['podcast_slug'] = "#{audio_article_url}/#{slug}"
          end
        end
      end
    end
  end
end
