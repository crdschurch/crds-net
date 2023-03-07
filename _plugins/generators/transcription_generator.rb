require "webvtt"
require 'uri'

module Jekyll
  class TranscriptionGenerator < Generator
    attr_accessor :site

    def generate(site)
      site.collections['messages'].docs.each do |message|
        if message['transcription']
          url = "https:#{message['transcription'].dig('url')}"

          begin
            local_resource = LocalResource.new(url, site.cache_dir)
            local_copy_of_remote_file = local_resource.file
            webvtt = WebVTT.read(local_copy_of_remote_file.path)
            cues = webvtt.cues.collect do |cue|
              [
                Time.parse(cue.start.to_s).strftime('%H:%M:%S'),
                cue.text
              ]
            end
            message['transcription']['body'] = Hash[cues]
          rescue
            message.data['transcription'] = nil
          ensure
            if local_copy_of_remote_file
              local_copy_of_remote_file.close
              local_copy_of_remote_file.unlink
            end
          end

        end
      end
    end

  end
end


class LocalResource
  attr_reader :uri, :tmp_folder

  def initialize(url, tmp_folder)
    @uri = URI.parse(url)
    @tmp_folder = tmp_folder
  end

  def file
    @file ||= Tempfile.new(tmp_filename, tmp_folder, encoding: encoding).tap do |f|
      io.rewind
      f.write(io.read)
      f.close
    end
  end

  def io
    @io ||= uri.open
  end

  def encoding
    io.rewind
    io.read.encoding
  end

  def tmp_filename
    ext = Pathname.new(uri.path).extname
    [
      File.basename(uri.path, ext),
      ext
    ]
  end
end
