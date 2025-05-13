console.log('toggleForm.js loaded');

// Example of an event listener you might have
document.addEventListener("DOMContentLoaded", () => {
    const createBtn = document.getElementById("create-modal");
    const form = document.getElementById("upload-form");

    if (createBtn && form) {
        console.log('Button and form found');
        createBtn.addEventListener("click", () => {
            form.classList.toggle("hidden");
        });
    }
});
