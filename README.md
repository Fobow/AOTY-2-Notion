# One-Click Personal Music Library

![Example Usage](./pics/demo.gif)

## Usage

1. Open [AOTY](https://www.albumoftheyear.org/).
2. Click the album cover to enter the album detail page.
3. Click the "Add to Notion" button in the upper right corner to add the album information to your Notion personal music library.
4. You can customize the Notion database as you wish.

## How to Use

### Pre-requests

1. A Notion account with the database you wish to hold of the albums. A notion API integration. You should have:
   * One simple way to access the database id is to check the url to the database, which is like https://www.notion.so/$DATABASE_ID?v=xxx&pvs=x
   ```$DATABASE_ID: your database id```
    * You can follow [Notion API](https://developers.notion.com/reference/capabilities) to get your own API url and token.
   ```$API_URL: your notion API url```
   ```$TOKEN: your notion API token```

2. A server to handle the API requests (e.g. Cloudflare Workers which are free).
   * Since this project works as a browser extension, you need to set up a server to handle the requests. The websites the extension works on (e.g., aoty.org) have different domain names as the notion API.
   * CORS (Cross-Origin Resource Sharing) proxy is used to solve this problem. A CORS proxy is a server that acts as an intermediary between a web application (e.g., our extension on AOTY) and a target server (e.g., the Notion API) to bypass these restrictions.
   * One easy way to set up CORS proxy is to use [Cloudflare Workers](https://workers.cloudflare.com/). You should have:
     * A url to your cloudflare worker, e.g., ```https://woker.xxx.workers.dev```
     * An endpoint to your cloudflare worker. That gives the full url to send the request to, e.g., ```$WORKER_URL=https://woker.xxx.workers.dev/addAlbum```

3. Tampermonkey or other browser extensions to inject the "Add to Notion" button to the album detail page of aoty.

### Adding albums to your own Notion database

1. First, deploy the code in ```./worker.js``` to your cloudflare worker.
   * You need to configure your api ```$TOKEN``` here for authorization.
2. Add ```./aoty2notion.js``` to your Tampermonkey. This injects the "Add to Notion" button to the album detail page of aoty.org.
   * You need to configure your database id ```$DATABASE_ID``` and the cloudflare worker endpoint ```$WORKER_URL``` here (in the ```addToNotion()``` function).
3. You can now add albums to your own database with one click.

## ToDo

- [ ] Add support for other music sites like rateyourmusic.com
- [ ] Save to library on Apple Music and Spotify at the same time.

## Acknowledgements

Thanks to [bendodson](https://github.com/bendodson) for the [itune-artwork-finder](https://bendodson.com/projects/itunes-artwork-finder/) project, which provides the iTunes artwork API. This API is used to find artworks with higher resolution. 