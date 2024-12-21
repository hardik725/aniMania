import User from '../Model/UserModel.js';

export const signUp = async (req, res) => {
    try {
        const { Username, Email, Password, ProfilePicture, Gender, Age } = req.body;

        // Check if username already exists
        const existingUsername = await User.findOne({ Username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username Already Exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ Email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email Already Exists" });
        }

        // Use the provided ProfilePicture or a default one
        const profilePictureUrl = ProfilePicture || "https://c4.wallpaperflare.com/wallpaper/164/852/842/jujutsu-kaisen-anime-boys-anime-satoru-gojo-hd-wallpaper-preview.jpg";

        // Create a new user with the full schema
        const createUser = new User({
            Username,
            Email,
            Password,
            ProfilePicture: profilePictureUrl,
            Gender,
            Age,
            AnimeWatched: 0,
            MangaRead: 0,
            TotalEpisodes: 0,
            TotalChapters: 0,
            MeanAnimeScoreGiven: 0.0,
            MeanMangaScoreGiven: 0.0,
        });

        await createUser.save();

        res.status(201).json({ message: "User Successfully Created" });
    } catch (error) {
        console.error("Error creating user:", error.message);
        if (error.name === "ValidationError") {
            res.status(400).json({ message: "Validation Error", details: error.errors });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

export const Login = async (req, res) => {
    try {
        const { Username, Password } = req.body;

        // Find user by Username
        const user = await User.findOne({ Username });
        if (user) {
            // Directly compare the password
            if (Password === user.Password) {
                return res.status(200).json({ message: "Login Successful" });
            } else {
                return res.status(400).json({ message: "Incorrect Password" });
            }
        } else {
            return res.status(400).json({ message: "No account with this username" });
        }
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const searchUsersByUsername = async (req, res) => {
    try {
        const { searchString } = req.params;

        if (!searchString) {
            return res.status(400).json({ message: "Search string is required" });
        }

        const regex = new RegExp(searchString, 'i'); 

        const users = await User.find({ Username: { $regex: regex } }).select('-Password');

        if (users.length > 0) {
            return res.status(200).json(users);
        } else {
            return res.status(404).json({ message: "No users found" });
        }
    } catch (error) {
        console.error("Error searching users:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const Userdata = async (req, res) => {
    try {
        const { username } = req.params;  // Changed to `req.params` to get from the route
        
        // Check if Username is provided
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Find the user by Username and exclude the password
        const user = await User.findOne({ Username: username }).select('-Password');
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { username } = req.params; // Extract the username from the URL parameters
        const { ProfilePicture, Gender, Age } = req.body; // Extract the new details from the request body

        // Find the user by Username
        const user = await User.findOne({ Username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user details only if the values are not empty
        if (ProfilePicture !== undefined && ProfilePicture !== "") {
            user.ProfilePicture = ProfilePicture;
        }
        if (Gender !== undefined && Gender !== "") {
            user.Gender = Gender;
        }
        if (Age !== undefined && Age !== "") {
            user.Age = Age;
        }

        await user.save(); // Save the updated user details to the database

        res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

///user data starts from here 
///////////////////////////
///////////////////////////
///////////////////////////


// Controller to get user data
export const getUserData = async (req, res) => {
    try {
        const { username } = req.params;
        const userData = await User.findOne({ Username: username });

        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).json({ message: "User data not found" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getUserAnimeList = async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch user data from database
    const user = await User.findOne({ Username: username });


    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Assuming user.animeList contains the anime data
    res.json(user.AnimeList);
  } catch (error) {
    console.error('Error fetching user anime list:', error);
    res.status(500).json({ error: 'Failed to fetch user anime list' });
  }
};

// Controller to add anime to the user's list
export const addToAnimeList = async (req, res) => {
    try {
        const { username } = req.params;
        const { animeTitle, animeScore } = req.body;

        // Find user
        const user = await User.findOne({ Username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if anime already exists in the list
        const existingAnime = user.AnimeList.find(anime => anime.title === animeTitle);
        if (existingAnime) {
            return res.status(400).json({ message: "Anime is already in the list" });
        }

        // Fetch anime data to get genres
        const animeDataUrl = `https://animania-backend-dmjs.onrender.com/anime/${animeTitle}`;
        const animeResponse = await fetch(animeDataUrl);

        if (!animeResponse.ok) {
            return res.status(400).json({ message: "Failed to fetch anime data" });
        }

        const animeData = await animeResponse.json();
        const genres = animeData.Genres || []; // Default to empty array if no genres are found

        // Update AnimeGenresWatched
        genres.forEach(genre => {
            if (user.AnimeGenresWatched.has(genre)) {
                user.AnimeGenresWatched.set(genre, user.AnimeGenresWatched.get(genre) + 1);
            } else {
                user.AnimeGenresWatched.set(genre, 1); // Initialize if the genre is new
            }
        });

        // Add anime to the user's list
        user.AnimeList.push({ title: animeTitle, score: animeScore });

        // Save updated user data
        await user.save();

        return res.status(200).json({ message: "Anime added to list and genres updated" });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ message: "An error occurred while adding the anime to the list" });
    }
};

export const getUserMangaList = async (req, res) => {
    const { username } = req.params;
  
    try {
      // Fetch user data from database
      const user = await User.findOne({ Username: username });
  
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Assuming user.animeList contains the anime data
      res.json(user.MangaList);
    } catch (error) {
      console.error('Error fetching user anime list:', error);
      res.status(500).json({ error: 'Failed to fetch user manga list' });
    }
  };

  export const addToMangaList = async (req, res) => {
    try {
        const { username } = req.params;
        const { mangaTitle, mangaScore } = req.body;

        const user = await User.findOne({ Username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingManga = user.MangaList.find(manga => manga.title === mangaTitle);

        if (existingManga) {
            return res.status(400).json({ message: "Manga is already in the list" });
        }

        user.MangaList.push({ title: mangaTitle, score: mangaScore });
        await user.save();

        return res.status(200).json({ message: "Manga added to list" });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ message: "An error occurred while adding the manga to the list" });
    }
};

export const addFriend = async (req, res) => {
  try {
    const { username } = req.params;
    const { friendUsername } = req.body;

    // Find the user and friend
    const user = await User.findOne({ Username: username });
    const friend = await User.findOne({ Username: friendUsername });

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    // Check if already friends
    if (user.UserFriend.some(friend => friend.FriendName === friendUsername)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Add friend to both users
    user.UserFriend.push({ FriendName: friendUsername });
    friend.UserFriend.push({ FriendName: username });

    // Ensure both users have a conversation entry
    if (!user.Messages.find(msg => msg.friend === friendUsername)) {
      user.Messages.push({
        friend: friendUsername,
        conversation: []
      });
    }

    if (!friend.Messages.find(msg => msg.friend === username)) {
      friend.Messages.push({
        friend: username,
        conversation: []
      });
    }

    // Add notification to friend
    friend.Notifications.push({
      message: `${username} has added you as a friend.`,
      type: 'info', // Type of notification, can be 'info', 'warning', or 'error'
      timestamp: new Date()
    });

    // Save changes to both users
    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend added and notification sent" });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

  

  export const removeFriend = async (req, res) => {
    try {
      const { username } = req.params;
      const { friendUsername } = req.body;
  
      const user = await User.findOne({ Username: username });
      const friend = await User.findOne({ Username: friendUsername });
  
      if (!user || !friend) {
        return res.status(404).json({ message: "User or friend not found" });
      }
  
      // Remove friend from the user's friend list and vice versa
      user.UserFriend = user.UserFriend.filter(friend => friend.FriendName !== friendUsername);
      friend.UserFriend = friend.UserFriend.filter(friend => friend.FriendName !== username);
  
      // Remove conversation entries
      user.Messages = user.Messages.filter(msg => msg.friend !== friendUsername);
      friend.Messages = friend.Messages.filter(msg => msg.friend !== username);
  
      await user.save();
      await friend.save();
  
      res.status(200).json({ message: "Friend removed" });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

export const getMessages = async (req, res) => {
    try {
        const { username, friendName } = req.params;
        const user = await User.findOne({ Username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const conversation = user.Messages.find(msg => msg.friend === friendName);

        if (conversation) {
            res.status(200).json(conversation.conversation);
        } else {
            res.status(404).json({ message: "No conversation found with this friend" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller to post a new message to a friend
export const postMessage = async (req, res) => {
    try {
        const { username, friendName } = req.params;
        const { content } = req.body;

        const user = await User.findOne({ Username: username });
        const friend = await User.findOne({ Username: friendName });

        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found" });
        }

        // Add the new message to the conversation with the friend
        const userConversation = user.Messages.find(msg => msg.friend === friendName);
        if (userConversation) {
            userConversation.conversation.push({
                sender: username,
                content,
                timestamp: new Date()
            });
        } else {
            user.Messages.push({
                friend: friendName,
                conversation: [{
                    sender: username,
                    content,
                    timestamp: new Date()
                }]
            });
        }

        // Add the new message to the friend's conversation with the user
        const friendConversation = friend.Messages.find(msg => msg.friend === username);
        if (friendConversation) {
            friendConversation.conversation.push({
                sender: username,
                content,
                timestamp: new Date()
            });
        } else {
            friend.Messages.push({
                friend: username,
                conversation: [{
                    sender: username,
                    content,
                    timestamp: new Date()
                }]
            });
        }

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};