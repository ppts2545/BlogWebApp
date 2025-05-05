fetch('/image-list')
    .then(res => res.json())
    .then(imageList=> {
        const galleryDiv = document.getElementById('gallery');
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');

        for(let i = 0; i < imageList.length; i++){
            const blog = document.createElement('div');
            blog.className = 'blog';
            blog.id = `blog-${i}`;

            const img = document.createElement('img');
            img.src = `${imageList[i].filepath}`;
            img.style.width = '200px';
            img.style.margin = '10px';

            img.addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = imageList[i].filepath;
            })

            blog.appendChild(img);
            galleryDiv.appendChild(blog);
        }

        //ใส่Event สําหรับปิด Modal เมื่อคลิก
        modal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    })
    .catch(err => console.error('Error loading images:', err));


    const createModal = document.getElementById("create-modal");
    const uploadForm = document.getElementById("upload-form");
    
    // เปิด modal
    createModal.addEventListener('click', (e) => {
        e.stopPropagation(); // ป้องกันการส่งต่อ event ไปที่ document
        uploadForm.classList.remove('hidden');
        document.body.classList.add("backdrop-active");
    });
    
    // ปิด modal เมื่อคลิกนอก modal หรือปุ่ม
    document.addEventListener('click', (e) => {
        const clickedInsideForm = uploadForm.contains(e.target);
        const clickedCreateBtn = createModal.contains(e.target);
        const modalOpen = !uploadForm.classList.contains('hidden');
    
        if (!clickedInsideForm && !clickedCreateBtn && modalOpen) {
            uploadForm.classList.add('hidden');
            document.body.classList.remove("backdrop-active");
        }
    });
    
    // ป้องกันคลิกภายใน modal ไม่ให้ส่งไป document
    uploadForm.addEventListener('click', (e) => {
        e.stopPropagation();
    });
