const { Events, Client, IntentsBitField } = require('discord.js');

// @ts-ignore   (ignore missing .d.ts file for this)
import { BOT_TOKEN, SERVER_ID, DISCORD_SERVER_CHANNEL_ID, SESH_USER_ID } from './config';

let client:any = null;
let guild:any = null;

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
            
            guild = await client.guilds.fetch(SERVER_ID);

            resolve();
        });

        clientInit.login(BOT_TOKEN);
    });
}

export async function getMembers() {
    if (guild == null) {
        throw new Error("Pickler can't get members until guild is set");
    }
    
    const members = await guild.members.fetch();

    members.each( (member:any) => {
        console.log(`\nListing of ${guild.name} member:\n`,
                    JSON.stringify(member, null, 4));

        member.roles.cache.map( (role:any) => {
            console.log(`Role: ${role.name}\n`);
        });

        // member.roles.forEach( (roleId:string) => {
        // console.log(`\n Role ${roleId}`);
        // });
    });

    return;
}

async function getMember (gld:any, id:string) {
    return await gld.members.fetch(id);
}

interface MessageEmbeds {
    title : string|null,
    attendeeIds : Array<string>
};


async function discordGetMsgAttendees (msg:any) {
    let message = await msg.fetch(true);

    let result: MessageEmbeds = {
        title : null,
        attendeeIds : []
    }

    if (message.author.id === SESH_USER_ID) {
        console.log(`\n`, JSON.stringify(message, null, 4));

        if (Array.isArray(message.embeds)) {
            message.embeds.forEach( (embed:any) => {
                if (!result.title && embed.title) {
                    result.title = embed.title;
                }
                if (Array.isArray(embed.fields)) {
                    embed.fields.forEach( (field:any) => {
                        if (field.name.startsWith("Attendees ")) {
                            let re = /\<@(\d+)\>/g;
                            const matches = field.value.matchAll(re);
                            for (const match of matches) {
                                result.attendeeIds.push(match[1]);
                            }
                        }
                    });
                }
            })
        }
    }
    
    return result;
}

async function getAttendeeInfo(eventInfo:any) {
    console.log(`${eventInfo.title ? eventInfo.title : '[uknown]'} attendees : `, eventInfo.attendeeIds);

    let funcs:Array<any> = [];
        
    eventInfo.attendeeIds.forEach( (id:string)  => funcs.push(getMember(guild, id)) );
    let memberInfo = await Promise.all(funcs);

    memberInfo.map( (member:any) => {
        console.log(`    ${member.displayName} / ${member.id} / ${member.user.id}`);
    });
}


export async function discordGetAttendees() {
    if (client == null || guild == null) {
        throw new Error("Pickler can't get attendees until client & guild are set");
    }
    
    const channel = await client.channels.fetch(DISCORD_SERVER_CHANNEL_ID);
            
    console.log(`\nListing of ${guild.name} channel ${channel.name} info:\n`,
                JSON.stringify(channel, null, 4));

    const messages = await channel.messages.fetch();  // returns a Collection object
            
    // console.log(`\nListing channel ${channel.name} [${typeof messages}] messages:\n`,
    // JSON.stringify(messages, null, 4));
            
    console.log(`\n\nListing channel ${channel.name} SESH messages:\n`);
    let funcs:Array<any> = [];
    
    messages.each( (msg:any) => funcs.push( discordGetMsgAttendees(msg) ) );
    let results:Array<any> = await Promise.all(funcs);

    // For each event message, get attendee info
    funcs = results.map( (eventInfo:any) => getAttendeeInfo(eventInfo) );
    await Promise.all(funcs);

}

