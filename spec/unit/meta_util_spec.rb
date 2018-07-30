require 'spec_helper'
require_relative '../../_plugins/filters/meta_util'

describe 'Html Meta Util' do

  before do
  end


  it 'should return the page meta_image url' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        'https://page-meta-image.jpg',
        'https://page-image.jpg',
        'https://page-bg-image.jpg',
        '<p><div>Some text and stuff</div><div>< img src="https://page-content-image.jpg"></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-meta-image.jpg'
  end


  it 'should return the page image url' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        nil,
        'https://page-image.jpg',
        'https://page-bg-image.jpg',
        '<p><div>Some text and stuff</div><div>< img src="https://page-content-image.jpg"></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-image.jpg'
  end


  it 'should return the page background image url' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        nil,
        nil,
        'https://page-bg-image.jpg',
        '<p><div>Some text and stuff</div><div>< img src="https://page-content-image.jpg"></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-bg-image.jpg'
  end


  it 'should return the 1st image in the page content with single quotes' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        nil,
        nil,
        nil,
        '<p><div>Some text and stuff</div><div>< img src="https://page-content-image.jpg"></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-content-image.jpg'
  end


  it 'should return the 1st image in the page content with single quotes' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        nil,
        nil,
        nil,
        '<p><div>Some text and stuff</div><div>< img src=''https://page-content-image.jpg''></div><div><img src=''https://page-content-image-2.jpg''></div></p>',
        'https://site-image.jpg')).to eq 'https://page-content-image.jpg'
  end


  it 'should return the 1st image in the page content without quotation marks and has leading/trailing spaces' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        nil,
        nil,
        nil,
        '<p><div>Some text and stuff</div><div>< img src=  https://page-content-image.jpg  ></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-content-image.jpg'
  end


  it 'should return the site image b/c the page content has no image' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        nil,
        nil,
        nil,
        '<p><div>Some text and stuff</div><div></div><div></div></p>',
        'https://site-image.jpg')).to eq 'https://site-image.jpg'
  end

  context 

  it 'should return the site image url' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        nil,
        nil,
        nil,
        nil,
        'https://site-image.jpg')).to eq 'https://site-image.jpg'
  end


  it 'should return the site image url when all other options are empty strings' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        '',
        '',
        '',
        '',
        'https://site-image.jpg')).to eq 'https://site-image.jpg'
  end


  it 'should return the site image url with https: prepended' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        nil,
        nil,
        nil,
        nil,
        '//site-image.jpg')).to eq 'https://site-image.jpg'
  end


  it 'should return the relative site image url as is' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        nil,
        nil,
        nil,
        nil,
        '/site-image.jpg')).to eq '/site-image.jpg'
  end


  it 'should return the site image url when all other options are white space' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_image(
        "     \t\r\n   ",
        "     \t\r\n   ",
        "     \t\r\n   ",
        "     \t\r\n   ",
        'https://site-image.jpg')).to eq 'https://site-image.jpg'
  end


  it 'should return the page meta description' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_description(
        'Page meta description',
        'Page description',
        'Site description'
      )).to eq 'Page meta description'
  end


  it 'should return the page description when meta description is nil' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_description(
        nil,
        'Page description',
        'Site description'
      )).to eq 'Page description'
  end


  it 'should return the page description when meta description is an empty string' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_description(
        '',
        'Page description',
        'Site description'
      )).to eq 'Page description'
  end


  it 'should return the page description when meta description is white space' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_description(
        "    \t\r\n    ",
        'Page description',
        'Site description'
      )).to eq 'Page description'
  end


  it 'should return the site description when page description is nil' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_description(
        nil,
        nil,
        'Site description'
      )).to eq 'Site description'
  end


  it 'should return the site description when page description is an empty string' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_description(
        nil,
        '',
        'Site description'
      )).to eq 'Site description'
  end


  it 'should return the site description when page description is white space' do
    expect(
      Jekyll::CRDS::MetaUtil.get_meta_description(
        nil,
        "    \t\r\n    ",
        'Site description'
      )).to eq 'Site description'
  end


  # would love to strip_html, strip_newlines and truncate in the Ruby code directly to simplify
  # declarative expression in the liquid template, but... i don't know how yet in a clean way
  # that could potentially leverage the "helpers"/filters already provided
  # it 'should return a site description truncated to 155 characters at the nearest word' do
  #   expect(
  #     Jekyll::CRDS::MetaUtil.get_meta_description(
  #       nil,
  #       nil,
  #       nil,
  #       "Let's write some text that exceeds 155 characters. It needn't be meaningful text, so we'll blather on a bit. Getting close now, but not quite there yet. Now we have exceeded. Great job, team!"
  #     )).to eq "Let's write some text that exceeds 155 characters. It needn't be meaningful text, so we'll blather on a bit. Getting close now, but not quite there yet...."
  # end


end