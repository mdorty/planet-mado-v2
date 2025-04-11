export interface Character {
  id: string
  name: string
  race: string
  planet?: string | null
  alignment: number
  basePowerlevel: number
  currentPowerlevel: number
  hiddenPowerlevel?: number | null
  description?: string | null
  createdAt: Date
  updatedAt: Date
  lastDeath?: Date | null
  deathCount: number
  lastDateTrained?: Date | null
  lastDateMeditated?: Date | null
  peopleMet?: string | null
  jobs?: string | null
  userId: string
  abilityCount: number
}
