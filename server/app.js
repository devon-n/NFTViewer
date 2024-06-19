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
// TODO 0x29469395eAf6f95920E59F858042f0e28D98a20B | 340 NFTs
// 0xcce98763ff5a9Ff5bAF8b15aBC456077a1e84f2A | 1 NFT

app.get('/pudgyPenguins', async (req, res) => {
    const walletAddress = req.query.walletAddress

    if (!ethers.isAddress(walletAddress)) {

        res.status(400).json({ message: "Not a valid ethereum address" })

    } else {

        const response = await processRequest(req.query.walletAddress)
        res.send(JSON.stringify(response))

    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})