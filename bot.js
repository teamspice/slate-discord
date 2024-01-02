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

// Array of prompts for inorganic executions
const prompts = [
    "swap 60 $usdc for $weth and lend $weth on aave every hour starting at 7pm est",
    "bridge 200 usdt from ethereum to arbitrum and buy pepe when $pepe hits $0.00000136 and gas is sub 35",
    "withdraw 85 usdt from curve on ethereum when gas is below 25",
    "bridge 50 USDC from base to arbitrum and sell it for arb on arbitrum",
    "buy $jones on arbitrum using all of my usdt",
    "withdraw 5000 usdc from my position in the curve 3pool on ethereum",
    "swap 0.70 eth for xrp on ethereum when xrp market cap hits $3.75 billion",
    "bridge all of my eth from ethereum to arbitrum tomorrow at this time",
    "buy 1 eth with my usdc and deposit in uniswap eth-usdc pool on ethereum",
    "deposit all of my $steth into the curve steth pool when the base apy hits 0.85%",
    "withdraw 605 dai from curve and buy usdc on ethereum",
    "sell half of my $uni on ethereum for $usdt",
    "bridge 2 eth to zksync, swap it all for usdc, then swap all of the usdc for eth, then swap all of the eth for usdc, then swap all of the usdc for eth",
    "bridge all of my tokens on zksync to ethereum and transfer it all to [wallet address] on ethereum",
    "sell eth for 1000 usdt and lend it all on aave on ethereum when usdt supply apy hits 7%",
    "stake 10 eth on lido in exactly 3 days",
    "swap all of my usdt for 1.2 eth and 2000 usdc and deposit it all into the uniswap eth-usdc pool on ethereum",
    "bridge 0.04 eth from arbitrum to base and buy toshi",
    "swap 225 usdc for eth on ethereum when gas is below 45",
    "sell 1.2 wbtc for eth on ethereum",
    "sell usdc for 1.3 weth on uniswap and deposit it in aave on ethereum",
    "deposit all of my wbtc into the curve tricrypto2 pool when the apy hits 0.95%",
    "when gas is below 40, bridge 0.15 eth to from ethereum to zksync",
    "bridge 2.5 eth from ethereum to avalanche and buy mim",
    "swap 500 usdc for $doge on ethereum when $doge price is $0.085 and gas is sub 40",
    "bridge 1 eth from arbitrum to ethereum using bungee and buy $uni with it",
    "swap all my eth and link for usdt on ethereum and bridge it all to arbitrum",
    "buy $wld with 3 eth and transfer it to [wallet address] on ethereum",
    "swap all of my $jones for eth on arbitrum and bridge it all to ethereum",
    "swap 0.55 eth for usdt on ethereum",
    "buy 710 usdt with eth and lend it all on aave",
    "bridge 120 usdc from base to arbitrum in 90 minutes",
    "swap 120 $usdc for $wbtc and lend $wbtc on lodestar every day at this time",
    "withdraw all of the wavax i have in the gmx wavax-usdc pool on arbitrum",
    "on polygon, swap all of my $dai to $matic and swap all of my $frax for $link",
    "buy 100 usdc with my $jones on arbitrum and lend it on lodestar in 15 minutes",
    "swap 500 usdc for steth and deposit it all into pendle on ethereum",
    "swap 1 eth for usdc on uniswap at midnight tonight",
    "bridge all of my tokens from ethereum to optimism and swap it all to $op",
    "deposit 1 eth and 1250 usdc into the eth-usdc pool on uniswap",
    "bridge 5 eth from arbitrum to ethereum using jumper",
    "deposit 1 eth and 2000 usdc the uniswap eth-usdc pool",
    "deposit all of my weth into aave on ethereum when weth price hits $2600",
    "swap eth for 1100 dai and lend it all on aave on ethereum when dai supply apy hits 8%",
    "buy 120 $idea with my $matic on polygon when $idea market cap hits $1500000",
    "buy gohm with 3 weth on avalanche in 1 hour and 20 minutes",
    "buy 1350 bald with my usdbc on base in 40 minutes",
    "sell 1000 $blur for weth on ethereum when $blur market cap hits $750 million",
    "every monday at 1pm utc, withdraw 0.1 eth from aave, bridge it to optimism and buy $op",
    "transfer all USDC to [wallet address] on ethereum when eth price hits $2600 and gas is sub 40",
    "bridge all of my tokens on linea to ethereum when gas is sub 35",
    "swap 110 eth for usdc on ethereum in 12 hours",
    "sell all of my $dai and $usdt for $icp on ethereum",
    "when gas is sub 40, bridge 0.5 eth worth of dai from ethereum to arbitrum",
    "swap all of my tokens on optimism to weth and bridge all of that weth to arbitrum",
    "bridge 153 usdc from base to arbitrum using hop protocol",
    "buy $cyber with usdc on base when $cyber price hits $7 on base",
    "sell $bal for usdc when $bal price drops to $4.00 on base",
    "bridge 2 eth from arbitrum back to ethereum and buy $shib with it",
    "buy grail with 4 weth on arbitrum at 18:00 GMT+8 in 2 days",
    "bridge 500 usdt from base to arbitrum in two days at this time",
    "swap eth for 50 spa and deposit it all into plutus on arbitrum",
    "swap all of my shib to pepe on ethereum at 8:30 PM GMT+2 tomorrow",
    "buy usdc.e with all of my $jones and lend it all on lodestar",
    "withdraw 125 arb from the gmx arb-usdc pool on arbitrum",
    "sell eth for 1000 usdt and lend it all on aave on ethereum",
    "swap eth for 100 usdc and deposit it all into the gmx weth-usdc pool on arbitrum every monday at 7pm utc",
    "swap 500 usdt for eth, swap 205 usdc for eth, bridge all of the eth from ethereum to arbitrum",
    "swap 550 usdc to $grail via camelot on arbitrum when $grail hits $1700",
    "in 45 minutes, bridge 600 usdc from optimism to ethereum and buy pepe",
    "swap all of my doge, shib and pepe to eth and deposit it into rocket pool on ethereum when gas is sub 50",
    "buy 150 usdc.e with eth on arbitrum and deposit on gmx",
    "swap 0.65 eth for usdc on ethereum when eth hits $2500",
    "stake 3.9 eth on rocket pool on ethereum at noon tomorrow",
    "sell all of my grail on arbitrum for usdc.e",
    "bridge 1 $eth from ethereum to arbitrum, buy $gmx with it, stake all of the $gmx on gmx on arbitrum",
    "sell mbs for bald when mbs market cap drops to $13,000,000 on base",
    "bridge all of my tokens from binance smart chain back to ethereum and transfer them all to [wallet address] on ethereum",
    "deposit 50 $frax into the curve fraxusdp pool on ethereum when gas is below 50",
    "bridge all of my eth from arbitrum to ethereum and transfer it to [wallet address] on ethereum",
    "buy $blur with half of my $weth on ethereum",
    "deposit 0.4 eth into aave every monday at 12pm est",
    "swap 2 eth to usdc on ethereum and repay my usdc position on aave",
    "stake 100 of my $pls on plutus on arbitrum"
];

