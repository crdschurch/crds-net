module Jekyll
    class OnsiteGroupLocationGenerator < Generator
  
      def generate(site)
        puts "location A"
        # Get all meetings documents from Jekyll collections
        meetings = site.
          collections['onsite_group_meetings'].docs

        # Get all group documents from Jekyll collections
        groups = site.collections['onsite_groups'].docs 


        # Trying to create a freeze locker for initial onsite groups objects. Not sure that I am doing it correctly
        temp = []

        for index in 0 ... groups.size

          document_hash = {"document" => groups[index]}
          document_hash.freeze
          temp.push(document_hash)

        end

        # Load saturated meeting data into group[meetings]
        groups_with_saturated_meetings = groups.map do | group |
            if group.data.keys.include?('meetings')
              saturated_meetings = group.data['meetings'].map do |meeting|
                result = meetings.find{ |e| e['id'] == meeting['id']}
                result.data
              end
  
              group.data['meetings'] = saturated_meetings
              group.data
            end
            group
          end
  
          # Create an array of groups, each with locations containing corresponding saturated meetings
          meetings_by_group_location = groups_with_saturated_meetings
          .select{ |g| g.data.keys.include?('meetings') }
          .map do |g| 

            meetings_by_group = g.data['meetings'].group_by do |m| 
              m['title']
            end

            meetings_by_location = meetings_by_group.transform_values do |mtgs| 
                mtgs.group_by{ |m| m['location']['slug'] }
            end

            g.data['meetings'] = meetings_by_location
            g.data
          end
  
        # Return a few properties for only locations that have meetings
        locations = meetings.
          select{|m| m.data.keys.include?('location') }.
          collect{|m| m.data['location'] }.
          uniq{|l| l['slug'] }.
          collect{|l| l.slice('name', 'slug', 'image','onsite_group_description') }
  
        # Generate "page" for each group location...
        meetings_by_group_location.each do |group|
          group['meetings'].each do | group_name, group_object|
            group_object.each do | location_name, location_meetings| 
  
            # Render the `onsite-group-location.html` template
            page = Jekyll::Page.new(site, '_layouts', '', 'onsite-group-meeting.html')
  
            # Tell Jekyll what URL we want for out page
            page.instance_variable_set('@url', "/groups/onsite-groups/#{group_name}/#{location_name}/index.html")
  
            # Add front-matter
            page.data['group'] = group
            page.data['location'] = locations.select{ |location| location['slug'] == location_name}
            page.data['meetings'] = location_meetings
  
            # puts page.data['meetings'].inspect
            site.pages << page
            end 
          end
        end 

        # Here you can see that the jekyll document for OSG inside the frozen object, has changed. 
        temp.each{ |element| 
          puts element['document'].data['meetings']
        }
  
      end
    end
  end
  