const Dog = require("../models/Dogs");

// Updated seed data without id field
const seedDogs = [
  {
    "name": "Buddy",
    "breed": "Africanis",
    "age": "2 years",
    "size": "large",
    "location": "Westlands",
    "gender": "male",
    "image": "https://img.onmanorama.com/content/dam/mm/en/lifestyle/news/images/2021/8/13/street-dog-c.jpg",
    "description": "A friendly Africanis with a calm temperament and great street-smart instincts.",
    "adopted": false
  },
  {
    "name": "Luna",
    "breed": "Africanis",
    "age": "6 years",
    "size": "medium",
    "location": "Karen",
    "gender": "female",
    "image": "https://breed-assets.wisdompanel.com/dog/street-dog-india/Indian_Street_Dog1.jpg",
    "description": "A gentle Africanis who is loving, loyal, and easy to bond with.",
    "adopted": false
  },
  {
    "name": "Max",
    "breed": "Africanis",
    "age": "8 months",
    "size": "small",
    "location": "Kilimani",
    "gender": "male",
    "image": "https://www.rover.com/blog/wp-content/uploads/2017/03/villagedog-thailand.jpg",
    "description": "A playful Africanis puppy full of energy and curiosity.",
    "adopted": false
  },
  {
    "name": "Bella",
    "breed": "Mixed Breed",
    "age": "4 years",
    "size": "small",
    "location": "Lavington",
    "gender": "female",
    "image": "https://hasindia.org/img/news/2021/story-of-a-street-dog.jpg",
    "description": "A friendly mixed-breed dog who is curious, alert, and great with families.",
    "adopted": false
  },
  {
    "name": "Charlie",
    "breed": "Africanis",
    "age": "3 months",
    "size": "small",
    "location": "Westlands",
    "gender": "male",
    "image": "https://cms.thewire.in/wp-content/uploads/2017/04/puppy-flickr.jpg",
    "description": "A tiny Africanis puppy who loves attention and playtime.",
    "adopted": false
  },
  {
    "name": "Daisy",
    "breed": "Africanis",
    "age": "5 years",
    "size": "medium",
    "location": "Karen",
    "gender": "female",
    "image": "https://images.squarespace-cdn.com/content/v1/685867dd741d844284a7c5a8/0acbb63d-28c7-444d-8018-1f0409dc673c/6012388838246304555.jpg?format=1000w",
    "description": "A mature Africanis who is calm, loyal, and very gentle.",
    "adopted": false
  },
  {
    "name": "Rocky",
    "breed": "Africanis",
    "age": "1 year",
    "size": "medium",
    "location": "Kilimani",
    "gender": "male",
    "image": "https://img-cdn.publive.online/fit-in/580x348/filters:format(webp)/english-betterindia/media/post_attachments/uploads/2023/06/Stray-Dog-Part-2-Feature-Image-Final-1685625989.jpg",
    "description": "A lively Africanis who loves exercise and exploring.",
    "adopted": false
  },
  {
    "name": "Molly",
    "breed": "Unknown",
    "age": "3 years",
    "size": "small",
    "location": "Lavington",
    "gender": "female",
    "image": "https://img.freepik.com/premium-photo/portrait-dog-standing-by-building_1048944-6906578.jpg?semt=ais_hybrid&w=740&q=80",
    "description": "A unique-looking dog. Specify the breed you want her to resemble.",
    "adopted": false
  },
  {
    "name": "Chiko",
    "breed": "Chihuahua",
    "age": "5 years",
    "size": "small",
    "location": "Parklands",
    "gender": "male",
    "image": "https://youngskennel.ca/wp-content/uploads/2022/06/chihuahua2.jpeg",
    "description": "A 5-year-old Chihuahua who loves companionship and warm laps.",
    "adopted": false
  },
  {
    "name": "Robby",
    "breed": "German Shepherd",
    "age": "3 years",
    "size": "large",
    "location": "Westlands",
    "gender": "male",
    "image": "https://hips.hearstapps.com/hmg-prod/images/best-guard-dogs-1650302456.jpeg?crop=0.754xw:1.00xh;0.0651xw,0&resize=1200:*",
    "description": "A protective and intelligent German Shepherd with strong loyalty.",
    "adopted": false
  },
  {
    "name": "Mali",
    "breed": "Africanis",
    "age": "2 years",
    "size": "medium",
    "location": "Kasarani",
    "gender": "female",
    "image": "https://trulyjuly.wordpress.com/wp-content/uploads/2022/05/lola-039.jpg?w=1200&h=900&crop=1",
    "description": "A sweet Africanis with a cheerful personality and gentle behavior.",
    "adopted": false
  },
  {
    "name": "Clay",
    "breed": "Chihuahua",
    "age": "1 year",
    "size": "small",
    "location": "Parklands",
    "gender": "male",
    "image": "https://www.barkandwhiskers.com/content/images/2023/11/dramatic-chihuahua.webp",
    "description": "A dramatic but adorable Chihuahua with a bold personality.",
    "adopted": false
  },
  {
    "name": "Bora",
    "breed": "Africanis",
    "age": "4 years",
    "size": "medium",
    "location": "Nairobi CBD",
    "gender": "female",
    "image": "https://southafrica-info.com/wp-content/uploads/2018/01/Africanis_featured.jpg",
    "description": "A confident Africanis who is alert, loyal, and friendly.",
    "adopted": false
  }
];

// Insert only if the DB is empty
async function seedDatabase() {
  try {
    const count = await Dog.countDocuments();

    if (count === 0) {
      console.log("🌱 Seeding dogs collection...");
      await Dog.insertMany(seedDogs);
      console.log("✅ Dogs seeded successfully!");
    } else {
      console.log("⚠️ Dogs already exist. Skipping seeding.");
    }
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    // If there's a duplicate key error, drop the collection and try again
    if (error.code === 11000) {
      console.log("🔄 Dropping dogs collection due to duplicate key error...");
      await Dog.collection.drop();
      console.log("🌱 Retrying seeding...");
      await Dog.insertMany(seedDogs);
      console.log("✅ Dogs seeded successfully after cleanup!");
    }
  }
}

module.exports = seedDatabase;