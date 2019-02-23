// eslint-disable
// this is an auto generated file. This will be overwritten

export const getGameStats = `query GetGameStats($id: ID!) {
  getGameStats(id: $id) {
    id
    name
    meetupId
    gameId
    date
    year
    month
    field
    tournamentName
    lat
    lon
    time
    timeStamp
    rsvps
    waitListCount
    winners
    losers
  }
}
`;
export const listGameStatss = `query ListGameStatss(
  $filter: ModelGameStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameStatss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      meetupId
      gameId
      date
      year
      month
      field
      tournamentName
      lat
      lon
      time
      timeStamp
      rsvps
      waitListCount
      winners
      losers
    }
    nextToken
  }
}
`;
export const getPlayerStats = `query GetPlayerStats($id: ID!) {
  getPlayerStats(id: $id) {
    id
    name
    joined
    meetupId
    profile
    admin
    photos
    status
    gender
    games
  }
}
`;
export const listPlayerStatss = `query ListPlayerStatss(
  $filter: ModelPlayerStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlayerStatss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      joined
      meetupId
      profile
      admin
      photos
      status
      gender
      games
    }
    nextToken
  }
}
`;
