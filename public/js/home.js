document.addEventListener("DOMContentLoaded", async function () {
    const isLoggedIn = document.body.dataset.loggedin === "true";

    const createModal = document.getElementById("create-modal");
    const uploadForm = document.getElementById("upload-form");
    const galleryDiv = document.getElementById('gallery');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');

    try {
        const res = await fetch('/load-post');
        const posts = await res.json();

        for (let i = 0; i < posts.length; i++) {
            const blog = document.createElement('div');
            blog.className = 'blog';
            blog.id = `blog-${i}`;

            const img = document.createElement('img');
            img.src = posts[i].thumbnail;
            img.style.width = '200px';
            img.style.margin = '10px';

            const topicHeader = document.createElement('h6');
            topicHeader.textContent = posts[i].title || '';
            topicHeader.style.fontSize = '20px';

            const shortExplain = document.createElement('p');
            shortExplain.textContent = posts[i].short_explain || '';
            shortExplain.style.fontSize = '15px';

            /*
            const blogOpen_btn = document.createElement('button');
            blogOpen_btn.textContent = 'open Blog';
            blogOpen_btn.addEventListener('click', function () {
                window.location.href = '/open-blog'; 
            });
            */  

            img.addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = posts[i].images;
            });

            blog.appendChild(img);
            blog.appendChild(topicHeader);
            blog.appendChild(shortExplain);
            galleryDiv.appendChild(blog);
            //blog.appendChild(blopOpen_btn);
        }

        modal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    } catch (err) {
        console.error('Error loading posts:', err);
    }

    // เหมือนเดิมด้านล่างนี้ เป็น synchronous แต่อยู่ใน async function แล้ว
    if (!createModal) return;

    createModal.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!isLoggedIn) {
            alert("กรุณา Login ก่อน");
            return;
        }

        if (uploadForm) {
            uploadForm.classList.remove("hidden");
            document.body.classList.add("backdrop-active");
        }
    });

    if (uploadForm) {
        uploadForm.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        document.addEventListener("click", (e) => {
            const clickedInsideForm = uploadForm.contains(e.target);
            const clickedCreateBtn = createModal.contains(e.target);
            const modalOpen = !uploadForm.classList.contains("hidden");

            if (!clickedInsideForm && !clickedCreateBtn && modalOpen) {
                uploadForm.classList.add("hidden");
                document.body.classList.remove("backdrop-active");
            }
        });
    }
});