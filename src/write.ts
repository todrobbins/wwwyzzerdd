import { getAuthToken, ANON_TOKEN } from "./auth";
import { retryWikimediaPromise } from "./util";
import { getConfig, ConfigObject } from "./config";
import {saveLastQidProperty} from "./propertyData";
import { StepLabel } from "@material-ui/core";

const commentText = "import w/ [[Wikidata:Wwwyzzerdd|🧙 Wwwyzzerdd for Wikidata]]";


export async function addItemClaim(entity: string, property: string, qid: string, commentAddendum?: string): Promise<any> {
    saveLastQidProperty(qid, property);
    return addClaim(entity, property, {"entity-type": "item", "id": qid}, commentAddendum);
}

export async function addDateClaim(entity: string, property: string, date: any, commentAddendum?: string): Promise<any> {
    return addClaim(entity, property, date, commentAddendum);
}


export async function addIdClaim(entity: string, property: string, value: string): Promise<any> {
    return addClaim(entity, property, value);
}

export async function addClaim(entity: string, property: string, value: any, commentAddendum?: string): Promise<any> {
    let base_url = "https://www.wikidata.org/w/api.php?action=wbcreateclaim&format=json&snaktype=value&tags=wwwyzzerdd&";
    let token = await checkedGetToken();
    let wrappedValue = encodeURIComponent(JSON.stringify(value));
    let getArgs = `entity=${entity}&property=${property}&value=${wrappedValue}`;
    let summary = encodeURIComponent(commentText + (commentAddendum ? " (" + commentAddendum +")" : ""));
    let args = `token=${token}&summary=${summary}`;


    return retryWikimediaPromise(() => {
        return fetch(base_url + getArgs, {
            method: 'POST',
            body: args,
            headers: {
             "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
             "accept":"application/json, text/javascript, */*; q=0.01"
            }
        }).then((res) => res.json());
    }, 2);
}

export async function addCoordClaim(entity: string, property: string, lat: number, lon: number): Promise<any> {
    
}

async function setLabel(entity: string, language: string, text: string, commentAddendum?: string) {
    let base_url = "https://www.wikidata.org/w/api.php?action=wbsetlabel&tags=wwwyzzerdd&format=json&";
    let token = await checkedGetToken();
    let wrappedValue = encodeURIComponent(text);
    let getArgs = `id=${entity}&language=${language}&value=${wrappedValue}`;
    let summary = encodeURIComponent(commentText + (commentAddendum ? " (" + commentAddendum +")" : ""));
    let args = `token=${token}&summary=${summary}`;

    return retryWikimediaPromise(() => {
        return fetch(base_url + getArgs, {
            method: 'POST',
            body: args,
            headers: {
             "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
             "accept":"application/json, text/javascript, */*; q=0.01"
            }
        }).then((res) => res.json());
    }, 2);
}


async function setDescription(entity: string, language: string, text: string, commentAddendum?: string) {
    let base_url = "https://www.wikidata.org/w/api.php?action=wbsetdescription&tags=wwwyzzerdd&format=json&";
    let token = await checkedGetToken();
    let wrappedValue = encodeURIComponent(text);
    let getArgs = `id=${entity}&language=${language}&value=${wrappedValue}`;
    let summary = encodeURIComponent(commentText + (commentAddendum ? " (" + commentAddendum +")" : ""));
    let args = `token=${token}&summary=${summary}`;

    return retryWikimediaPromise(() => {
        return fetch(base_url + getArgs, {
            method: 'POST',
            body: args,
            headers: {
             "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
             "accept":"application/json, text/javascript, */*; q=0.01"
            }
        }).then((res) => res.json());
    }, 2);
}

async function addAlias(entity: string, language: string, text: string, commentAddendum?: string) {
    let base_url = "https://www.wikidata.org/w/api.php?action=wbsetaliases&tags=wwwyzzerdd&format=json&";
    let token = await checkedGetToken();
    // prepend with %1F to avoid splitting on pipe
    let wrappedValue = "%1F" + encodeURIComponent(text);
    let getArgs = `id=${entity}&language=${language}&add=${wrappedValue}`;
    let summary = encodeURIComponent(commentText + (commentAddendum ? " (" + commentAddendum +")" : ""));
    let args = `token=${token}&summary=${summary}`;

    return retryWikimediaPromise(() => {
        return fetch(base_url + getArgs, {
            method: 'POST',
            body: args,
            headers: {
             "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
             "accept":"application/json, text/javascript, */*; q=0.01"
            }
        }).then((res) => res.json());
    }, 2);
}

