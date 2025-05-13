document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('blog-list');
    
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
        .then(blogs => {
            if (blogs.length === 0) {
                container.innerHTML = '<p>No blog posts found.</p>';
            } else {
                blogs.forEach(blog => {
                    const card = document.createElement('div');
                    card.className = 'blog-card';

                    const linkHref = blog.content
                        ? `/render-blogs/${blog.blog_id}`
                        : `/write-big-blog/${blog.blog_id}`

                    const linkText = blog.content ? 'Read More' : 'Write Blog'
                    
                    card.innerHTML = `
                        <img src="/${blog.thumbnail || 'images/default.jpg'}" alt="Thumbnail" class="thumb">
                        <h2>${blog.title}</h2>
                        <p>${blog.short_explain}</p>
                        <p><strong>Tags:</strong> ${blog.tags}</p>
                        <a href="${linkHref}">${linkText}</a>
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
});
