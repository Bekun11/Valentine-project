document.addEventListener("DOMContentLoaded", function () {
    const startForm = document.getElementById("start-form");
    const storyContainer = document.getElementById("story-container");
    const storyText = document.getElementById("story-text");
    const storyImage = document.getElementById("story-image");
    const choicesContainer = document.getElementById("choices");
    const loveSong = document.getElementById("love-song"); // Audio element for the love song

    startForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;

        fetch("/story", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        })
            .then((response) => response.json())
            .then((data) => {
                let currentScene = "start";

                function displayScene(sceneKey) {
                    const scene = data[sceneKey];

                    // Update text and image
                    storyText.innerText = scene.text;
                    storyImage.src = scene.image || ""; // Set to empty if no image is provided
                    storyImage.style.display = scene.image ? "block" : "none"; // Show/hide image based on availability

                    // Clear previous choices
                    choicesContainer.innerHTML = "";

                    // Check if it's a positive ending
                    if (scene.isPositiveEnding) {
                        // Play the love song
                        if (loveSong) {
                            loveSong.currentTime = 0; // Reset the song
                            loveSong.play().catch((error) => {
                                console.error("Audio playback failed:", error);
                            });
                        }

                        // Send a message to the server
                        fetch("/proposal", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                message: "Successfully proposed",
                                scene: sceneKey,
                            }),
                        })
                            .then((res) => {
                                if (res.ok) {
                                    console.log("Proposal message sent successfully.");
                                } else {
                                    console.error("Failed to send proposal message.");
                                }
                            })
                            .catch((error) => {
                                console.error("Error sending proposal message:", error);
                            });
                    }

                    // Create buttons for each choice
                    for (const [choiceText, nextScene] of Object.entries(scene.choices || {})) {
                        const button = document.createElement("button");
                        button.innerText = choiceText;
                        button.onclick = () => displayScene(nextScene);
                        button.classList.add("choice-button");
                        choicesContainer.appendChild(button);
                    }
                }

                // Hide the form and show the story container
                startForm.style.display = "none";
                storyContainer.style.display = "block";

                // Display the first scene
                displayScene(currentScene);
            });
    });
});
