require 'spec_helper'

describe 'Html Meta Util' do

  before do
  end

  it 'should return the page page_meta url' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        'https://page-meta.jpg',
        'https://page-meta-image.jpg',
        'https://page-image.jpg',
        'https://page-bg-image.jpg',
        '<p><div>Some text and stuff</div><div>< img src="https://page-content-image.jpg"></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-meta.jpg'
  end

  it 'should return the page meta_image url when there are no other valid values' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        'https://page-meta.jpg',
        nil,
        '',
        "     \t\r\n   ",
        '',
        nil)).to eq 'https://page-meta.jpg'
  end

  it 'should return the page meta_image url' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        'https://page-meta-image.jpg',
        'https://page-image.jpg',
        'https://page-bg-image.jpg',
        '<p><div>Some text and stuff</div><div>< img src="https://page-content-image.jpg"></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-meta-image.jpg'
  end


  it 'should return the page image url' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        'https://page-image.jpg',
        'https://page-bg-image.jpg',
        '<p><div>Some text and stuff</div><div>< img src="https://page-content-image.jpg"></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-image.jpg'
  end


  it 'should return the page background image url' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        nil,
        'https://page-bg-image.jpg',
        '<p><div>Some text and stuff</div><div>< img src="https://page-content-image.jpg"></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-bg-image.jpg'
  end


  it 'should return the 1st image in the page content with single quotes' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        nil,
        nil,
        '<p><div>Some text and stuff</div><div>< img src="https://page-content-image.jpg"></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-content-image.jpg'
  end


  it 'should return the 1st image in the page content with single quotes' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        nil,
        nil,
        '<p><div>Some text and stuff</div><div>< img src=''https://page-content-image.jpg''></div><div><img src=''https://page-content-image-2.jpg''></div></p>',
        'https://site-image.jpg')).to eq 'https://page-content-image.jpg'
  end


  it 'should return the 1st image in the page content without quotation marks and has leading/trailing spaces' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        nil,
        nil,
        '<p><div>Some text and stuff</div><div>< img src=  https://page-content-image.jpg  ></div><div><img src="https://page-content-image-2.jpg"></div></p>',
        'https://site-image.jpg')).to eq 'https://page-content-image.jpg'
  end


  it 'should return the site image b/c the page content has no image' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        nil,
        nil,
        '<p><div>Some text and stuff</div><div></div><div></div></p>',
        'https://site-image.jpg')).to eq 'https://site-image.jpg'
  end


  it 'should parse and return the markdownified image url' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        nil,
        nil,
        'some text to the left ![famous-dripping-clocks-dali-painting-persistence-of-memory1](//images.ctfassets.net/p9oq1ve41d7r/53Ilga1G40Sewck6YYOWcI/8ae18b94d0e3aad990c0fff3b440bbda/famous-dripping-clocks-dali-painting-persistence-of-memory1.jpg) some text to the right',
        'https://site-image.jpg')).to eq 'https://images.ctfassets.net/p9oq1ve41d7r/53Ilga1G40Sewck6YYOWcI/8ae18b94d0e3aad990c0fff3b440bbda/famous-dripping-clocks-dali-painting-persistence-of-memory1.jpg'
  end


  it 'should return the site image url' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        nil,
        nil,
        nil,
        'https://site-image.jpg')).to eq 'https://site-image.jpg'
  end


  it 'should return the site image url when all other options are empty strings' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        '',
        '',
        '',
        '',
        '',
        'https://site-image.jpg')).to eq 'https://site-image.jpg'
  end


  it 'should reset http protocol to https' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        nil,
        nil,
        nil,
        'http://site-image.jpg')).to eq 'https://site-image.jpg'
  end


  it 'should return the site image url with https: prepended' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        nil,
        nil,
        nil,
        '//site-image.jpg')).to eq 'https://site-image.jpg'
  end


  it 'should return the relative site image url as is' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        nil,
        nil,
        nil,
        nil,
        nil,
        '/site-image.jpg')).to eq '/site-image.jpg'
  end


  it 'should return the site image url when all other options are white space' do
    expect(
      Utils::MetaUtil.get_meta_image_url(
        "     \t\r\n   ",
        "     \t\r\n   ",
        "     \t\r\n   ",
        "     \t\r\n   ",
        "     \t\r\n   ",
        'https://site-image.jpg')).to eq 'https://site-image.jpg'
  end


  it 'should return the first item' do
    expect(
      Utils::MetaUtil.get_first_item_with_value(
        'First Item',
        'Second Item',
        'Third Item'
      )).to eq 'First Item'
  end


  it 'should return the second item when the first item is nil' do
    expect(
      Utils::MetaUtil.get_first_item_with_value(
        nil,
        'Second Item',
        'Third Item'
      )).to eq 'Second Item'
  end


  it 'should return the second item when first item is an empty string' do
    expect(
      Utils::MetaUtil.get_first_item_with_value(
        '',
        'Second Item',
        'Third Item'
      )).to eq 'Second Item'
  end


  it 'should return the second item when the first item is white space' do
    expect(
      Utils::MetaUtil.get_first_item_with_value(
        "    \t\r\n    ",
        'Second Item',
        'Third Item'
      )).to eq 'Second Item'
  end


  it 'should return the third item when the first two are nil' do
    expect(
      Utils::MetaUtil.get_first_item_with_value(
        nil,
        nil,
        'Third Item'
      )).to eq 'Third Item'
  end


  it 'should return the third item when first is nil and second is an empty string' do
    expect(
      Utils::MetaUtil.get_first_item_with_value(
        nil,
        '',
        'Third Item'
      )).to eq 'Third Item'
  end


  it 'should return the third item when first is nil and second is white space' do
    expect(
      Utils::MetaUtil.get_first_item_with_value(
        nil,
        "    \t\r\n    ",
        'Third Item'
      )).to eq 'Third Item'
  end


end