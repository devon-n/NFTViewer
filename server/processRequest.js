
const ethers = require('ethers')
require('dotenv').config()

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL)
const abi = '[{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"walletOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"}]'
const contract = new ethers.Contract(process.env.PUDGY_PENGUINS_ADDRESS, abi, provider)

async function processRequest(walletAddress) {
    try {

        // Call pudgyPengiuns Contract walletOfOwner to get tokenids
        const tokenIds = await contract.walletOfOwner(walletAddress)
        if (tokenIds.length == 0) return []

        // Send alchemy those wallet ids
        const alchemyReponse = await alchemyRequest(tokenIds)

        // Parse response from alchemy
        const parsedResponse = alchemyReponse.map(token => ({
            cachedUrl: token.image.cachedUrl,
            metadata: token.raw,
        }))

        // Send back in request only the necessary data
        return parsedResponse

    } catch (error) {
        console.error(`\nError Processing Request ${error}\n`)
    }
}

async function alchemyRequest(tokenIds) {
    try {

        // Batch ids by 100
        const batchSize = 100;
        // Create tokens array of objects for request
        const tokens = tokenIds.map(tokenId => ({
            contractAddress: process.env.PUDGY_PENGUINS_ADDRESS,
            tokenId: Number(tokenId),
            tokenType: 'ERC721'
        }))

        // Build results array
        const results = []
        for (let i = 0; i < tokens.length; i += batchSize) {
            const batch = tokens.slice(i, i + batchSize);
            const batchResult = (await fetchBatch(batch))?.nfts;
            if (Array.isArray(batchResult)) results.push(...batchResult)
        }

        return results

    } catch (error) {
        console.error(`\nError Requesting Data From Alchemy: ${error}\n`)
        return [];
    }
}

// Function to handle the API request for a batch
const fetchBatch = async (batch) => {
    try {
        // Create Request
        const options = {
            method: 'POST',
            headers: { accept: 'application/json', 'content-type': 'application/json' },
            body: JSON.stringify({
                tokens: batch,
                refreshCache: false
            })
        }

        // Send request
        const response = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTMetadataBatch`, options)
        return await response.json()

    } catch (error) {
        console.error(`\nError Fetching Batch: ${error}`)
        return []
    }
}

module.exports = { processRequest }