const { Events, Client, IntentsBitField } = require('discord.js');

// @ts-ignore   (ignore missing .d.ts file for this)
import { BOT_TOKEN, SERVER_ID, PB_FUN_EVENTS_CHANNEL_ID, SESH_USER_ID } from './config';

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

            const channel = await client.channels.fetch(PB_FUN_EVENTS_CHANNEL_ID);
            
            console.log(`\nListing of ${guild.name} channel ${channel.name} info:\n`,
                        JSON.stringify(channel, null, 4));

            const messages = await channel.messages.fetch();  // returns a Collection object
            
            // console.log(`\nListing channel ${channel.name} [${typeof messages}] messages:\n`,
            // JSON.stringify(messages, null, 4));
            
            console.log(`\n\nListing channel ${channel.name} SESH messages:\n`);
            messages.each( async (msg:any) =>  {
                let message = await msg.fetch(true);
                if (message.author.id === SESH_USER_ID) {
                    console.log(`\n`, JSON.stringify(message, null, 4));

                    let title:string|null = null;
                    let attendeeIds: any[] = [];
                    
                    if (Array.isArray(message.embeds)) {
                        message.embeds.forEach( (embed:any) => {
                            if (!title && embed.title) {
                                title = embed.title;
                            }
                            if (Array.isArray(embed.fields)) {
                                embed.fields.forEach( (field:any) => {
                                    if (field.name.startsWith("Attendees ")) {
                                        let re = /\<@(\d+)\>/g;
                                        const matches = field.value.matchAll(re);
                                        for (const match of matches) {
                                            attendeeIds.push(match[1]);
                                        }
                                    }
                                });
                            }
                        })
                    }

                    
                    console.log(`${title ? title : '[uknown]'} attendees : `, attendeeIds);
                        
                    attendeeIds.forEach( async (id:string) => {
                        let attendee = await guild.members.fetch(id);
                        console.log(`    ${attendee.displayName} / ${attendee.id} / ${attendee.user.id}`);
                    });

                    /*
                    console.log('\nReactions:\n');  // These are the thumbsUp, smiley, etc.
                    message.reactions.cache.forEach( async (reaction:any) => {
                        console.log(`\n Emoji ${reaction._emoji.name}\n`);
                        let reactUsers = await reaction.users.fetch();
                    });
                    */
                    console.log('\n==============\n');
                }
            });
            
            resolve();
        });

        clientInit.login(BOT_TOKEN);
    });
}
