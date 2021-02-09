require 'spec_helper'

describe Jekyll::ArticleTags::PageBuilder do

  before do
    @site = JekyllHelper.scaffold(
      collections_dir: File.expand_path('../support/collections', __dir__),
      collections: %w(articles categories tags)
    )
    @page_builder = Jekyll::ArticleTags::PageBuilder.new(@site)
  end

  it 'should build out an array of article categories and tags accessible to site config' do
    exp_article_filters = [
      {
        "category_title" => "Category A",
        "category_slug" => "cat-a",
        "category_url" => "/media/articles/filters/cat-a",
        "tag_title" => "Tag A1",
        "tag_slug" => "tag-a1",
        "title" => "Tag A1",
        "slug" => "cat-a+tag-a1",
        "url" => "/media/articles/filters/cat-a+tag-a1"
      },
      {
        "category_title" => "Category B",
        "category_slug" => "cat-b",
        "category_url" => "/media/articles/filters/cat-b",
        "tag_title" => "Tag B2",
        "tag_slug" => "tag-b2",
        "title" => "Tag B2",
        "slug" => "cat-b+tag-b2",
        "url" => "/media/articles/filters/cat-b+tag-b2"
      }
    ]
    expect(@site.config['article_filters']).to match_array(exp_article_filters)
  end

  it 'creates a page for categories with tags and for featured tags applied to an article' do
    exp_page_data = ['Tag A1', 'Tag B2', 'Category A', 'Category B']
    expect(@site.pages.collect { |p| p.data['title'] }).to match_array(exp_page_data)
  end

  it 'runs the paginator' do
    exp_doc_titles = [["Article A1 B1 X1"], ["Article B2"], ["Article A1 B1 X1"], ["Article B2"]]
    page_doc_titles = @site.pages.collect { |d| d.data['articles']['docs'].collect(&:title) }
    expect(page_doc_titles).to match_array(exp_doc_titles)
  end

end
