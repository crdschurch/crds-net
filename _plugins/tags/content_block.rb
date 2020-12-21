module Jekyll
  class ContentBlockTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text.strip
    end

    def render(context)
      site = context.registers[:site]
      if content_block = site.collections['content_blocks'].docs.detect{|b| b.data['slug'] == @text}
        content_block.data.dig('content')
      end
    end
  end
end

Liquid::Template.register_tag('content_block', Jekyll::ContentBlockTag)