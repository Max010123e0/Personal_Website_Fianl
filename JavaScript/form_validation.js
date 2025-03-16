document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const commentsInput = document.getElementById('comments');
    const errorOutput = document.getElementById('error-output');
    const infoOutput = document.getElementById('info-output');
    
    let form_errors = [];
    
    let formErrorsField = document.createElement('input');
    formErrorsField.type = 'hidden';
    formErrorsField.id = 'form-errors-field';
    formErrorsField.name = 'form-errors';
    form.appendChild(formErrorsField);

    const patterns = {
        fullname: /^[A-Za-z\s]{2,40}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    };
    
    const MAX_CHARS = 70;
    const MIN_CHARS = 10;

    const charCounterDiv = document.createElement('div');
    charCounterDiv.className = 'char-counter';
    commentsInput.parentNode.insertBefore(charCounterDiv, commentsInput.nextSibling);
    
    function updateCharCounter() {
        const remaining = MAX_CHARS - commentsInput.value.length;
        const used = commentsInput.value.length;
        
        charCounterDiv.innerHTML = `<span id="char-count">${used}</span>/${MAX_CHARS} characters (${remaining} remaining)`;
        charCounterDiv.className = 'char-counter';
        if (remaining <= 20) {
            charCounterDiv.classList.add('danger');
        } else if (remaining <= 50) {
            charCounterDiv.classList.add('warning');
        }
    }
    
    updateCharCounter();
    
    function showError(message) {
        errorOutput.textContent = message;
        
        errorOutput.style.transition = 'opacity 1s ease-in-out';
        errorOutput.style.opacity = '1';
        infoOutput.style.opacity = '0';
        
        if (window.errorTimeout) {
            clearTimeout(window.errorTimeout);
        }
        
        window.errorTimeout = setTimeout(() => {
            errorOutput.style.opacity = '0';
        }, 3000);
    }
    
    function showInfo(message) {
        infoOutput.textContent = message;
        infoOutput.style.transition = 'opacity 1s ease-in-out';
        infoOutput.style.opacity = '1';
        errorOutput.style.opacity = '0';
    }
    
    const ERROR_CATEGORIES = {
        INVALID_CHAR: 'invalid_character',
        TOO_SHORT: 'too_short',
        TOO_LONG: 'too_long',
        INVALID_FORMAT: 'invalid_format',
        REQUIRED_MISSING: 'required_missing'
    };

    function logError(fieldId, errorType, errorMsg) {
        const existingErrorIndex = form_errors.findIndex(e => 
            e.field === fieldId && e.type === errorType && e.message === errorMsg
        );
        
        const timestamp = new Date().toISOString();
        
        if (existingErrorIndex >= 0) {
            form_errors[existingErrorIndex].frequency = (form_errors[existingErrorIndex].frequency || 1) + 1;
            form_errors[existingErrorIndex].lastOccurred = timestamp;
        } else {
            form_errors.push({
                field: fieldId,
                type: errorType,
                message: errorMsg,
                timestamp: timestamp,
                frequency: 1,
                fieldValue: document.getElementById(fieldId).value.length 
            });
        }
        
        formErrorsField.value = JSON.stringify(form_errors);
        
        console.log(`Form error logged: ${fieldId} - ${errorType}`);
    }
    
    function flashField(field) {
        field.classList.remove('field-flash');
        void field.offsetWidth;
        field.classList.add('field-flash');
    }
    
    function validateField(field) {
        field.setCustomValidity('');
        
        if (field.validity.valueMissing) {
            field.setCustomValidity(`Please enter your ${field.id}`);
            return false;
        }
        
        switch(field.id) {
            case 'fullname':
                if (!patterns.fullname.test(field.value)) {
                    field.setCustomValidity('Name must be 2-40 characters and contain only letters and spaces');
                    return false;
                }
                break;
                
            case 'email':
                if (field.validity.typeMismatch || !patterns.email.test(field.value)) {
                    field.setCustomValidity('Please enter a valid email address (example@domain.com)');
                    return false;
                }
                break;
                
            case 'comments':
                const length = field.value.length;
                if (length < MIN_CHARS && length > 0) {
                    field.setCustomValidity(`Comments must be at least ${MIN_CHARS} characters long`);
                    return false;
                }
                if (length > MAX_CHARS) {
                    field.setCustomValidity(`Comments cannot exceed ${MAX_CHARS} characters`);
                    return false;
                }
                break;
        }
        
        return field.checkValidity();
    }
    
