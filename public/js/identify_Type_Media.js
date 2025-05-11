// mediaType.js

// Identifies media type based on file extension
function getFileType(fileName) {
  const ext = fileName.split('.').pop().toLowerCase(); // Extract file extension and convert to lowercase

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'flv'];

  if (imageExtensions.includes(ext)) {
    return 'image';  // File is an image
  }

  if (videoExtensions.includes(ext)) {
    return 'video';  // File is a video
  }

  return 'unknown'; // If the file is neither an image nor a video
}

// Identifies if a URL is a YouTube link
function getMediaTypeFromURL(url) {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/\S+|(?:v|e(?:mbed)?)\/?([\w-]+))|youtu\.be\/([\w-]+))/i;

  if (youtubeRegex.test(url)) {
    return 'youtube';  // URL is a YouTube link
  }

  return 'unknown';  // Not a YouTube link
}

// Main function to identify media type (either from file or URL)
function identifyMediaType(input) {
  // If input is a URL, check if it's a YouTube link
  if (typeof input === 'string' && input.startsWith('http')) {
    return getMediaTypeFromURL(input);
  }

  // If input is a filename (for images/videos)
  if (typeof input === 'string' && input.includes('.')) {
    return getFileType(input);
  }

  return 'unknown';  // If neither a URL nor a file
}

// Function to store media in the database
function storeMediaInDatabase(db, blogId, file, fileType) {
  const filepath = fileType === 'youtube' ? file : 'images/' + file.filename;  // Handle path differently for YouTube link

  const saveMedia = 'INSERT INTO media (blog_id, filename, filepath, type) VALUES (?, ?, ?, ?)';

  db.query(saveMedia, [blogId, file.filename, filepath, fileType], (err) => {
    if (err) {
      console.error('Error saving media:', err);
      return { message: 'Failed to save media' };
    }

    return { message: 'Media saved successfully' };
  });
}

// Exporting all functions
module.exports = {
  getFileType,
  getMediaTypeFromURL,
  identifyMediaType,
  storeMediaInDatabase
};
