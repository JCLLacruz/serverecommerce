const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('../models/User');

// Task executed every Monday at 8 AM
cron.schedule('0 9 * * 1', async () => {
  try {
    await User.deleteMany({ emailConfirmed: false });
    console.log('All users with email not confirmed deleted');
  } catch (error) {
    console.log('Error deleting unconfirmed users:', error);
  }
});