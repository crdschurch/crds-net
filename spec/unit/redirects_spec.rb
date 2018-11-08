require 'spec_helper'

describe 'Redirects' do

  before do
    @redirects = Redirects.new
    @csv = CSV.read('./redirects.csv')
  end

  it 'transforms status text into numeric codes' do
    s = 'temporary'
    expect(@redirects.parse_status(s)).to eq 302
  end

  it 'should write rows to a csv after the first line' do
    VCR.use_cassette 'contentful/redirects' do
      ENV['CONTENTFUL_ACCESS_TOKEN'] = '813af7d0df1d660fdf5e71010997a4fe621848aa225fa3e6f4fad2b50e6cdce2'
      current = @csv
      @redirects.to_csv!
      future = CSV.read('./redirects.csv')
      expect(current[0] == future[0]).to eq true
      expect(current == future).to eq false
    end
    
  end
end
