const { Events, Client, IntentsBitField } = require('discord.js');

// @ts-ignore   (ignore missing .d.ts file for this)
import { BOT_TOKEN, SERVER_ID } from './config';

let client = null;

export function initPicklerAPI() {
    return new Promise<void> ((resolve) => {

        const clientInit = new Client({
            intents : [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ],
        });


        clientInit.once("ready", async (c:any) => {
            // set global variable
            client = c;
            console.log(`Logged in to Pickler app bot as ${client.user.tag}`);
            
            const guild = await client.guilds.fetch(SERVER_ID);

            const members = await guild.members.fetch();

            console.log(`\nListing of ${guild.name} members:\n`,
                        JSON.stringify(members, null, 4));

            resolve();
        });

        clientInit.login(BOT_TOKEN);
    });
}
