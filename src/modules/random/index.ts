export function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * (arr.length - 1))]
}

function newRandom(old: number, range: number): number {
    const value = Math.floor(Math.random() * (range + 1));
    if (value !== old) {
        return value
    }
    return newRandom(old, range)
}

export function shuffleArray(array: string[]) {
    const result = array.slice(0)
    for (let i = result.length - 1; i > 0; i--) {
        const safeRandom = (): number => {
            const j = Math.floor(Math.random() * (i + 1));
            if (array[i] !== result[j]) {
                return j
            }
            return safeRandom()
        }
        const j = safeRandom();
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result
}