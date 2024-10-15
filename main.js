document.addEventListener("DOMContentLoaded", function () {
    const lengthRange = document.querySelector("#length");
    const characterNumber = document.querySelector(".character-number");
    const upperCase = document.querySelector("#uppercase");
    const lowerCase = document.querySelector("#lowercase");
    const numbers = document.querySelector("#numbers");
    const symbols = document.querySelector("#symbols");
    const strengthOutputText = document.querySelector(".strength-output-txt");
    const strengthOutputFields = document.querySelectorAll(
        ".strength-output-field"
    );
    const generateBtn = document.querySelector(".button-container");

    const copyIcon = document.querySelector(".copy-image");
    const copyTarget = document.querySelector(".password");
    const copyStatus = document.getElementById("copy-status");

    copyIcon.addEventListener("click", function () {
        // Get the password text from the <p> element
        const passwordText = copyTarget.textContent; // copyTarget is your ".password" p element

        // Put the password into the hidden input field
        const hiddenInput = document.getElementById("hidden-copy-input");
        hiddenInput.value = passwordText;

        // Select the hidden inputs value
        hiddenInput.select();
        hiddenInput.setSelectionRange(0, 99999);

        // Copy the text to the clipboard using Clipboard API
        navigator.clipboard
            .writeText(passwordText)
            .then(function () {
              // Success feedback
                console.log("Copied successfully!");

                // Show the "Copied!" message
                copyStatus.style.display = "block"; // Show the message
                copyIcon.style.display = "none"; // Hide the SVG

                setTimeout(() => {
                  copyStatus.style.display = "none"; // Hide the message after 2 seconds
                  copyIcon.style.display = "block"; // Restore the SVG
                }, 2000);
            })
            .catch(function (error) {
            // Error feedback
            console.error("Copy failed:", error);
            });
    });

    lengthRange.addEventListener("mousedown", function () {
      lengthRange.classList.add("active"); // Active class when mouse is down
    });

    lengthRange.addEventListener("mouseup", function () {
      lengthRange.classList.remove("active"); // Remove hover class
    });

    lengthRange.addEventListener("mouseleave", function () {
      lengthRange.classList.remove("active"); // Remove active class if mouse leaves the slider
    });

    lengthRange.value = 10; // Set the desired starting value here
    characterNumber.textContent = lengthRange.value;

    // Update the background of the range input based on the initial value
    const val =
        ((lengthRange.value - lengthRange.min) /
        (lengthRange.max - lengthRange.min)) *
        100;
    lengthRange.style.background = `linear-gradient(to right, rgb(164, 255, 175) ${val}%, rgb(24, 23, 31) ${val}%)`;

    // Update the character display when the slider is adjusted
    lengthRange.addEventListener("input", function () {
        characterNumber.textContent = lengthRange.value; // Update the displayed value

        // Update the background of the range input
        const val =
        ((lengthRange.value - lengthRange.min) /
            (lengthRange.max - lengthRange.min)) *
        100;
        lengthRange.style.background = `linear-gradient(to right, rgb(164, 255, 175) ${val}%, rgb(24, 23, 31) ${val}%)`;
    });

    // Generate the password when the button is clicked
    generateBtn.addEventListener("click", function () {
        const length = parseInt(lengthRange.value);
        const includeUppercase = upperCase.checked;
        const includeLowercase = lowerCase.checked;
        const includeNumbers = numbers.checked;
        const includeSymbols = symbols.checked;

        // Generate the password
        const password = generatePassword(
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols
        );

        // Update the password display
        document.querySelector(".password").textContent = password;

        // Calculate strength and update the indicator
        const strength = calculateStrength(password);
        updateStrengthIndicator(strength);
    });

    // Function to generate a random password based on selected options
    function generatePassword(length, upper, lower, number, symbol) {
        let charset = "";
        if (upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (lower) charset += "abcdefghijklmnopqrstuvwxyz";
        if (number) charset += "0123456789";
        if (symbol) charset += "!@#$%^&*()_+[]{}|;:,.<>?";

        if (charset === "") return "Please select options";

        let password = "";
        for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
        }
        return password;
    }

    // Function to calculate password strength
    function calculateStrength(password) {
        let strength = 0;
        const length = password.length;

        if (length > 8) strength++; // Additional criteria for longer passwords
        if (length > 13) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        return Math.min(strength, 5); // Cap the strength to a maximum of 4
    }

    // Function to update strength indicator
    function updateStrengthIndicator(strength) {
        // Update strength message based on calculated strength
        strengthOutputText.textContent = [
        "TOO WEAK!", // 0
        "TOO WEAK!", // 0
        "WEAK!", // 1
        "MEDIUM!", // 2
        "STRONG!", // 3
        "EXCELLENT!", // 4
        ][strength];

        strengthOutputFields.forEach((field, index) => {
        // Remove all previous strength classes
        field.classList.remove(
            "too-weak",
            "weak",
            "medium",
            "strong",
            "excellent"
        );

        if (index < strength) {
            field.classList.add("filled");
            // Apply strength-specific class
            if (strength === 1) {
            field.classList.add("too-weak");
            } else if (strength === 2) {
            field.classList.add("weak");
            } else if (strength === 3) {
            field.classList.add("medium");
            } else if (strength === 4) {
            field.classList.add("strong");
            } else if (strength === 5) {
            field.classList.add("excellent"); // Make sure this condition is correct
            } else {
            field.classList.remove("filled");
            }
        }
        });
    }
});
