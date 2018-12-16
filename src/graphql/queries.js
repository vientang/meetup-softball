// eslint-disable
// this is an auto generated file. This will be overwritten

export const getGameStats = `query GetGameStats($id: ID!) {
  getGameStats(id: $id) {
    id
    meetupId
    name
    date
    gameId
    year
    month
    fieldName
    tournamentName
    winners
    losers
  }
}
`;
export const getGameStatsByYear = `query GetGameStatsByYear($year: String!) {
  getGameStatsByYear(year: $year) {
    id
    meetupId
    name
    date
    gameId
    year
    month
    fieldName
    tournamentName
    winners
    losers
  }
}
`;
export const listGameStats = `query ListGameStats(
  $filter: TableGameStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameStats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      meetupId
      name
      date
      gameId
      year
      month
      fieldName
      tournamentName
      winners
      losers
    }
    nextToken
  }
}
`;