fullnameInput.addEventListener('input', function() {
    const value = this.value;
    const cursorPos = this.selectionStart;
    
    if (!/^[A-Za-z\s]*$/.test(value)) {
        let invalidChars = [];
        for (let i = 0; i < value.length; i++) {
            if (!/[A-Za-z\s]/.test(value[i])) {
                invalidChars.push({char: value[i], position: i});
            }
        }

        const cleanValue = value.replace(/[^A-Za-z\s]/g, '');
        
        const newCursorPos = cursorPos - (value.length - cleanValue.length);
 
        this.value = cleanValue;
        
        flashField(this);
        
        const firstInvalid = invalidChars[0].char;
        showError(`Invalid character "${firstInvalid}" removed from name field. Only letters and spaces allowed.`);
        logError(
            'fullname', 
            ERROR_CATEGORIES.INVALID_CHAR,
            `Invalid characters (${invalidChars.map(ic => ic.char).join(', ')}) removed from name field`
        );
        
        this.setSelectionRange(newCursorPos, newCursorPos);
    }
    
    validateField(this);
});
    
    emailInput.addEventListener('input', function(e) {
        if (this.value.length > 3 && this.value.includes('@')) {
            if (!validateField(this)) {
                flashField(this);
            }
        }
    });
    
    commentsInput.addEventListener('input', function(e) {
        updateCharCounter();
        
        const currentLength = this.value.length;
        
        if (currentLength > MAX_CHARS) {
            this.value = this.value.substring(0, MAX_CHARS);
            flashField(this);
            showError(`Maximum ${MAX_CHARS} characters allowed`);
            logError('comments', 'max_length_exceeded', 'Comment character limit exceeded');
            
            updateCharCounter();
        }
        
        validateField(this);
    });
    
    [fullnameInput, emailInput, commentsInput].forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim().length > 0 && !validateField(this)) {
                showError(this.validationMessage);
                logError(this.id, 'invalid_field', this.validationMessage);
            }
        });
    });
    
    form.addEventListener('submit', function(e) {
        let hasErrors = false;
        const fields = [fullnameInput, emailInput, commentsInput];
        
        fields.forEach(field => {
            if (!validateField(field)) {
                hasErrors = true;
                showError(field.validationMessage);

                let errorType = ERROR_CATEGORIES.INVALID_FORMAT;
                
                if (field.validity.valueMissing) {
                    errorType = ERROR_CATEGORIES.REQUIRED_MISSING;
                } else if (field.id === 'comments' && field.value.length < MIN_CHARS) {
                    errorType = ERROR_CATEGORIES.TOO_SHORT;
                } else if (field.id === 'comments' && field.value.length > MAX_CHARS) {
                    errorType = ERROR_CATEGORIES.TOO_LONG;
                }
                
                logError(field.id, errorType, field.validationMessage);

                if (field === fields[0] || 
                    (field !== fields[0] && !fields[0].validationMessage)) {
                    field.focus();
                }
            }
        });

        if (hasErrors) {
            e.preventDefault();

            logError('form', 'submission_blocked', `Form submission blocked with ${form_errors.length} total errors`);
            
            return false;
        } else {

            const errorSummary = {
                totalErrors: form_errors.length,
                uniqueErrors: new Set(form_errors.map(e => e.type)).size,
                browser: navigator.userAgent,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                timestamp: new Date().toISOString(),
                timeSpent: (Date.now() - window.formStartTime) / 1000, 
                errors: form_errors
            };
            
            formErrorsField.value = JSON.stringify(errorSummary);
            showInfo('Form data is valid!');
        }
    });
    
    const style = document.createElement('style');
    style.textContent = `
        /* Flash animation */
        @keyframes field-flash {
            0% { background-color: rgba(231, 76, 60, 0.5); }
            50% { background-color: rgba(231, 76, 60, 0.2); }
            100% { background-color: transparent; }
        }
        
        .field-flash {
            animation: field-flash 0.5s ease;
        }
        
        /* Character counter styling */
        .char-counter {
            text-align: right;
            font-size: 0.8em;
            margin-top: 5px;
            color: #666;
            transition: color 0.3s;
        }
        
        .char-counter.warning {
            color: #f39c12;
            font-weight: bold;
        }
        
        .char-counter.danger {
            color: #e74c3c;
            font-weight: bold;
        }
        
        /* Output elements styling */
        #error-output, #info-output {
            transition: opacity 1s ease-in-out;
            margin-top: 0.5rem;
            padding: 0.75rem;
            border-radius: 4px;
        }
        
        #error-output {
            background-color: rgba(231, 76, 60, 0.1);
            border-left: 4px solid #e74c3c;
        }
        
        #info-output {
            background-color: rgba(46, 204, 113, 0.1);
            border-left: 4px solid #2ecc71;
        }
    `;
    document.head.appendChild(style);

    errorOutput.style.opacity = '0';
    infoOutput.style.opacity = '0';

    window.formStartTime = Date.now();
});