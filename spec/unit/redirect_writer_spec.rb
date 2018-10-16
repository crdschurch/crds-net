require 'spec_helper'
require 'crds/redirect_writer'

describe CRDS::RedirectWriter::Redirect do

  before do
    src = "/undivided-training,https://undivided.netlify.com,301"
    @redirect = CRDS::RedirectWriter::Redirect.new(src.split(','))
  end

  it 'should do string replacements' do
    ENV['JEKYLL_REDIR_TEST'] = 'lebowski'
    expect(CRDS::RedirectWriter::Redirect.send(:replace, 'jeff/${env:JEKYLL_REDIR_TEST}/dude')).to eq('jeff/lebowski/dude')
  end

  it 'should return redirect rule via to_s method' do
    expect(@redirect.to_s).to eq("/undivided-training\thttps://undivided.netlify.com\t301")
  end

  context 'evaluating current context' do

    it 'should return env value for CONTEXT' do
      ENV['CONTEXT'] = 'release'
      expect(@redirect.deployment_context).to eq('release')
    end

    context 'when CONTEXT is nil' do
      it 'should return BRANCH' do
        ENV['CONTEXT'] = nil
        ENV['BRANCH'] = 'some-branch'
        expect(@redirect.deployment_context).to eq('some-branch')
      end
    end

    context 'when CONTEXT and BRANCH are both nil' do
      it 'should return current git branch from system' do
        ENV['CONTEXT'] = nil
        ENV['BRANCH'] = nil
        branch = @redirect.class.git_branch
        expect(@redirect.deployment_context).to eq(branch)
      end
    end

    context 'when CONTEXT is production or deploy-preview' do
      it 'should default to current git branch when context is production or deploy-preview' do
        branch = @redirect.class.git_branch
        ENV['CONTEXT'] = 'production'
        expect(@redirect.deployment_context).to eq(branch)
        ENV['CONTEXT'] = 'deploy-preview'
        expect(@redirect.deployment_context).to eq(branch)
      end
    end
  end

  it 'should include rules with context specified' do
    src = "/undivided-training,https://undivided.netlify.com,301,release"
    @redirect = CRDS::RedirectWriter::Redirect.new(src.split(','))
    ENV['CONTEXT'] = 'release'
    expect(@redirect.context_included?).to be_truthy
  end

  it 'should exclude rules that do not match current context' do
    src = %w(/zzz https://undivided.netlify.com 301 zzz,release)
    @redirect = CRDS::RedirectWriter::Redirect.new(src)
    ENV['CONTEXT'] = 'zzz'
    expect(@redirect.context_included?).to be_truthy
    ENV['CONTEXT'] = 'release'
    expect(@redirect.context_included?).to be_truthy
    ENV['CONTEXT'] = 'production'
    expect(@redirect.context_included?).to be_falsey
  end

end

describe CRDS::RedirectWriter do

  before do
    @dest_dir = File.join(Dir.pwd, 'tmp')
    @redir = CRDS::RedirectWriter.new(@dest_dir)
  end

  it 'should populate some instance variables' do
    expect(@redir.dest).to eq(File.join(Dir.pwd, 'tmp', '_redirects'))
    expect(@redir.src).to eq(File.join(Dir.pwd, 'redirects.csv'))
  end

  it 'should instantiate Redirect objects for each line in src' do
    @redir.setup()
    expect(@redir.redirs.all?{|obj| obj.is_a?(CRDS::RedirectWriter::Redirect) }).to be_truthy
  end

  it 'should write _redirects' do
    FileUtils.rm_r File.join(Dir.pwd, 'tmp', '_redirects')
    @redir = CRDS::RedirectWriter.new(@dest_dir)
    @redir.debug = false
    @redir.write!
    expect(@redir.output).to be_a(File)
    expect(@redir.output.to_path).to eq(File.join(Dir.pwd, 'tmp', '_redirects'))
    expect(File.exist?(@redir.output.to_path)).to be(true)
  end

  it 'should contain evaluated ENV variables in output' do
    @redir.debug = false
    @redir.write!
    expect(File.read(@redir.output)).to include(ENV['CRDS_MAESTRO_CLIENT_ENDPOINT'])
  end

end