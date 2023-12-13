const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});
require('dotenv').config();

// Utility function to generate random time within a 2-hour block
const getRandomTimeInBlock = (blockStartHour) => {
    const date = new Date();
    date.setHours(blockStartHour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
    return date;
};

// Generate a schedule for the day
const generateDailySchedule = () => {
    const schedule = [];
    for (let i = 0; i < 12; i++) { // Generate 12 times
        const startTime = i * 2; // Calculate the start hour of the block
        const endTime = startTime + 2; // Calculate the end hour of the block
        const randomOffset = Math.floor(Math.random() * 2); // Generate either 0 or 1
        const selectedHour = startTime + randomOffset;
        schedule.push(getRandomTimeInBlock(selectedHour, selectedHour + 2));
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
    const ids = ['0s8WGX', '27joIB', '3eJSzE', '4ocrwb', '5rW3Lz', '6SjtEP', '7Hi0qq', '7x2x3o', 'Aq9L5W', 'CaucPx', 'FI7Ds4', 'FMClpd', 'NY8dlF', 'OY4swd', 'OzsWiC', 'QYrNYF', 'Rkmwm1', 'TVHsSv', 'V7MLWD', 'XHZaaz', 'XbH2HT', 'Z6dJuT', 'ZjwVSr', 'aF0Ntc', 'cpCIpY', 'ct9wiF', 'cuQdk2', 'd7Lwxl', 'dD4qIU', 'g2k4HC', 'hQewWj', 'hyKP1i', 'kihGPj', 'lqkRcV', 'mCvVF4', 'mKYorb', 'o1jQcP', 'ohxZs1', 'pYBOqj', 'r3bY1Q', 's7NWKy', 'sB86kz', 'sv7LkA', 'uDeTQ0', 'uKLVAK', 'xBW3kA', 'ybq6YZ', 'yn6qM5', 'z6OOJl', 'ziCAM5'];
    const id = ids[Math.floor(Math.random() * ids.length)];
    const numAction = Math.floor(Math.random() * 4) + 1;
    const numCondition = Math.floor(Math.random() * 3);
    const size = (Math.random() * 3).toFixed(2);
    const time = scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let conditionText = "";
    if (numCondition > 0) {
        conditionText = `, ${numCondition} condition`;
    }

    return `Slater ${id} just executed a ${numAction} action${conditionText} on-chain operation [${size} ETH] on [slate.ceo](https://slate.ceo/?utm_source=discord&utm_medium=general&utm_campaign=bot) at ${time}!`;
};

// Send message if current time matches any time in the schedule
const sendMessagesAfterScheduledTime = () => {
    const now = new Date();
    dailySchedule.forEach((scheduledTime) => {
        // Calculate the time 1 minute after the scheduled time
        const scheduledTimePlusOneMinute = new Date(scheduledTime.getTime() + 60000);

        // Check if the current time matches the calculated time
        if (
            now.getHours() === scheduledTimePlusOneMinute.getHours() &&
            now.getMinutes() === scheduledTimePlusOneMinute.getMinutes()
        ) {
            const message = getRandomMessage(scheduledTime);
            const channel = client.channels.cache.get('1163873322275184746');
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
});

client.login(process.env.BOT_TOKEN);

// //TEST FUNCTIONS

// // Test function to print the generated messages to the console
// const checkAndPrintMessages = () => {
//     const now = new Date();
//     dailySchedule.forEach((scheduledTime) => {
//         if (now.getHours() === scheduledTime.getHours() && now.getMinutes() === scheduledTime.getMinutes()) {
//             const message = getRandomMessage(scheduledTime);
//             console.log(message); // Print the message to the console
//         }
//     });
// };

// // Test function to display the generated schedule and messages
// const testBotScript = () => {
//     console.log('Generated Daily Schedule:');
//     dailySchedule.forEach(time => console.log(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })));

//     // Simulate each minute of the day
//     for (let hour = 0; hour < 24; hour++) {
//         for (let minute = 0; minute < 60; minute++) {
//             // Create a date object for the current simulated time
//             const now = new Date();
//             now.setHours(hour, minute, 0);

//             // Check against each scheduled time
//             dailySchedule.forEach((scheduledTime) => {
//                 // Calculate the time 1 minute after the scheduled time
//                 const scheduledTimePlusOneMinute = new Date(scheduledTime.getTime() + 60000);

//                 // Check if the current simulated time matches the calculated time
//                 if (
//                     now.getHours() === scheduledTimePlusOneMinute.getHours() &&
//                     now.getMinutes() === scheduledTimePlusOneMinute.getMinutes()
//                 ) {
//                     const message = getRandomMessage(scheduledTime);
//                     console.log(`[${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${message}`);
//                 }
//             });
//         }
//     }
// };

// testBotScript(); // Run the test script