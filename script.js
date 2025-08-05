document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    // Toggle navigation menu on hamburger click
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Close nav menu when a link is clicked (for mobile)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    const bookAppointmentButtons = document.querySelectorAll('.book-appointment');
    const appointmentSection = document.getElementById('appointment');

    // Highlight the appointment form when "Book Appointment" is clicked
    bookAppointmentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            appointmentSection.scrollIntoView({ behavior: 'smooth' });
            appointmentSection.classList.add('highlight');
            setTimeout(() => {
                appointmentSection.classList.remove('highlight');
            }, 1000);
        });
    });

    const moreDetailsButtons = document.querySelectorAll('.more-details');
    const overlay = document.querySelector('.overlay');

    // Show doctor details card
    moreDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const doctorId = button.getAttribute('data-doctor-id');
            const detailedCard = document.getElementById(${doctorId}-details);
            
            if (detailedCard) {
                detailedCard.classList.add('active');
                overlay.classList.add('active');
            }
        });
    });

    // Close doctor details card
    const closeButtons = document.querySelectorAll('.detailed-card .close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentCard = button.closest('.detailed-card');
            parentCard.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    overlay.addEventListener('click', () => {
        const activeCards = document.querySelectorAll('.detailed-card.active');
        activeCards.forEach(card => {
            card.classList.remove('active');
        });
        overlay.classList.remove('active');
    });

    // Handle form submission with AJAX
    const appointmentForm = document.getElementById('appointment-form');
    const formMessage = document.getElementById('form-message');

    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(appointmentForm);
        const actionUrl = appointmentForm.getAttribute('action');

        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'text/plain'
                }
            });

            const result = await response.text();
            formMessage.style.display = 'block';
            if (result === 'Success') {
                formMessage.style.color = '#4ecdc4';
                formMessage.textContent = 'Appointment submitted successfully!';
                appointmentForm.reset();
            } else {
                formMessage.style.color = '#ff6b6b';
                formMessage.textContent = 'Error submitting appointment: ' + result;
            }

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        } catch (error) {
            console.error('Error:', error);
            formMessage.style.display = 'block';
            formMessage.style.color = '#ff6b6b';
            formMessage.textContent = 'Error submitting appointment. Please try again.';
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    });
});