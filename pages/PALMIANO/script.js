/* ==========================================
   MR. PALMIANO / GALES SYSTEM - SCRIPT
   ========================================== */

let penaltyInterval = null;

document.addEventListener("DOMContentLoaded", () => {
    createParticles();
    setupSystemNavigation();
    setupAudioSystem();
});

// --- PARTICLE BACKGROUND GENERATOR ---
function createParticles() {
    const particlesContainer = document.getElementById("particles-canvas");
    if (!particlesContainer) return;
    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        const size = Math.random() * 4 + 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.position = "absolute";
        p.style.background = "var(--neon-blue)";
        p.style.borderRadius = "50%";
        p.style.opacity = Math.random();
        p.style.animation = `floatParticle ${Math.random() * 8 + 6}s infinite linear`;
        particlesContainer.appendChild(p);
    }
}

// --- SYSTEM SCREEN NAVIGATION ---
function switchScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add("active");
    }
}

// Function para mag-switch ng video background
function switchToVideoBackground() {
    const imageBg = document.getElementById("image-bg");
    const videoBg = document.getElementById("login-video-bg");

    if (imageBg) imageBg.classList.remove("active-bg");
    if (videoBg) {
        videoBg.classList.add("active-bg");
        videoBg.play().catch(err => console.log("Video autoplay restricted:", err));
    }
}

function setupSystemNavigation() {
    const btnStartGame = document.getElementById("btn-start-game");
    const btnChoiceStart = document.getElementById("btn-choice-start");
    const btnChoiceDeath = document.getElementById("btn-choice-death");
    const btnArise = document.getElementById("btn-arise");
    const loginForm = document.getElementById("login-form");

    // 1. Main Menu -> Selection Screen
    if (btnStartGame) {
        btnStartGame.addEventListener("click", () => {
            switchScreen("screen-selection");
            playAudioSafe();
        });
    }

    // 2. Selection -> Accept (Goes to Login + Video Bg)
    if (btnChoiceStart) {
        btnChoiceStart.addEventListener("click", () => {
            switchScreen("screen-login");
            switchToVideoBackground();
        });
    }

    // 3. Selection -> Refuse (Goes to Death Penalty Timer)
    if (btnChoiceDeath) {
        btnChoiceDeath.addEventListener("click", () => {
            switchScreen("screen-death-penalty");
            startPenaltyTimer();
        });
    }

    // 4. Arise Button -> Login Screen + Video Bg
    if (btnArise) {
        btnArise.addEventListener("click", () => {
            switchScreen("screen-login");
            switchToVideoBackground();
        });
    }

    // 5. LOGIN FORM - REDIRECT TO LOADING.HTML
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("username").value.trim().toLowerCase();
            const pass = document.getElementById("password").value.trim();
            const statusMsg = document.getElementById("login-status-msg");

            if (user === "gilbert" && pass === "1234") {
                statusMsg.textContent = "AUTHENTICATION SUCCESSFUL. TRANSFERRING TO SYSTEM...";
                statusMsg.className = "login-msg success";

                // DIREKTA PAPASOK SA LOADING.HTML PAGKATAPOS NG 1 SECOND
                setTimeout(() => {
                    window.location.href = "loading.html";
                }, 1000);

            } else {
                statusMsg.textContent = "ACCESS DENIED. INVALID CREDENTIALS (Use: gilbert / 1234)";
                statusMsg.className = "login-msg error";
            }
        });
    }
}

// Penalty Countdown Timer Logic
function startPenaltyTimer() {
    let timeLeft = 10;
    const timerDisplay = document.getElementById("penalty-timer");
    if (penaltyInterval) clearInterval(penaltyInterval);

    penaltyInterval = setInterval(() => {
        timeLeft--;
        if (timerDisplay) timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(penaltyInterval);
            switchScreen("screen-arise");
        }
    }, 1000);
}

