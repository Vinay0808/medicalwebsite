document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const bookAppointmentButtons = document.querySelectorAll('.book-appointment');
    const appointmentSection = document.getElementById('appointment');
    const doctorSelect = document.getElementById('doctor');
    const moreDetailsButtons = document.querySelectorAll('.more-details');
    const closeButtons = document.querySelectorAll('.detailed-card-popup .close-btn');
    const overlay = document.querySelector('.overlay');

    // Handle form submission pop-ups
    const appointmentForm = document.getElementById('appointment-form');
    const loadingPopup = document.getElementById('loading-popup-container');
    const successPopup = document.getElementById('success-popup-container');
    const timerDisplay = document.getElementById('timer-display');
    const okButton = document.getElementById('ok-btn');

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

    // Handle "Book Appointment" buttons
    bookAppointmentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const doctorId = button.getAttribute('data-doctor-id');
            if (doctorId) {
                doctorSelect.value = doctorId;
            } else {
                doctorSelect.value = '';
            }
            
            appointmentSection.scrollIntoView({ behavior: 'smooth' });

            appointmentSection.classList.add('highlight');
            setTimeout(() => {
                appointmentSection.classList.remove('highlight');
            }, 1000);
        });
    });

    // Show doctor details pop-up
    moreDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const doctorId = button.getAttribute('data-doctor-id');
            const detailedCard = document.getElementById(`${doctorId}-details`);
            
            if (detailedCard) {
                detailedCard.classList.add('active');
                overlay.classList.add('active');
            }
        });
    });

    // Close doctor details pop-up
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentCard = button.closest('.detailed-card-popup');
            parentCard.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    // Close pop-up when clicking outside on the overlay
    overlay.addEventListener('click', () => {
        const activeDetailedCards = document.querySelectorAll('.detailed-card-popup.active');
        activeDetailedCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Hide overlay if no popups are active
        if (!loadingPopup.classList.contains('active') && !successPopup.classList.contains('active')) {
            overlay.classList.remove('active');
        }
    });

    // Handle OK button click to dismiss success pop-up
    okButton.addEventListener('click', () => {
        successPopup.classList.remove('active');
        overlay.classList.remove('active');
    });

    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show the loading popup and start a 10-second timer
        loadingPopup.classList.add('active');
        overlay.classList.add('active');

        let timer = 10;
        timerDisplay.textContent = timer;
        const timerInterval = setInterval(() => {
            timer--;
            if (timer >= 0) {
                timerDisplay.textContent = timer;
            } else {
                // If the timer reaches zero, but the submission is still ongoing,
                // keep the popup open but stop the count.
                clearInterval(timerInterval);
                timerDisplay.textContent = '...';
            }
        }, 1000);

        const formData = new FormData(appointmentForm);
        const actionUrl = appointmentForm.getAttribute('action');

        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.text();
                // We've received a response, so clear the timer and hide the loading popup
                clearInterval(timerInterval);
                loadingPopup.classList.remove('active');
                
                if (result.trim() === 'Success') {
                    successPopup.classList.add('active');
                    appointmentForm.reset();
                } else {
                    alert('Error submitting appointment. Please try again.');
                    overlay.classList.remove('active');
                }
            } else {
                // If network response is not ok
                clearInterval(timerInterval);
                loadingPopup.classList.remove('active');
                alert('Network error. Please check your connection and try again.');
                overlay.classList.remove('active');
            }
        } catch (error) {
            // If fetch call fails entirely
            console.error('Error:', error);
            clearInterval(timerInterval);
            loadingPopup.classList.remove('active');
            alert('An unexpected error occurred. Please try again.');
            overlay.classList.remove('active');
        }
    });
});
