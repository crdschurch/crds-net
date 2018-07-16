require 'spec_helper'
require 'crds/redirect_writer'

describe CRDS::RedirectWriter do

  before do
    @dest_dir = File.join(Dir.pwd, 'tmp')
    @redir = CRDS::RedirectWriter.new(@dest_dir)
  end

  it 'should populate some instance variables' do
    expect(@redir.output).to be_a(File)
    expect(@redir.output.to_path).to eq(File.join(Dir.pwd, 'tmp', '_redirects'))
    expect(@redir.src).to eq(File.join(Dir.pwd, 'redirects.csv'))
  end

  it 'should do string replacements' do
    ENV['JEKYLL_REDIR_TEST'] = 'lebowski'
    expect(@redir.send(:replace, 'jeff/${env:JEKYLL_REDIR_TEST}/dude')).to eq('jeff/lebowski/dude')
  end

  it 'should write _redirects' do
    FileUtils.rm_r File.join(Dir.pwd, 'tmp', '_redirects')
    expect(File.exist?(@redir.output.to_path)).to be(false)
    @redir = CRDS::RedirectWriter.new(@dest_dir)
    @redir.debug = false
    @redir.write!
    expect(File.exist?(@redir.output.to_path)).to be(true)
  end

  it 'should contain evaluated ENV variables in output' do
    @redir.debug = false
    @redir.write!
    expect(File.read(@redir.output)).to include(ENV['CRDS_MAESTRO_CLIENT_ENDPOINT'])
  end

end