This is an example worker for the R2 Uploader, you can use the code in the `./dist` folder directly, or build the code yourself.

### Requirements

- Node.js installed (v16 +)

### How to use

1. Clone this repository
   ```shell
   git clone https://github.com/jw-12138/r2-uploader-example-worker.git
   ```
2. Install the dependencies
   ```shell
    npm install
   ```
   
3. Edit `wrangler.toml`, change `r2_buckets` to your bindings

4. Deploy the code
   ```shell
   npm run deploy
   ```
5. Push your API key
   ```shell
   npx wrangler secret put AUTH_KEY_SECRET
   ```

   This command will prompt you input the value, press `Enter` to confirm.

And that's it, your worker is now ready to be used in R2 Uploader.
