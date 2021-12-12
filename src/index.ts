import { createServer, IncomingMessage, ServerResponse } from 'http'
import { MiniDB } from './modules/minidb'
import { shuffleArray } from './modules/random'
import { User } from './modules/user'

const host = '0.0.0.0'
const port = 8081

async function main() {
    const db = new MiniDB<User>('storage/data.json')
    await db.load()
    const users = db.keys()
    const assignees = Object.fromEntries(
        shuffleArray(users)
            .map((v, i) => [users[i], v])
    )
    createServer((req, res) => {
        const finalize = (code: number) => {
            res.statusCode = code
            res.end()
        }
        if (!req.url) {
            return finalize(400)
        }
        const urlParts = req.url!.split('/')
        if (urlParts[1] !== 'addressee' || urlParts.length !== 3 || !db.has(urlParts[2])) {
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
    }).listen(port, host)
}
main()