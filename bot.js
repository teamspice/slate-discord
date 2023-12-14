require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});
const axios = require('axios');
const walletApiUrl = process.env.WALLET_API_URL;


// HANDLES SENDING DISCORD MESSAGES FOR ORGANIC EXECUTIONS

// Initialize lastTimestamp to the current time
let lastTimestamp = Date.now();

// Function to create a message from an entry object
function createMessage(entry) {
    const numAction = entry.actions;
    const numCondition = entry.conditions || 0; // Default to 0 if undefined
    const eventTime = new Date(parseInt(entry.timestamp));
    const time = eventTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
    return `A Slater just executed a ${numAction} action${numCondition > 0 ? `, ${numCondition} condition` : ''} on-chain operation via [slate.ceo](https://slate.ceo/?utm_source=discord&utm_medium=general&utm_campaign=bot) at ${time} EST!`;
}

// Function to handle the API response
function handleApiResponse(entries) {
    if (entries.length === 0) {
        return;
    }

    let combinedMessage = '';
    entries.forEach(entry => {
        const message = createMessage(entry);
        if ((combinedMessage + message + '\n\n').length > 2000) {
            client.channels.cache.get('1167177427559141497').send(combinedMessage);
            combinedMessage = message + '\n\n'; // Start a new message with the current entry
        } else {
            combinedMessage += message + '\n\n'; // Append each message with double newline
        }
    });

    if (combinedMessage.length > 0) {
        client.channels.cache.get('1167177427559141497').send(combinedMessage);
    }

    lastTimestamp = entries[entries.length - 1].timestamp;
}

// Function to fetch new entries from the API
async function fetchNewEntries() {
    try {
        const res = await axios.get(`${walletApiUrl}/new-history-entries?timestamp=${lastTimestamp}`);
        handleApiResponse(res.data);
    } catch (error) {
        console.error('Error fetching new entries:', error);
    }
}


// HANDLES SENDING DISCORD MESSAGES FOR RANDOMLY GENERATED EXECUTIONS

// Utility function to generate random time within a 2-hour block
const getRandomTimeInBlock = (blockStartHour) => {
    const date = new Date();
    date.setHours(blockStartHour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
    return date;
};

// Generate a schedule for the day & a random number of minutes between 1 and 5 for each time to further induce randomness
const generateDailySchedule = () => {
    const schedule = [];
    for (let i = 0; i < 12; i++) {
        const startTime = i * 2;
        const randomOffset = Math.floor(Math.random() * 2); // Generate either 0 or 1
        const selectedHour = startTime + randomOffset;
        const scheduledTime = getRandomTimeInBlock(selectedHour);
        const randomMinutes = Math.floor(Math.random() * 5) + 1; // Random minutes between 1 and 5

        schedule.push({ scheduledTime, randomMinutes });
    }
    return schedule;
};

let dailySchedule = generateDailySchedule();

// Refresh the schedule every day at midnight
const refreshSchedule = () => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        dailySchedule = generateDailySchedule();
    }
}

// Generate a random message
const getRandomMessage = (scheduledTime) => {
    const numAction = Math.floor(Math.random() * 4) + 1;
    const numCondition = Math.floor(Math.random() * 3);
    const time = scheduledTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let conditionText = "";
    if (numCondition > 0) {
        conditionText = `, ${numCondition} condition`;
    }
    
    return `A Slater just executed a ${numAction} action${conditionText} on-chain operation via [slate.ceo](https://slate.ceo/?utm_source=discord&utm_medium=general&utm_campaign=bot) at ${time} EST!`;
};

// Send message if current time matches any time in the adjustedschedule (adjusted for random minutes)
const sendMessagesAfterScheduledTime = () => {
    const now = new Date();
    dailySchedule.forEach(({ scheduledTime, randomMinutes }) => {
        const adjustedScheduledTime = new Date(scheduledTime.getTime() + randomMinutes * 60000);

        if (
            now.getHours() === adjustedScheduledTime.getHours() &&
            now.getMinutes() === adjustedScheduledTime.getMinutes()
        ) {
            const message = getRandomMessage(scheduledTime);
            const channel = client.channels.cache.get('1167177427559141497');
            if (channel) {
                channel.send(message);
            }
        }
    });
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(sendMessagesAfterScheduledTime, 60000); // Check every minute
    setInterval(refreshSchedule, 60000); // Check every minute for refreshing the schedule
    setInterval(fetchNewEntries, 300000); // Check every 5 minutes for new entries
});

client.login(process.env.BOT_TOKEN);

// //TEST FUNCTIONS

// // Test function to print the generated messages to the console
// const checkAndPrintMessages = () => {
//     const now = new Date();
//     dailySchedule.forEach((scheduledTime) => {
//         const randomMinutes = Math.floor(Math.random() * 5) + 1; // Generate a random whole number of minutes between 1 and 5
//         const adjustedScheduledTime = new Date(scheduledTime.getTime() + randomMinutes * 60000);

//         if (now.getHours() === adjustedScheduledTime.getHours() && now.getMinutes() === adjustedScheduledTime.getMinutes()) {
//             const message = getRandomMessage(scheduledTime);
//             console.log(message); // Print the message to the console
//         }
//     });
// };

// // Test function to display the generated schedule and messages
// const testBotScript = () => {
//     console.log('Generated Daily Schedule:');
//     dailySchedule.forEach(({ scheduledTime }) => 
//         console.log(scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
//     );

//     for (let hour = 0; hour < 24; hour++) {
//         for (let minute = 0; minute < 60; minute++) {
//             const now = new Date();
//             now.setHours(hour, minute, 0);

//             dailySchedule.forEach(({ scheduledTime, randomMinutes }) => {
//                 const adjustedScheduledTime = new Date(scheduledTime.getTime() + randomMinutes * 60000);

//                 if (now.getHours() === adjustedScheduledTime.getHours() && now.getMinutes() === adjustedScheduledTime.getMinutes()) {
//                     const message = getRandomMessage(scheduledTime);
//                     console.log(`[${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${message}`);
//                 }
//             });
//         }
//     }
// };

// testBotScript(); // Run the test script