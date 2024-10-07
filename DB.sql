--
-- Notes:
--
--   Using TIMESTAMP WITH TIMEZONE for times following this recommendation:
--     https://justatheory.com/2012/04/postgres-use-timestamptz/
--

DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS dupr_players CASCADE;
DROP TABLE IF EXISTS discord_members CASCADE;

-- --------------------------------------------------------------
--
-- dupr_players
--
-- Holds cached info of player DUPR info.
--
-- --------------------------------------------------------------

CREATE TABLE dupr_players (
    dupr_site_id            BIGINT PRIMARY KEY,
    dupr_id                 TEXT,
    
    dupr_fullName           TEXT,
    dupr_email              TEXT,
    dupr_phone              TEXT,

    dupr_age                SMALLINT,
    dupr_gender             TEXT,
    dupr_birthdate          TEXT,
      
    dupr_shortAddress       TEXT,
    dupr_formattedAddress   TEXT,

    dupr_singles            TEXT,
    dupr_singlesProvisional BOOLEAN,
    
    dupr_doubles            TEXT,
    dupr_doublesProvisional BOOLEAN,

    last_updated            TIMESTAMP WITH TIME ZONE
);

CREATE INDEX dupr_players_idx ON dupr_players (dupr_id);

CREATE TABLE discord_members (
    discord_userId          TEXT PRIMARY KEY,  -- could be a BIGINT but too big for JS
    
    discord_displayName     TEXT,
    discord_nickname        TEXT,

    discord_avatarURL       TEXT,

    discord_roleNames       TEXT[],
    
    last_updated            TIMESTAMP WITH TIME ZONE
);

CREATE TABLE players (
    player_id               SERIAL PRIMARY KEY,

    dupr_site_id            BIGINT REFERENCES dupr_players(dupr_site_id) DEFERRABLE,
    discord_userId          TEXT REFERENCES discord_members(discord_userId) DEFERRABLE
);

