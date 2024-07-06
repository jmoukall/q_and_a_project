async function fetchQuestions() {
    try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const questions = await response.json();
        console.log('Fetched questions:', questions); // Log fetched questions
        const questionsContainer = document.getElementById('questions');
        questionsContainer.innerHTML = '';
        questions.forEach(q => {
            const div = document.createElement('div');
            div.className = 'question';
            div.innerHTML = `<p>${q.name}: ${q.question}</p>`;
            if (q.media) {
                const mediaType = q.media.split('.').pop().toLowerCase();
                let media;
                if (['jpg', 'jpeg', 'png', 'gif'].includes(mediaType)) {
                    media = document.createElement('img');
                    media.src = q.media;
                    media.className = 'media';
                } else if (['mp4', 'webm', 'ogg'].includes(mediaType)) {
                    media = document.createElement('video');
                    media.controls = true;
                    media.src = q.media;
                    media.className = 'media';
                }
                div.appendChild(media);
            }
            questionsContainer.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

async function addQuestion() {
    const name = document.getElementById('name').value;
    const question = document.getElementById('question').value;
    const media = document.getElementById('media').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('question', question);
    if (media) {
        formData.append('media', media);
    }

    try {
        const response = await fetch('/api/questions', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result.message);
        console.log('Added question result:', result); // Log result
        fetchQuestions(); // Refresh questions
    } catch (error) {
        console.error('Error adding question:', error);
    }
}

window.onload = fetchQuestions;
