const fs = require('fs');
const path = require('path');

module.exports = {
  onPostBuild: async function({ inputs, utils }) {
    //----------------------------------------
    // Initialize Configuration
    //----------------------------------------
    const staticScripts = inputs.staticScripts || [];
    const dynamicScripts = inputs.dynamicScripts || [];
    const checkFiles = inputs.checkFiles || [];
    const environment = process.env.JEKYLL_ENV || 'development';
    
    let scriptsToCheck = [...staticScripts];
    // Filter out osano.js if not in production
    if (environment.toLowerCase() !== 'production') {
      scriptsToCheck = scriptsToCheck.filter(script => script !== 'osano.js');
    }
    
    const publishDir = path.join(process.cwd(), '_site');
    
    if (!fs.existsSync(publishDir)) {
      utils.build.failBuild(`Could not find Jekyll _site directory at ${publishDir}`);
      return;
    }
    
    //----------------------------------------
    // Collect HTML Files
    //----------------------------------------
    let htmlFiles;
    if (checkFiles.length > 0) {
      htmlFiles = checkFiles.map(file => {
        const filePath = path.join(publishDir, file);
        if (fs.existsSync(filePath)) {
          return filePath;
        }
        return null;
      }).filter(Boolean);
      
      if (htmlFiles.length === 0) {
        utils.build.failBuild(`None of the specified files were found in ${publishDir}`);
        return;
      }
    } else {
      htmlFiles = getAllHtmlFiles(publishDir);
    }
    
    //----------------------------------------
    // Check Scripts
    //----------------------------------------
    const missingStatic = new Set(scriptsToCheck);
    const missingDynamic = new Set(dynamicScripts.map(ds => ds.domain));
    
    htmlFiles.forEach(htmlFile => {
      const html = fs.readFileSync(htmlFile, 'utf-8');
      
      // Debug logging
      console.log('Checking file:', htmlFile);
      console.log('HTML content includes intercom?', html.includes('widget.intercom.io'));
      
      // Check static scripts
      const scriptTags = findScriptTags(html);
      scriptsToCheck.forEach(script => {
        const scriptFound = scriptTags.some(src => src.includes(script));
        if (scriptFound) {
          missingStatic.delete(script);
        }
      });
      
      // Check dynamic scripts
      dynamicScripts.forEach(({domain, pattern}) => {
        const regex = new RegExp(pattern);
        const found = regex.test(html);
        // Debug logging
        console.log(`Checking ${domain} with pattern ${pattern}: ${found}`);
        
        if (found) {
          missingDynamic.delete(domain);
        }
      });
    });

    //----------------------------------------
    // Report Results
    //----------------------------------------
    const allMissing = [...missingStatic, ...missingDynamic];
    if (allMissing.length > 0) {
      const message = `
The following scripts are missing from the generated HTML:
${[...allMissing].map(script => `- ${script}`).join('\n')}

Checked files:
${htmlFiles.map(file => `- ${path.relative(publishDir, file)}`).join('\n')}
`;
      
      if (environment.toLowerCase() === 'production') {
        utils.build.failBuild(message);
      } else {
        utils.status.show({
          title: "Health Check Warning",
          summary: "Missing Scripts",
          text: message
        });
      }
    } else {
      utils.status.show({
        title: "Health Check Success",
        summary: "All Scripts Found",
        text: `Successfully verified all scripts across ${htmlFiles.length} files.`
      });
    }
  }
};

function getAllHtmlFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (path.extname(file) === '.html') {
      results.push(fullPath);
    }
  });
  
  return results;
}

function findScriptTags(html) {
  const scriptSources = [];
  const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/g;
  let match;
  
  while ((match = scriptRegex.exec(html)) !== null) {
    const src = match[1];
    if (src) {
      scriptSources.push(src);
    }
  }
  
  return scriptSources;
}
