require 'spec_helper'

describe 'Jekyll::SignOffGenerator' do

  def scaffold_site(*collections)
    @site = JekyllHelper.scaffold(
      collections_dir: File.expand_path('../support/collections', __dir__),
      collections: collections
    )
    @generator = Jekyll::SignOffGenerator.new
    @generator.generate(@site)
  end

  it 'adds the sign off to the global site object' do
    scaffold_site('sign_offs')
    expect(@site.collections['sign_offs'].size).to eq(1)
    expect(@site.config['sign_off'].nil?).to eq(false)
    expect(@site.config['sign_off'].title).to eq('Article Main')
  end

  it 'adds sign off as a nil value even if there is no sign off' do
    scaffold_site
    expect(@site.collections['sign_offs'].size).to eq(0)
    expect(@site.config['sign_off'].nil?).to eq(true)
  end

end
