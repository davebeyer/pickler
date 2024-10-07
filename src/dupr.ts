import {get, post} from './utils';

import {DUPR_USERNAME, DUPR_PASSWORD, PAPC_CLUB_ID} from './config';

const DuprBaseUrl = 'https://api.dupr.gg';
// const DuprBaseUrl = 'https://events.mydupr.com';
const DuprVer = 'v1.0';


let AccessToken:(string|null) = null;

let PaloAltoClubId:(number|string|null) = null;

let PaloAltoMembers:(Array<any>) = [];


function makeVerPartUrl(prefix:string, suffix:string) {
    return `${prefix}/${DuprVer}/${suffix}`;
}    

function makeUrl(category:string, endPoint:string) {
    return `${DuprBaseUrl}/${makeVerPartUrl(category, endPoint)}`
}

function makeClubUrl(clubId:string|number, type:string, endPoint:string) {
    return `${DuprBaseUrl}/club/${clubId}/${makeVerPartUrl(type, endPoint)}`;
}

function reqConfig() {
    if (!AccessToken) {
        throw new Error("DUPR: Unable to do authenticated request before logging in");
    }

    return {
        headers: {
            'authorization': 'Bearer ' + AccessToken,
            'accept': 'application/json'
        }
    }
}


export async function initDuprAPI() {
    let url = makeUrl('auth', 'login');
    let params = {
        email : DUPR_USERNAME,
        password : DUPR_PASSWORD
    };

    const response = await post(url, params);

    console.log("DUPR login: ", JSON.stringify(response, null, 4));

    if (response.result && response.result.accessToken) {
        AccessToken = response.result.accessToken;
    }

    // await getClubs(); // sets PaloAltoClubId

    // Now just assume PAPC_CLUB_ID is fixed PaloAltoClubId 
    PaloAltoClubId = PAPC_CLUB_ID;
    await getClub(PaloAltoClubId); // sets PaloAltoClubId
}

export async function getClub(clubId:number|string) {
    let url = `${DuprBaseUrl}/club/${DuprVer}/${clubId}`;
    let params = null;

    const response = await get(url, params, reqConfig());
    
    console.log("DUPR PAPC club info: ", JSON.stringify(response, null, 4));
}

export async function getClubs() {
    let url = makeUrl('club', 'all');
    let params:(any|null) = {
        limit : 25,
        offset : 0,
        own : 'true',
        query : '*'
    };

    // DEBUGGING
    url += '?limit=25&offset=0&own=true&query=*';
    params = null;

    const response = await get(url, params, reqConfig());
    
    console.log("DUPR clubs: ", JSON.stringify(response, null, 4));

    if (response.result && response.result.hits) {
        response.result.hits.forEach( (hit:any) => {
            if (hit.clubName.match(/palo alto pickleball club/i)) {
                PaloAltoClubId = hit.clubId;
            }
        });
    }
}

export async function duprGetMembers(clubId?:string|number) {
    if (!clubId) {
        if (!PaloAltoClubId) {
            throw new Error("DUPR: Unable to duprGetMembers() before getting club ID");
        }
        clubId = PaloAltoClubId;
    }

    let url = makeClubUrl(clubId, 'members', 'all');
    let data = {
        "exclude": [
        ],
        "filter": {
        },
        "includePendingPlayers": false,
        "includeStaff": true,
        "limit": 25,
        "offset": 0,
        "query": "*",
        "sort": {
            "order": "ASC",
            "parameter": "fullNameSort"
        }
    }

    PaloAltoMembers = [];
    let response:any = {};

    do {
        response = await post(url, data, reqConfig());

        if (response.result != null && response.result.hits != null) {
            PaloAltoMembers = PaloAltoMembers.concat(response.result.hits);
        }
        
        data.offset += 25;
    } while (response.result && response.result.hasMore)

    // Do case-insensitive sort
    PaloAltoMembers.sort( (x:any, y:any) => {
        if (x.fullName.toLowerCase() < y.fullName.toLowerCase()) {
            return -1;
        } else {
            return 1;
        }
    });

    console.log(`DUPR getAllMembers -- ${PaloAltoMembers.length} total members`);

    console.log("First member: ", JSON.stringify(PaloAltoMembers[0], null, 4));

    PaloAltoMembers.forEach((member:any) => {
        let rating = `doubles ${member.doubles}`;
        if (member.doublesProvisional) {
            rating += '*';
        }

        rating += `,singles ${member.singles}`;
        if (member.singlesProvisional) {
            rating += '*';
        }

        let adr = member.formattedAddress + member.shortAddress;
        let resident;
        if (adr.toLowerCase().includes('palo alto')) {
            resident = 'Resident';
        } else {
            resident = 'Non-Resident';
        }
    
        console.log(`${member.duprId},${member.id},"${member.fullName}",${member.email},${member.phone},${member.age},${resident},${rating}`);
    });
}

