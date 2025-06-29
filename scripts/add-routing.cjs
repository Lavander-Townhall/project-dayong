const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/index.html');
const routingScript = `
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      // This script checks to see if a redirect is present in the query string,
      // converts it back into the correct url and adds it to the
      // browser's history using window.history.replaceState(...),
      // which won't cause the browser to attempt to load the new url.
      // When the single page app is loaded further down in this file,
      // the correct url will be waiting in the browser's history for
      // the single page app to route accordingly.
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location))
    </script>`;

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Check if routing script already exists
  if (!html.includes('Single Page Apps for GitHub Pages')) {
    html = html.replace('</body>', `${routingScript}\n  </body>`);
    fs.writeFileSync(indexPath, html);
    console.log('✅ Added GitHub Pages routing script to index.html');
  } else {
    console.log('ℹ️  Routing script already exists in index.html');
  }
} else {
  console.log('❌ index.html not found in dist folder');
} 