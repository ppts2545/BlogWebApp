document.getElementById('upload-ThumbnailBlogForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('/post-blog', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.blogId) {
            window.location.href = `/write-big-blog/${data.blogId}`;
        }
    })
    .catch(err => {
        console.error('❌ Blog post failed:', err);
    });
});
