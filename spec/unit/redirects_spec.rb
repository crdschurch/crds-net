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
      current = @csv
      @redirects.to_csv!
      future = CSV.read('./redirects.csv')
      expect(current[0] == future[0]).to eq true
      expect(current == future).to eq false
    end
    
  end
end
