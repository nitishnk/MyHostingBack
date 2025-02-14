

exports.getPosts = (req, res) => {
  const posts =   [
    {
      "id": "1",
      "title": "Exploring the Mountains",
      "image_url": "https://picsum.photos/200/300",
      "caption": "A breathtaking journey through the rocky terrains.",
      "likes": 152,
      "comments": [
        { "id": "c1", "user": "john_doe", "text": "Wow, this looks amazing!" },
        { "id": "c2", "user": "jane_doe", "text": "Wish I was there!" }
      ],
      "user": { "username": "adventure_guru", "profilePic": "https://picsum.photos/200/200" }
    },
    {
      "id": "2",
      "title": "City Lights",
      "image_url": "https://picsum.photos/200/300",
      "caption": "The beauty of the city after sunset.",
      "likes": 200,
      "comments": [
        { "id": "c1", "user": "urban_explorer", "text": "This view never gets old." },
        { "id": "c2", "user": "wanderlust", "text": "So vibrant and alive!" }
      ],
      "user": { "username": "citylife_lover", "profilePic": "https://picsum.photos/200/200" }
    },
    {
      "id": "3",
      "title": "Ocean Vibes",
      "image_url": "https://picsum.photos/200/300",
      "caption": "The calming effect of waves and salty breeze.",
      "likes": 85,
      "comments": [
        { "id": "c1", "user": "beach_bum", "text": "Missing the ocean already!" }
      ],
      "user": { "username": "sea_soul", "profilePic": "https://picsum.photos/200/200" }
    }
  ];
  res.json(posts);
};
