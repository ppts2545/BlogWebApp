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
    .then(res => res.json())
    .then(data => {
        console.log('✅ Success:', data);
        alert('บทความถูกส่งเรียบร้อยแล้ว');
    })
    .catch(err => {
        console.error('❌ Error:', err.message);
    });
});
