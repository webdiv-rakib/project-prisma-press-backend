import app from "./app"

const port = 3000

async function main() {
    try {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}
main();