// Counter of the current prompt index for inorganic executions
let currentPromptIndex = 0;


// HANDLES SENDING DISCORD MESSAGES FOR ORGANIC EXECUTIONS

// Initialize lastTimestamp to the current time in seconds
let lastTimestamp = Date.now() / 1000;

// Function to create a message from an entry object
function createMessage(entry) {
    const prompt = entry.prompt;
    const eventTime = new Date(parseInt(entry.timestamp) * 1000);
    const time = eventTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return `A Slater just executed "${prompt}" on-chain via [slate.ceo](https://slate.ceo/?utm_source=discord&utm_medium=general&utm_campaign=bot) at ${time} EST!`;
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
            client.channels.cache.get('1163873322275184746').send(combinedMessage);
            combinedMessage = message + '\n\n';
        } else {
            combinedMessage += message + '\n\n';
        }
    });

    if (combinedMessage.length > 0) {
        client.channels.cache.get('1163873322275184746').send(combinedMessage);
    }

    lastTimestamp = entries[entries.length - 1].timestamp + 1;
}

// Function to fetch new prompts from the API
async function fetchNewEntries() {
    try {
        const res = await axios.get(`${walletApiUrl}/new-prompts?timestamp=${Math.floor(lastTimestamp)}`);
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

// Generate a schedule of random executions for the day
const generateDailySchedule = () => {
    const schedule = [];
    for (let i = 0; i < 12; i++) {
        const randomHour = Math.floor(Math.random() * 24); // Random hour between 0 and 23
        const randomMinute = Math.floor(Math.random() * 60); // Random minute between 0 and 59
        const randomSecond = Math.floor(Math.random() * 60); // Random second between 0 and 59
        const scheduledTime = new Date();
        scheduledTime.setHours(randomHour, randomMinute, randomSecond, 0);
        const randomMinutes = Math.floor(Math.random() * 5) + 1; // Random minutes between 1 and 5

        schedule.push({ scheduledTime, randomMinutes });
    }
    return schedule.sort((a, b) => a.scheduledTime - b.scheduledTime); // Sort the schedule by time
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
    const time = scheduledTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const prompt = prompts[currentPromptIndex];
    
    // Update the current index, loop back if at the end of the array
    currentPromptIndex = (currentPromptIndex + 1) % prompts.length;

    return `A Slater just executed "${prompt}" on-chain via [slate.ceo](https://slate.ceo/?utm_source=discord&utm_medium=general&utm_campaign=bot) at ${time} EST!`;
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