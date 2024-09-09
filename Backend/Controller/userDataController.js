import UserData from '../Model/UserData.js';
import { check, validationResult } from 'express-validator';

// Controller to get user data
export const getUserData = async (req, res) => {
    try {
        const { username } = req.params;
        const userData = await UserData.findOne({ Username: username });

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
    const user = await UserData.findOne({ Username: username });


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

        const user = await UserData.findOne({ Username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingAnime = user.AnimeList.find(anime => anime.title === animeTitle);

        if (existingAnime) {
            return res.status(400).json({ message: "Anime is already in the list" });
        }

        user.AnimeList.push({ title: animeTitle, score: animeScore });
        await user.save();

        return res.status(200).json({ message: "Anime added to list" });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ message: "An error occurred while adding the anime to the list" });
    }
};

export const getUserMangaList = async (req, res) => {
    const { username } = req.params;
  
    try {
      // Fetch user data from database
      const user = await UserData.findOne({ Username: username });
  
  
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

        const user = await UserData.findOne({ Username: username });
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
    const user = await UserData.findOne({ Username: username });
    const friend = await UserData.findOne({ Username: friendUsername });

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
  
      const user = await UserData.findOne({ Username: username });
      const friend = await UserData.findOne({ Username: friendUsername });
  
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
        const user = await UserData.findOne({ Username: username });

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

        const user = await UserData.findOne({ Username: username });
        const friend = await UserData.findOne({ Username: friendName });

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