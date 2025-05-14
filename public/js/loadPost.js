document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('blog-list');
    const createPostBtn = document.getElementById('create-post-btn');

    if (!container) {
        console.error("Element with id 'blog-list' not found.");
        return;
    }

    // Fetch blog data from the server
    fetch('/load-post')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            const { blogs, currentUserId: userId } = data
            currentUserId = userId

            if (!blogs || blogs.length === 0) {
                container.innerHTML = '<p>No blog posts found.</p>';
                return;;
            } else {
                blogs.forEach(blog => {
                    const card = document.createElement('div');
                    card.className = 'blog-card';

                    let linkHtml = '';

                    if(blog.content) {
                        linkHtml = `<a href="/render-blogs/${blog.blog_id}">Read More</a>`;
                    }
                    else if (blog.author_id === currentUserId) {
                        linkHtml = `<a href="/write-big-blog/${blog.blog_id}">Write Blog</a>`;
                    }
                    
                    card.innerHTML = `
                        <img src="/${blog.thumbnail || 'images/default.jpg'}" alt="Thumbnail" class="thumb">
                        <h2>${blog.title}</h2>
                        <p>${blog.short_explain}</p>
                        <p><strong>Tags:</strong> ${blog.tags}</p>
                        ${linkHtml}
                    `;

                    // Append the card to the blog list
                    container.appendChild(card);
                });
            }
        })
        .catch(err => {
            console.error('Error loading posts:', err);
            container.innerHTML = '<p>Error loading blog posts.</p>';
        });

        // Only alert when button is clicked
        createPostBtn.addEventListener('click', () => {
        if (!currentUserId) {
            alert('You need to login before creating a post.');
        } else {
            // You can redirect to post-blog or open modal
            document.getElementById('upload-form').classList.toggle('hidden');
        }
    });
});
