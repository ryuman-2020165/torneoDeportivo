export class TeamModel {
  constructor(
    public id: string,
    public name: string,
    public country: string,
    public proGoals: number,
    public againstGoals: number,
    public differenceGoals: number,
    public playedMatches: number,
  ) {}
}
