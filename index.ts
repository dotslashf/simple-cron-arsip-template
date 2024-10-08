import cron from 'node-cron';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CRON_SECRET = process.env.CRON_SECRET;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Run every day at midnight Jakarta time (5pm UTC)
console.log('Cron scheduler running');
cron.schedule(
  '0 17 * * *',
  async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/trpc/cron.dailyStreakReset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            json: {
              secret: CRON_SECRET,
            },
          }),
        }
      );

      const result = await response.json();
      console.log('Cron job result:', result);
    } catch (error) {
      console.error('Error running cron job:', error);
    }
  },
  {
    scheduled: true,
    timezone: 'UTC',
  }
);

// Cron to send email streak
cron.schedule(
  '0 13 * * *',
  async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/trpc/cron.sendDailyStreakReminder`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            json: {
              secret: CRON_SECRET,
            },
          }),
        }
      );

      const result = await response.json();
      console.log('Cron job result:', result);
    } catch (error) {
      console.error('Error running cron job:', error);
    }
  },
  {
    scheduled: true,
    timezone: 'UTC',
  }
);
