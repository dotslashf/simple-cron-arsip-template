import cron from 'node-cron';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CRON_SECRET = process.env.CRON_SECRET;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Run every day at midnight Jakarta time (5pm UTC)

async function fetchTrendingData(timeframe: string) {
  try {
    const response = await fetch(
      `https://api.dexstatus.xyz/api/gecko/trending?timeframe=${timeframe}`
    );
    const result = await response.json();
    console.log(
      `Successfully fetched trending data for ${timeframe} timeframe:`,
      result
    );
  } catch (error) {
    console.error(
      `Error fetching trending data for ${timeframe} timeframe:`,
      error
    );
  }
}

// Run every hour for 1h timeframe
cron.schedule('0 * * * *', () => fetchTrendingData('1h'), {
  scheduled: true,
  timezone: 'UTC',
});

// Run every hour for 6h timeframe
cron.schedule('0 * * * *', () => fetchTrendingData('6h'), {
  scheduled: true,
  timezone: 'UTC',
});

// Run every hour for 24h timeframe
cron.schedule('0 * * * *', () => fetchTrendingData('24h'), {
  scheduled: true,
  timezone: 'UTC',
});

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