// Audio System
function setupAudioSystem() {
    const bgAudio = document.getElementById("bg-audio");
    const btnAudioToggle = document.getElementById("btn-audio-toggle");
    const volumeSlider = document.getElementById("volume-slider");
    const audioErrorMsg = document.getElementById("audio-error-msg");

    if (bgAudio) bgAudio.volume = 0.5;

    if (btnAudioToggle && bgAudio) {
        btnAudioToggle.addEventListener("click", () => {
            if (bgAudio.paused) {
                bgAudio.play().then(() => {
                    btnAudioToggle.textContent = "MUSIC: ON";
                    if (audioErrorMsg) audioErrorMsg.classList.add("hidden");
                }).catch(() => {
                    if (audioErrorMsg) audioErrorMsg.classList.remove("hidden");
                });
            } else {
                bgAudio.pause();
                btnAudioToggle.textContent = "MUSIC: OFF";
            }
        });
    }

    if (volumeSlider && bgAudio) {
        volumeSlider.addEventListener("input", (e) => {
            bgAudio.volume = e.target.value;
        });
    }
}

function playAudioSafe() {
    const bgAudio = document.getElementById("bg-audio");
    const audioErrorMsg = document.getElementById("audio-error-msg");
    if (bgAudio && bgAudio.paused) {
        bgAudio.play().catch(() => {
            if (audioErrorMsg) audioErrorMsg.classList.remove("hidden");
        });
    }


    
}


// --- AI VOICE CALL FUNCTION ---
const aiRingtone = document.getElementById("aiRingtone");
const aiCallModal = document.getElementById("aiCallModal");
const callStatusText = document.getElementById("callStatusText");
const answerCallBtn = document.getElementById("answerCallBtn");
const declineCallBtn = document.getElementById("declineCallBtn");

function triggerAiCall(userName = "Monarch") {
    if (aiCallModal) aiCallModal.classList.add("active");
    
    // Tugtugin ang ringtone ng tawag
    if (aiRingtone) {
        aiRingtone.currentTime = 0;
        aiRingtone.play().catch(e => console.log("Audio play blocked by browser:", e));
    }

    if (callStatusText) {
        callStatusText.textContent = `Incoming call for ${userName}...`;
    }

    // Kapag pinindot ang ANSWER BUTTON
    if (answerCallBtn) {
        answerCallBtn.onclick = () => {
            if (aiRingtone) aiRingtone.pause();
            
            // AI Voice Speaks (Gamit ang built-in Speech Synthesis ng browser)
            if ('speechSynthesis' in window) {
                const speech = new SpeechSynthesisUtterance(
                    `System notification, Monarch ${userName}. Your authentication and provisions are fully synced. Welcome to the Gales System.`
                );
                speech.rate = 1.0;
                speech.pitch = 0.85; // Medyo malalim / robotic tone para sa system vibe
                window.speechSynthesis.speak(speech);
            }

            if (callStatusText) {
                callStatusText.textContent = "AI DISPATCHER: Call active. Synchronizing system...";
            }

            // Isasara ang tawag pagkatapos magsalita ng AI (halimbawa after 4 seconds)
            setTimeout(() => {
                if (aiCallModal) aiCallModal.classList.remove("active");
            }, 5000);
        };
    }

    // Kapag pinindot ang DECLINE BUTTON
    if (declineCallBtn) {
        declineCallBtn.onclick = () => {
            if (aiRingtone) aiRingtone.pause();
            if (aiCallModal) aiCallModal.classList.remove("active");
        };
    }
}
// Kapag nag-submit sa Checkout Form ng Shop:
checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const customerName = document.getElementById("customer-name").value;
    const orderType = document.getElementById("order-type").value; // Dine-in o Takeout

    if (orderType === "takeout") {
        // Kapag Takeout -> AI Call Muna!
        triggerAiCall(customerName);
    } else {
        // Kapag Dine-in -> Direct Receipt
        showReceipt();
    }
});