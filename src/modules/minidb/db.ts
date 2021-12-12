import { readFile, writeFile } from 'fs/promises'

export class MiniDB<T> {
    private data: {[key: string]: T} = {}
    private lock = false
    constructor(
        public readonly fileName: string
    ) {
        
    }

    load() {
        return readFile(this.fileName, { encoding: 'utf-8' })
            .then(JSON.parse)
            .then(data => { this.data = data })
    }

    set(key: string, value: T) {
        this.data[key] = value
        return this.flush()
    }

    keys() {
        return Object.keys(this.data)
    }

    setRaw(v: any) {
        this.data = v
        return this.flush()
    }

    has(key: string) {
        return key in this.data
    }

    get(key: string) {
        return this.data[key]
    }

    private whenUnlocked() {
        return new Promise(resolve => {
            while (this.lock) { }
            resolve(true)
        })
    }

    private flush() {
        return this.whenUnlocked()
            .then(() => { this.lock = true })
            .then(() => writeFile(this.fileName, JSON.stringify(this.data)))
            .then(() => { this.lock = false })
    }
}