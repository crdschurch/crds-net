const fs = require('fs');
const path = require('path');

module.exports = {
  onPostBuild: async function({ inputs, utils }) {
    //----------------------------------------
    // Initialize Configuration
    //----------------------------------------
    const criticalScripts = inputs.criticalScripts || [];
    const checkFiles = inputs.checkFiles || [];
    const environment = process.env.JEKYLL_ENV || 'development';
    
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
    const missingScripts = new Set(criticalScripts);
    
    htmlFiles.forEach(htmlFile => {
      const html = fs.readFileSync(htmlFile, 'utf-8');
      const scriptTags = findScriptTags(html);
      
      criticalScripts.forEach(script => {
        const scriptName = path.basename(script);
        const scriptFound = scriptTags.some(src => {
          if (!src) return false;
          return path.basename(src) === scriptName || src.endsWith(`/${scriptName}`);
        });

        if (scriptFound) {
          missingScripts.delete(script);
        }
      });
    });

    //----------------------------------------
    // Report Results
    //----------------------------------------
    if (missingScripts.size > 0) {
      const message = `
The following critical scripts are missing from the generated HTML:
${[...missingScripts].map(script => `- ${script}`).join('\n')}

Checked files:
${htmlFiles.map(file => `- ${path.relative(publishDir, file)}`).join('\n')}
`;
      
      if (environment.toLowerCase() === 'production') {
        utils.build.failBuild(message);
      } else {
        utils.status.show({
          title: "Health Check Warning",
          summary: "Missing Critical Scripts",
          text: message
        });
      }
    } else {
      utils.status.show({
        title: "Health Check Success",
        summary: "All Critical Scripts Found",
        text: `Successfully verified all ${criticalScripts.length} critical scripts across ${htmlFiles.length} files.`
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
  const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/g;
  let match;
  
  while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1]) {
      scriptSources.push(match[1]);
    }
  }
  
  return scriptSources;
}
