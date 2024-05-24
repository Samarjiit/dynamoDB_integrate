const AWS = require("aws-sdk")
require("aws-sdk/lib/maintenance_mode_message").suppress = true
require("dotenv").config()

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const dynamoClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = "harry_porter_api"

const getCharacters = async () => {
  const params = { TableName: TABLE_NAME }
  try {
    const characters = await dynamoClient.scan(params).promise()
    return characters.Items
  } catch (err) {
    console.error("Error fetching characters:", err)
    throw err
  }
}

const getCharacterById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  }

  try {
    const character = await dynamoClient.get(params).promise()
    return character.Item
  } catch (err) {
    console.error(`Error fetching character with id ${id}:`, err)
    throw err
  }
}

const addOrUpdateCharacter = async (character) => {
  const params = {
    TableName: TABLE_NAME,
    Item: character,
  }
  try {
    await dynamoClient.put(params).promise()
    return character
  } catch (err) {
    console.error("Error adding/updating character:", err)
    throw err
  }
}

const deleteCharacter = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  }
  try {
    await dynamoClient.delete(params).promise()
    return { id }
  } catch (err) {
    console.error(`Error deleting character with id ${id}:`, err)
    throw err
  }
}

module.exports = {
  dynamoClient,
  getCharacters,
  getCharacterById,
  addOrUpdateCharacter,
  deleteCharacter,
}
