require 'crds/redirects'

namespace :crds do
  namespace :redirects do

    desc 'Parse and render environmentally appropriate version of _redirects'
    task :create do |_t, _args|
      CRDS::Redirects.new().write!
    end

  end
end

