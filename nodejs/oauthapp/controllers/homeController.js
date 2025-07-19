import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';

class HomeController {
  async index(req, res, next) {
    res.clearCookie('activeNavItem');
    res.clearCookie('activeSubmenuItem');
    res.render('home/index');
  }

  async code(req, res, next) {
    res.render('home/code');
  }

  async credential(req, res, next) {
    res.render('home/credential');
  }

  async implicit(req, res, next) {
    res.render('home/implicit');
  }

  async password(req, res, next) {
    res.render('home/password');
  }

  async sitemap(req, res, next) {
    try {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;
      
      // Define an array of site URLs
      const siteUrls = [
        `${baseUrl}/`,
        `${baseUrl}/code`,
        `${baseUrl}/credential`,
        `${baseUrl}/implicit`,
        `${baseUrl}/password`
      ];

      // Create a sitemap stream
      const smStream = new SitemapStream({ hostname: baseUrl });
      const pipeline = smStream.pipe(createGzip());

      siteUrls.forEach(url => {
        const relativeUrl = url.replace(baseUrl, '');
        smStream.write({ url: relativeUrl, changefreq: 'weekly', priority: 0.7 });
      });

      smStream.end();

      streamToPromise(pipeline).then(sm => {
        res.header('Content-Type', 'application/xml');
        res.header('Content-Encoding', 'gzip');
        res.send(sm);
      }).catch(err => {
        console.error('Error generating sitemap:', err);
        res.status(500).end();
      });
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  }
}

export default HomeController;
