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
      file.write("https://development.event-checkin.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/event-checkin/:splat,302!
      http://development.event-checkin.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/event-checkin/:splat,302!
      https://release.event-checkin.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/event-checkin/:splat,302!
      https://event-checkin.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/event-checkin/:splat,302!
      https://development.serve.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/serve-signup/:splat,302!
      http://development.serve.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/serve-signup/:splat,302!
      https://release.serve.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/serve-signup/:splat,302!
      https://serve.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/serve-signup/:splat,302!
      https://forms-int.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/forms/:splat,302!
      http://forms-int.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/forms/:splat,302!
      https://forms-demo.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/forms/:splat,302!
      https://forms.crossroads.net/*,https://${env:CRDS_APP_DOMAIN}/forms/:splat,302!
      /,/h,200! Role=user
      /group-renew groupIds=:groupIds,/group-renew?groupIds=:groupIds,200! Role=user
      /group-renew groupIds=:groupIds,/signin?redirectUrl=/group-renew?groupIds=:groupIds,302!
      /spouse-invite-landing inviteId=:inviteId response=decline,/spouse-invite-landing/?inviteId=:inviteId&response=decline,200!
      /spouse-invite-landing inviteId=:inviteId,/spouse-invite-landing/?inviteId=:inviteId,200! Role=user
      /spouse-invite-landing inviteId=:inviteId,/spouse-invite-login/?inviteId=:inviteId&redirectUrl=/spouse-invite-landing?inviteId=:inviteId,302!")
    end
  end

  describe 'item_attrs' do
    let(:item) {
      {
        "sys"=>{
          "space"=>{"sys"=>{"type"=>"Link", "linkType"=>"Space", "id"=>"p9oq1ve41d7r"}},
          "id"=>"2mCiLxg9BW8sI4imgIMgW2",
          "type"=>"Entry",
          "createdAt"=>"2018-11-12T18:24:49.888Z",
          "updatedAt"=>"2018-11-12T18:25:31.092Z",
          "environment"=>{"sys"=>{"id"=>"master", "type"=>"Link", "linkType"=>"Environment"}},
          "revision"=>2,
          "contentType"=>{"sys"=>{"type"=>"Link", "linkType"=>"ContentType", "id"=>"redirect"}},
          "locale"=>"en-US"
        },
        "fields"=>{"from"=>"/giving-help", "to"=>"/pushpay/faq"}
      }
    }

    it 'should apply the proper to and from fields' do
      attrs = @redirects.send(:item_attrs, item)
      expect(attrs.compact.size).to eq(3)
      expect(attrs[0]).to eq(item.dig('fields', 'from'))
    end

    it 'default to temporary (302) status code' do
      attrs = @redirects.send(:item_attrs, item)
      expect(attrs[2]).to eq('302')
    end

    it 'should accept status code' do
      item['fields']['status_code'] = '410'
      attrs = @redirects.send(:item_attrs, item)
      expect(attrs[2]).to eq('410')
    end

    it 'should accept forced' do
      item['fields']['is_forced'] = true
      attrs = @redirects.send(:item_attrs, item)
      expect(attrs[2]).to eq('302!')
    end
  end

  it 'should write rows to a csv after the second line' do
    VCR.use_cassette 'contentful/redirects' do
      current = @csv
      tmp_csv_path = './spec/fixtures/redirects.csv'
      @redirects.to_csv!(tmp_csv_path, false)
      future = CSV.read(tmp_csv_path)
      expect(current[1] == future[1]).to eq true
      expect(current == future).to eq false
    end
  end
end
