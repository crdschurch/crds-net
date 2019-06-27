require 'spec_helper'	

 describe 'Html Util' do	

   before do	
  end	


   it 'should return the specific page title, followed by the site title' do	
    expect(Utils::HtmlUtil.get_title('Page title', 'Site title')).to eq 'Page title | Site title'	
  end	


   it 'should return the whitespace-stripped page title, followed by the whitespace-stripped site title' do	
    expect(Utils::HtmlUtil.get_title(' Page title ', ' Site title ')).to eq 'Page title | Site title'	
  end	


   it 'should return the site title when page title is an empty string' do	
    expect(Utils::HtmlUtil.get_title('', 'Site title')).to eq 'Site title'	
  end	


   it 'should return the site title when page title contains only white space' do	
    expect(Utils::HtmlUtil.get_title(" \t\r\n", 'Site title')).to eq 'Site title'	
  end	


   it 'should return the site title when page title is equal to nil' do	
    expect(Utils::HtmlUtil.get_title(nil, 'Site title')).to eq 'Site title'	
  end	


 end 
