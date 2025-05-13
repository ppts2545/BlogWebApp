document.getElementById('upload-BigBlogform').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData();

    const blogId = document.getElementById('hiddenBlogId').value;
    const mainContent = document.querySelector('textarea[name="mainContent"]').value;

    // Corrected variable name to match later usage
    const fileInput = document.querySelector('input[name="file_MediaBigBlog"]');

    formData.append('blogId', blogId);
    formData.append('mainContent', mainContent);

    // Convert FileList to an array and append each file to FormData
    const fileArray = Array.from(fileInput.files); // Convert FileList to array

    fileArray.forEach(file => {
        formData.append('file_MediaBigBlog', file); // Append each file to FormData
    });

    fetch('/post-Bigblog', {
    method: 'POST',
    body: formData
})
.then(res => {
    if (!res.ok) {
        // Handle non-successful HTTP status codes (e.g., 404, 500)
        console.error('❌ HTTP Error:', res.status, res.statusText);
        return res.text().then(text => {
            // Include the server response in the error for easier debugging
            throw new Error(`Server responded with status ${res.status}: ${text}`);
        });
    }

    // Check if the content type is JSON before parsing
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Expected JSON, but received:', contentType);
        return res.text().then(text => {
            throw new Error(`Expected JSON, but received ${contentType}: ${text}`);
        });
    }

    return res.json(); // Proceed with JSON parsing if the content type is JSON
})
.then(data => {
    console.log('✅ Success:', data);
    alert('บทความถูกส่งเรียบร้อยแล้ว'); // Inform the user the blog post was successful
})
.catch(err => {
    console.error('❌ Error:', err.message);
    alert('เกิดข้อผิดพลาด: ' + err.message); // Inform the user of the error in a user-friendly way
});

});
