module Jekyll
  class SignOffGenerator < Generator

    def generate(site)
      site.config['sign_off'] = site.collections['sign_offs'].docs
        .select { |d| d.data['published_at'] }
        .sort_by { |d| d.data['published_at'] }
        .reverse.first
    end

  end
end
