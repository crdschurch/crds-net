require 'pry'
require 'net/sftp'


module CRDS
  class Monetate

    attr_accessor :xml, :success
    def initialize
      @xml = "#{Dir.pwd}/_site/product_feed.xml"
      upload_the_feed!
    end

    def upload_the_feed!
      Net::SFTP.start('sftp.monetate.net', ENV['MONETATE_USERNAME'], :password => ENV['MONETATE_PASSWORD']) do |sftp|
        # upload a file or directory to the remote host

        sftp.upload!( @xml, "/upload/product_feed.xml") do |event, uploader, *args|
          if event == :finish
            @success = true
          end
        end

      end
    end

  end
end

CRDS::Monetate.new()
