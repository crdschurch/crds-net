module Jekyll
  class PublicPeopleGenerator < Generator
    priority :highest

    def generate(site)
      people = site.collections['people']&.docs || []
      return if people.empty?

      site.collections['people'].docs.select! do |person|
        author_like_person?(person)
      end
    end

    private

    def author_like_person?(person)
      Array(person.data['roles']).compact.include?('Author')
    end
  end
end
