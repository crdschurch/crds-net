require 'spec_helper'

describe 'Redirects' do

  before do
    ENV['CONTENTFUL_ACCESS_TOKEN'] = '813af7d0df1d660fdf5e71010997a4fe621848aa225fa3e6f4fad2b50e6cdce2'
    ENV['CONTENTFUL_SPACE_ID'] = 'p9oq1ve41d7r'
    @redirects = Redirects.new
    @csv = CSV.read('./spec/fixtures/redirects.csv')
  end

  it 'transforms status text into numeric codes' do
    s = 'temporary'
    expect(@redirects.parse_status(s)).to eq 302
  end

  it 'should write rows to a csv after the first line' do
    VCR.use_cassette 'contentful/redirects' do
      current = @csv
      tmp_csv_path = './spec/fixtures/redirects.csv'
      @redirects.to_csv!(tmp_csv_path)
      future = CSV.read(tmp_csv_path)
      expect(current[0] == future[0]).to eq true
      expect(current == future).to eq false
    end
    
  end
end
