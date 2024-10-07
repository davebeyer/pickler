import { initPicklerAPI, discordGetAttendees } from './picklerbot';
import { initDuprAPI, duprGetMembers } from './dupr';


async function init () {
    await initPicklerAPI();
    await initDuprAPI();
    
    await duprGetMembers();
    await discordGetAttendees();
}

init().then( () => {
    console.log("Done init");
});
