// Backblaze B2 Configuration
export const BACKBLAZE_CONFIG = {
  KEY_ID: '003a804e484472c0000000001',
  APP_KEY: '003b6fb5df0ce52a815b9408511fce6a25432eb465',
  BUCKET_NAME: 'askasif',
  ENDPOINT: 'https://s3.us-west-002.backblazeb2.com'
};

// Set environment variables for AWS SDK
if (typeof window === 'undefined') {
  process.env.BACKBLAZE_KEY_ID = BACKBLAZE_CONFIG.KEY_ID;
  process.env.BACKBLAZE_APP_KEY = BACKBLAZE_CONFIG.APP_KEY;
  process.env.BACKBLAZE_BUCKET_NAME = BACKBLAZE_CONFIG.BUCKET_NAME;
  process.env.BACKBLAZE_ENDPOINT = BACKBLAZE_CONFIG.ENDPOINT;
}
