require 'spec_helper'

describe 'Redirects' do

  before do
    ENV['CONTENTFUL_ACCESS_TOKEN'] = 'cdc473421d1e2f089515a5fe791ef575715b67024840b6aa1ee157b0e43d18d3'
    ENV['CONTENTFUL_SPACE_ID'] = 'y3a9myzsdjan'
    ENV['CONTENTFUL_ENV'] = 'int'
    @redirects = Redirects.new
    @csv = CSV.read('./spec/fixtures/redirects.csv')
  end

  after do
    File.open('./spec/fixtures/redirects.csv', 'w+') do |file|
      file.write("http://crossroads.net/*,https://www.crossroads.net/:splat,301!,master\nhttp://${env:CRDS_APP_DOMAIN}/*,https://${env:CRDS_APP_DOMAIN}/:splat,301!\n/groupleaderresources/,/groups/leader/resources/,302")
    end
  end
  
  it 'should always give a temporary (302) status code' do
    item = {"sys"=>
    {"space"=>{"sys"=>{"type"=>"Link", "linkType"=>"Space", "id"=>"p9oq1ve41d7r"}},
     "id"=>"2mCiLxg9BW8sI4imgIMgW2",
     "type"=>"Entry",
     "createdAt"=>"2018-11-12T18:24:49.888Z",
     "updatedAt"=>"2018-11-12T18:25:31.092Z",
     "environment"=>{"sys"=>{"id"=>"master", "type"=>"Link", "linkType"=>"Environment"}},
     "revision"=>2,
     "contentType"=>{"sys"=>{"type"=>"Link", "linkType"=>"ContentType", "id"=>"redirect"}},
     "locale"=>"en-US"},
     "fields"=>{"from"=>"/giving-help", "to"=>"/pushpay/faq"}}
    @redirects.set_tmp_status(item)
    expect(item["fields"]["status"]).to eq 302
  end

  it 'should write rows to a csv after the second line' do
    VCR.use_cassette 'contentful/redirects' do
      current = @csv
      tmp_csv_path = './spec/fixtures/redirects.csv'
      @redirects.to_csv!(tmp_csv_path)
      future = CSV.read(tmp_csv_path)
      expect(current[1] == future[1]).to eq true
      expect(current == future).to eq false
    end
  end
end
