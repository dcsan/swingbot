const SCALAR = 1000       // points

const TraderLib = {
  calcPoints(val: number | undefined): number {
    if (!val) return 0
    return Math.round(val * SCALAR)
  }
}

export default TraderLib