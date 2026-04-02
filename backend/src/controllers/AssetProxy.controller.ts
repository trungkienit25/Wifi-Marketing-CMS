import type { Request, Response } from 'express';
import axios from 'axios';

/**
 * Serves as an anonymizing proxy for Google Drive and other assets.
 * Also provides a bridge if Cloudinary is blocked in specific networks.
 */
export class AssetProxyController {
  public static async proxy(req: Request, res: Response) {
    const targetUrl = req.query.u as string;

    if (!targetUrl) {
      return res.status(400).send('URL is required');
    }

    try {
      // Force long-term caching for assets to reduce server load
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000');
      
      const response = await axios({
        method: 'get',
        url: targetUrl,
        responseType: 'stream',
        timeout: 10000, // 10s timeout
      });

      // Forward headers if needed, but primarily Content-Type
      res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
      
      response.data.pipe(res);
    } catch (error) {
      console.error('[Proxy Error] Failed to stream asset:', targetUrl);
      // If proxy fails, we return a 404 to let the client handle the next tier (Base64)
      res.status(404).send('Asset not reachable via proxy');
    }
  }
}
