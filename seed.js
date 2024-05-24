const axios = require("axios")
const { addOrUpdateCharacter } = require("./dynamo")

const seedData = async () => {
  const url = "https://hp-api.onrender.com/api/characters"

  try {
    const { data: characters } = await axios.get(url)
    const characterPromises = characters.map((character, i) =>
      addOrUpdateCharacter({ ...character, id: character.id || `${i}` })
    )
    await Promise.all(characterPromises)
    console.log("Seeding completed")
  } catch (err) {
    console.log("Error seeding data:", err)
  }
}

seedData()
