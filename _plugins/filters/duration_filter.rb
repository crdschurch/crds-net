
module Jekyll
  module DurationFilter

    def duration(seconds, format='short')
      return '' unless seconds.present?

      # Articles should only show minutes
      if format == 'short'
        min = Time.at(seconds).utc.strftime('%M').to_i
        pluralize(min, 'min')

      # Not articles should display "HH:MM:SS" but should be pluralized and look super nice
      elsif format == 'long'
        h = (seconds / (60 * 60)).floor || 0
        m = ((seconds / 60) % 60).floor || 0
        s = (seconds % 60).floor || 0

        arr = [s]
        labels = ['sec']

        if m > 0
          arr.push(m)
          labels.push('min')
        end

        if h > 0
          arr.push(h)
          labels.push('hr')
        end

        arr.each_with_index.collect do |n, i|
          if n > 0
            label = labels[i]
            label = label == 'sec' ? "#{n} sec" : pluralize(n,label)
          end
        end.reverse.join(' ')

      # Roll your own format by passing strftime args (https://www.foragoodstrftime.com/)
      else
        Time.at(seconds).utc.strftime(format).to_i
      end
    end

  end
end

Liquid::Template.register_filter(Jekyll::DurationFilter)
