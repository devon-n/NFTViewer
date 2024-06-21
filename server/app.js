const express = require('express')
const ethers = require('ethers')
const cors = require('cors')

const { processRequest } = require('./processRequest')

const app = express()
app.use(cors())
app.use(express.json())

const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/pudgyPenguins', async (req, res) => {
    const walletAddress = req.query.walletAddress

    if (!ethers.isAddress(walletAddress)) {

        res.status(400).json({ message: "Not a valid ethereum address" })

    } else {

        const response = await processRequest(req.query.walletAddress)
        res.status(200).json(response)

    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})