export async function addString(entity: string, field: string, language: string, text: string): Promise<any> {
    if (field == "description") {
        await setDescription(entity, language, text);
    } else if (field == "label") {
        await setLabel(entity, language, text);
    } else if (field == "alias") {
        await addAlias(entity, language, text);
    } else {
        throw new Error(`Unexpcted field type "${field}" when setting string.`);
    }
}

function currentTimeValue() {
    let now = new Date();
    now.setUTCSeconds(0, 0);
    now.setUTCHours(0);
    now.setUTCMinutes(0);
    let today = "+" + now.toISOString().replace(".000","");
    return {"type":"time","value":{"after":0,"before":0,"calendarmodel":"http://www.wikidata.org/entity/Q1985727","precision":11,"time":today,"timezone":0}};
}

export async function addReference(sourceUrl: string, claimId: string, wikiLanguage?: string, commentAddendum?: string) {
    let base_url = "https://www.wikidata.org/w/api.php?action=wbsetreference&format=json&tags=wwwyzzerdd&";
    let token = await checkedGetToken();
    let summary = encodeURIComponent(commentText + (commentAddendum ? " (" + commentAddendum +")" : ""));

    let PAGE_VERSION_URL_PID = "P4656";
    let IMPORTED_FROM_WIKIMEDIA_PID = "P143";
    let ENGLISH_WIKI = "Q328";
    let FRENCH_WIKI = "Q8447";
    let GERMAN_WIKI = "Q48183";
    let JAPANESE_WIKI = "Q177837";
    let SPANISH_WIKI = "Q8449";
    let RUSSIAN_WIKI = "Q206855";
    let UKRAINIAN_WIKI = "Q199698";
    let CHINESE_WIKI = "Q30239";

    let RETRIEVED_TIME_PID = "P813";
    // for now just support these top wikis
    let wikiLookup: { [key: string]: string; } = {
        "en": ENGLISH_WIKI,
        "fr": FRENCH_WIKI,
        "de": GERMAN_WIKI,
        "es": SPANISH_WIKI,
        "ja": JAPANESE_WIKI,
        "ru": RUSSIAN_WIKI,
        "uk": UKRAINIAN_WIKI,
        "zh": CHINESE_WIKI
    }

    let refSnack: { [key: string]: any; } = { };

    if (wikiLanguage && wikiLanguage in wikiLookup) {
        let wikiQid = wikiLookup[wikiLanguage];
        refSnack[IMPORTED_FROM_WIKIMEDIA_PID] =
            [
                {
                    snaktype: "value",
                    property: IMPORTED_FROM_WIKIMEDIA_PID,
                    datavalue: { type:"wikibase-entityid", value:{"id": wikiQid}}
                }
            ];
    }
    refSnack[RETRIEVED_TIME_PID] = [ { snaktype:"value",
                                       property: RETRIEVED_TIME_PID,
                                       datavalue: currentTimeValue()}];
    if (sourceUrl) {
        refSnack[PAGE_VERSION_URL_PID] = [{
            snaktype: "value",
            property: PAGE_VERSION_URL_PID,
            datavalue: {"type":"string", "value": sourceUrl}
        }];
    }
    let args = `token=${token}&summary=${summary}`;
    let snaks =  encodeURIComponent(JSON.stringify(refSnack));
    let getArgs = `statement=${claimId}&snaks=${snaks}`;
    return retryWikimediaPromise(() => fetch(base_url + getArgs, {
        method: 'POST',
        body: args,
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "accept":"application/json, text/javascript, */*; q=0.01"
        }
    }).then((res) => res.json()), 2);
}

async function checkedGetToken(): Promise<string> {
    let auth_token = await getAuthToken();
    if (auth_token == ANON_TOKEN) {
        // are we ok editing anonymously?
        let config = await getConfig();
        if (!config.allowAnon) {
            throw new Error("Editing Wikidata anonymously is disallowed.");
        }
    }
    let token = encodeURIComponent(auth_token);
    return token;
}
