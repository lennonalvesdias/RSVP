document.getElementById('attendance').addEventListener('change', function() {
    const guestsContainer = document.getElementById('guests-container');
    if (this.value === 'yes') {
        guestsContainer.style.display = 'block';
    } else {
        guestsContainer.style.display = 'none';
        document.getElementById('guest-names-container').innerHTML = '';
    }
});

document.getElementById('guests').addEventListener('change', function() {
    const guestNamesContainer = document.getElementById('guest-names-container');
    guestNamesContainer.innerHTML = '';
    const numGuests = parseInt(this.value, 10);

    for (let i = 1; i <= numGuests; i++) {
        const label = document.createElement('label');
        label.setAttribute('for', `guest${i}`);
        label.textContent = `Nome do acompanhante ${i}:`;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `guest${i}`;
        input.name = `guest${i}`;

        guestNamesContainer.appendChild(label);
        guestNamesContainer.appendChild(input);
    }
});

document.getElementById('rsvp-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const attendance = document.getElementById('attendance').value;
    const guests = attendance === 'yes' ? document.getElementById('guests').value : 0;
    // const whatsappFlag = document.getElementById('whatsapp-flag').checked;
    const whatsappFlag = false;

    let guestNames = '';
    if (guests > 0) {
        for (let i = 1; i <= guests; i++) {
            const guestName = document.getElementById(`guest${i}`).value;
            guestNames += `Acompanhante ${i}: ${guestName} `;
        }
    }

    const message = `Obrigado, ${name}! Sua resposta foi registrada.`
    document.getElementById('response-message').textContent = message;

    // Enviar e-mail usando EmailJS
    const templateParams = {
        to_name: 'Lennon',
        from_name: name,
        name: name,
        email: email,
        attendance: attendance === 'yes' ? 'Sim' : 'Não',
        guests: guests,
        guest_names: guestNames
    };

    emailjs.send('service_43j22h9', 'template_hlkkf4g', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            console.log('FAILED...', error);
        });

    // Enviar mensagem pelo WhatsApp se a flag estiver marcada
    if (whatsappFlag) {
        const whatsappMessage = `Nome: ${name}%0AEmail: ${email}%0APresença: ${attendance === 'yes' ? 'Sim' : 'Não'}%0AAcompanhantes: ${guests}${guestNames ? `%0A${guestNames.replace(/<br>/g, '%0A')}` : ''}`;
        const whatsappUrl = `https://wa.me/5514997210201?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    // Aqui você pode adicionar uma integração com um backend para salvar os dados
});
