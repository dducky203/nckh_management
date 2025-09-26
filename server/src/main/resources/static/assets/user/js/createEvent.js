const input = document.getElementById('dob');
const placeholder = document.getElementById('placeholder');

input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '');
    let formatted = '';

    if (digits.length > 0) formatted = digits.substring(0, 2);
    if (digits.length >= 3) formatted += '/' + digits.substring(2, 4);
    if (digits.length >= 5) formatted += '/' + digits.substring(4, 8);

    input.value = formatted;

    const full = 'DD/MM/YYYY';
    let dynamic = '';
    for (let i = 0; i < full.length; i++) {
        dynamic += formatted[i] ? formatted[i] : full[i];
    }

    placeholder.textContent = dynamic;
});

input.addEventListener('focus', () => {
    placeholder.style.color = '#bbb';
});

input.addEventListener('blur', () => {
    if (!input.value) {
        placeholder.textContent = 'DD/MM/YYYY';
    }
});
