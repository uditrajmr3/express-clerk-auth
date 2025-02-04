const svix = require('svix');

const clerk = (req, res, next) => {
  const { CLERK_WEBHOOK_SECRET } = process.env;

  if (!CLERK_WEBHOOK_SECRET) {
    const errMessage =
      'Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env';
    throw new Error(errMessage);
  }

  // Create new Svix instance with secret
  const wh = new svix.Webhook(CLERK_WEBHOOK_SECRET);

  // Get headers and body
  const { headers } = req;
  const payload = req.body;

  // Get Svix headers for verification
  const svix_id = headers['svix-id'];
  const svix_timestamp = headers['svix-timestamp'];
  const svix_signature = headers['svix-signature'];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({
      success: false,
      message: 'Error: Missing svix headers',
    });
  }

  let evt;

  // Attempt to verify the incoming webhook
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.log('Error: Could not verify webhook:', err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Extract and log webhook data
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log('Webhook payload:', evt.data);

  return res.status(200).json({
    success: false,
    message: 'Webhook received',
  });
};

module.exports = { clerk };
