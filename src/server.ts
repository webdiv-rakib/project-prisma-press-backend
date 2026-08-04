import app from "./app"
import "dotenv/config";
import { prisma } from "./lib/prisma"

const port = process.env.PORT

async function main() {
    try {
        // await prisma.$connect();
        console.log('Connected to the database successfully')
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
        // await prisma.$disconnect();
    }
}
main();