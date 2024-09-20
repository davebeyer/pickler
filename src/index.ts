import { initPicklerAPI } from './picklerbot';

async function init () {
    await initPicklerAPI();
}

init().then( () => {
    console.log("Done init");
});



