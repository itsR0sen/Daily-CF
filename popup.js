document.addEventListener("DOMContentLoaded", () => {
    // grab elements
    const usernameInput = document.getElementById("username");
    const saveBtn = document.getElementById("saveBtn");
    const clearBtn = document.getElementById("clearBtn");
    const themeToggle = document.getElementById("themeToggleIcon");
    const status = document.getElementById("status");
    const profileCard = document.getElementById("profile");
    const profilePic = document.getElementById("profilePic");
    const profileName = document.getElementById("profileName");
    const profileRank = document.getElementById("profileRank");
    const problemsSolved = document.getElementById("problemsSolved");
    const unsolvedList = document.getElementById("unsolvedList");
    let statusTimer = null;

    // small status popup
    function showStatus(msg, type = "info") {
        if (statusTimer) clearTimeout(statusTimer);
        status.textContent = msg;
        status.style.color = type === "error" ? "red" : "#10a37f";
        status.style.opacity = 1;
        statusTimer = setTimeout(
            () => {
                status.style.opacity = 0;
            },
            type === "error" ? 5000 : 2000
        );
    }

    // unique key for a problem
    function problemKey(p) {
        return `${p.contestId ?? "NA"}-${p.index ?? p.name ?? "NA"}`;
    }

    // load saved data
    chrome.storage.sync.get(["cfUsername", "darkMode"], (data) => {
        if (data.cfUsername) {
            usernameInput.value = data.cfUsername;
            clearBtn.style.display = "inline-block";
            fetchProfile(data.cfUsername);
        }
        if (data.darkMode) document.body.classList.add("dark-mode");
    });

    // toggle theme
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        chrome.storage.sync.set({
            darkMode: document.body.classList.contains("dark-mode"),
        });
    });

    // press enter to save
    usernameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveBtn.click();
    });

    // save username
    saveBtn.addEventListener("click", () => {
        const uname = usernameInput.value.trim();
        if (!uname) return showStatus("Please enter a username", "error");
        chrome.storage.sync.set({ cfUsername: uname }, () => {
            showStatus("Username saved");
            clearBtn.style.display = "inline-block";
            fetchProfile(uname);
        });
    });

    // clear username
    clearBtn.addEventListener("click", () => {
        usernameInput.value = "";
        chrome.storage.sync.remove("cfUsername");
        profileCard.classList.add("d-none");
        clearBtn.style.display = "none";
    });

    // fetch profile + submissions
    async function fetchProfile(username) {
        try {
            const [statusRes, userRes] = await Promise.all([
                fetch(
                    `https://codeforces.com/api/user.status?handle=${username}&from=1&count=1000`
                ).then((r) => r.json()),
                fetch(
                    `https://codeforces.com/api/user.info?handles=${username}`
                ).then((r) => r.json()),
            ]);
            if (statusRes.status !== "OK" || userRes.status !== "OK")
                throw new Error("API error");

            // solved + unsolved
            const submissions = statusRes.result;
            const solved = new Set();
            const unsolvedMap = new Map();

            submissions.forEach((sub) => {
                const key = problemKey(sub.problem);
                if (sub.verdict === "OK") solved.add(key);
                else if (!solved.has(key) && !unsolvedMap.has(key))
                    unsolvedMap.set(key, sub.problem);
            });

            // update profile
            const user = userRes.result[0];
            profilePic.src = user.titlePhoto;
            profileName.textContent = user.handle;
            profileName.href = `https://codeforces.com/profile/${user.handle}`;
            profileName.style.color = document.body.classList.contains(
                "dark-mode"
            )
                ? "#5eead4"
                : "#10a37f";
            profileRank.textContent = user.rank
                ? `${user.rank} (${user.rating})`
                : "";

            problemsSolved.textContent = `Solved: ${solved.size}`;

            // badges
            const container = document.querySelector(
                "#profile .d-flex.gap-2.flex-wrap"
            );
            container.innerHTML = "";
            container.appendChild(problemsSolved);

            const maxRatingBadge = document.createElement("span");
            maxRatingBadge.className = "badge bg-primary max-rating-badge";
            maxRatingBadge.textContent = `Max Rating: ${user.maxRating ?? "-"}`;
            container.appendChild(maxRatingBadge);

            // unsolved list
            unsolvedList.innerHTML = "";
            let count = 0;
            for (const [k, problem] of unsolvedMap) {
                if (count >= 5) break;
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.style.opacity = 0;

                const a = document.createElement("a");
                a.href = problem.contestId
                    ? `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
                    : `https://codeforces.com/problemset?search=${encodeURIComponent(
                          problem.name
                      )}`;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.textContent =
                    problem.name ?? `${problem.contestId}/${problem.index}`;

                const badge = document.createElement("span");
                badge.className = "ms-2 small";
                badge.style.color = document.body.classList.contains(
                    "dark-mode"
                )
                    ? "#e0e0e0"
                    : "#6b7280";
                badge.textContent = problem.rating ?? "-";

                li.appendChild(a);
                li.appendChild(badge);
                unsolvedList.appendChild(li);
                setTimeout(() => {
                    li.style.transition = "opacity 0.8s ease";
                    li.style.opacity = 1;
                }, 50);
                count++;
            }

            // show card
            profileCard.classList.remove("d-none");
            profileCard.classList.add("profile-animate");
            setTimeout(() => {
                profileCard.classList.add("show");
            }, 50);
            status.style.opacity = 0;
        } catch (err) {
            showStatus("Error: Invalid username or API error", "error");
            profileCard.classList.add("d-none");
            console.error(err);
        }
    }
});
