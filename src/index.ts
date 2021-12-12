import { createServer, IncomingMessage, ServerResponse } from 'http'
import { MiniDB } from './modules/minidb'
import { shuffleArray } from './modules/random'
import { User } from './modules/user'

const HOST = '0.0.0.0'
const PORT = 8081
const DB_PATH = 'storage/db.json'
const API_PATH = 'addressee'

function createFinalizer (res: ServerResponse) {
    return (code: number) => {
        res.statusCode = code
        res.end()
    }
}

async function main() {
    const db = new MiniDB<User>(DB_PATH)
    await db.load()
    const users = db.keys()
    const assignees = Object.fromEntries(
        shuffleArray(users)
            .map((v, i) => [users[i], v])
    )
    createServer((req, res) => {
        const finalize = createFinalizer(res)
        if (!req.url) {
            return finalize(400)
        }
        const urlParts = req.url!.split('/')
        if (urlParts[1] !== API_PATH || urlParts.length !== 3 || !db.has(urlParts[2])) {
            return finalize(404)
        }
        const userId = assignees[urlParts[2]]
        const user = db.get(userId)
        if (user.shown) {
            return finalize(410)
        }
        res.write(JSON.stringify(user) + '\n')
        finalize(200)
        db.set(userId, {
            ...user,
            shown: true
        })
    }).listen(PORT, HOST)
}
main()