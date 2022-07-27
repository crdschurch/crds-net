module Jekyll
  class SortedPodcastsGenerator < Jekyll::Generator

    def generate(site)
      # Collect all podcast episodes that have a published_at date.
      episodes = site.collections['episodes'].docs.reject { |e| e.data['published_at'].nil? }
      # Sort episodes by most recently published first.
      episodes.sort_by! { |e| e.data['published_at'] }.reverse!
      # Collect (Contentful) id values for each episode's associated podcast,
      # remove nil and duplicate items.
      podcast_ids = episodes.collect { |e| e.data['podcast']['id'] }.uniq.reject(&:nil?)
      # Reference to all podcasts.
      all_podcasts = site.collections['podcasts'].docs
      # Find the appropriate podcast by (Contentful) id.
      podcasts = podcast_ids.map { |id| all_podcasts.detect { |p| p.data['id'] == id } }
      # Append the missing podcasts to the list.
      podcasts += (all_podcasts - podcasts).sort_by { |p| p.data['title'].downcase }

      featured_title = "Crossroads Messages"
      featured = podcasts.detect{|pod, i|  pod['title'].include?(featured_title) }
      podcasts = podcasts.filter{|p| !p['title'].include?(featured_title) }.unshift(featured)

      # Store the collection on the site config object.
      site.config['ordered_podcasts'] = podcasts
    end

  end
end
