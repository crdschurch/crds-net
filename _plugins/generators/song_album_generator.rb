module GetSongAlbum
  class Generator < Jekyll::Generator
    def generate(site)
      albums = site.collections['albums'].docs
      songs = site.collections['songs'].docs
      song_ids = Hash[albums.collect do |album|
        [album.data['slug'], album.data['songs'].collect{|song| song['id']}]
      end]
      songs.each do |song|
        slug = song_ids.keys.detect{|id| song_ids[id].include?(song.data['id'])}
        song.data['album_slug'] = slug
        song.data['album_url'] = "#{ENV['CRDS_MUSIC_ENDPOINT'].chomp('/')}/music/#{slug}/#{song.data['slug']}"
      end
    end
  end
end