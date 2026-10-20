document.addEventListener("DOMContentLoaded", () => {
    // --- Elements ---
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeIconSun = document.getElementById("themeIconSun");
    const themeIconMoon = document.getElementById("themeIconMoon");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-content");
    const statusBanner = document.getElementById("statusBanner");

    // Profile Elements
    const usernameInput = document.getElementById("usernameInput");
    const saveUserBtn = document.getElementById("saveUserBtn");
    const clearUserBtn = document.getElementById("clearUserBtn");
    const profileCard = document.getElementById("profileCard");
    const profilePic = document.getElementById("profilePic");
    const profileHandle = document.getElementById("profileHandle");
    const profileRank = document.getElementById("profileRank");
    const statSolved = document.getElementById("statSolved");
    const statStreak = document.getElementById("statStreak");
    const statMaxStreak = document.getElementById("statMaxStreak");
    const statMaxRating = document.getElementById("statMaxRating");
    const dailyCountLabel = document.getElementById("dailyCountLabel");
    const popupDailyList = document.getElementById("popupDailyList");
    const popupUnsolvedList = document.getElementById("popupUnsolvedList");

    // Calendar Elements
    const contestsContainer = document.getElementById("contestsContainer");
    const refreshContestsBtn = document.getElementById("refreshContestsBtn");

    // Settings Elements
    const difficultyRadios = document.querySelectorAll('input[name="difficultyMode"]');
    const customRangeRow = document.getElementById("customRangeRow");
    const customMinRating = document.getElementById("customMinRating");
    const customMaxRating = document.getElementById("customMaxRating");
    const selectedTagSelect = document.getElementById("selectedTagSelect");
    const problemCountSelect = document.getElementById("problemCountSelect");
    const yearPresetSelect = document.getElementById("yearPresetSelect");
    const customYearRow = document.getElementById("customYearRow");
    const customMinYear = document.getElementById("customMinYear");
    const customMaxYear = document.getElementById("customMaxYear");
    const blindModeToggle = document.getElementById("blindModeToggle");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");

    let statusTimer = null;

    // --- Inline Vector SVGs (Zero Emojis) ---
    const SVG_CHECK = `<svg class="svg-icon svg-icon-sm icon-status-solved" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/></svg>`;
    const SVG_EXTERNAL = `<svg class="svg-icon-sm" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/><path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/></svg>`;
    const SVG_CAL_PLUS = `<svg class="svg-icon-sm" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/><path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"/></svg>`;

    // --- Status Banner Helper ---
    function showStatus(msg, type = "info") {
        if (statusTimer) clearTimeout(statusTimer);
        statusBanner.textContent = msg;
        statusBanner.className = `status-banner show ${type}`;
        statusTimer = setTimeout(() => {
            statusBanner.className = "status-banner";
        }, type === "error" ? 4000 : 2500);
    }

    // --- Tab Switching ---
    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            tabButtons.forEach((b) => b.classList.remove("active"));
            tabPanes.forEach((p) => p.classList.remove("active"));
            btn.classList.add("active");
            const targetPane = document.getElementById(targetTab);
            if (targetPane) targetPane.classList.add("active");

            if (targetTab === "tabCalendar") {
                fetchContests(false);
            }
        });
    });

    // --- Theme Toggle ---
    function applyTheme(isDark) {
        if (isDark) {
            document.body.classList.add("dark-mode");
            themeIconSun.style.display = "inline-block";
            themeIconMoon.style.display = "none";
        } else {
            document.body.classList.remove("dark-mode");
            themeIconSun.style.display = "none";
            themeIconMoon.style.display = "inline-block";
        }
    }

    themeToggleBtn.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark-mode");
        applyTheme(isDark);
        chrome.storage.sync.set({ darkMode: isDark });
    });

    // --- Format Date Helpers ---
    function formatTimeRemaining(diffMs) {
        if (diffMs <= 0) return "Running now";
        const totalMinutes = Math.floor(diffMs / 60000);
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes = totalMinutes % 60;

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    function toGoogleCalendarDate(d) {
        return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    }

    function getRankColor(rank) {
        if (!rank) return "var(--text-muted)";
        const r = rank.toLowerCase();
        if (r.includes("legendary") || r.includes("grandmaster")) return "#ef4444";
        if (r.includes("master")) return "#f97316";
        if (r.includes("candidate master")) return "#a855f7";
        if (r.includes("expert")) return "#3b82f6";
        if (r.includes("specialist")) return "#06b6d4";
        if (r.includes("pupil")) return "#22c55e";
        if (r.includes("newbie")) return "#94a3b8";
        return "var(--accent)";
    }

    // --- Calculate Daily Streaks ---
    function calculateStreaks(submissions) {
        const activeDates = new Set();
        submissions.forEach((sub) => {
            if (sub.verdict === "OK" && sub.creationTimeSeconds) {
                const date = new Date(sub.creationTimeSeconds * 1000);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                activeDates.add(`${year}-${month}-${day}`);
            }
        });

        if (activeDates.size === 0) return { currentStreak: 0, maxStreak: 0 };

        const sortedDates = Array.from(activeDates).sort();
        let maxStreak = 0;
        let runningStreak = 0;
        let prevDate = null;

        for (const dateStr of sortedDates) {
            const curDate = new Date(dateStr + "T00:00:00");
            if (prevDate) {
                const diffDays = Math.round((curDate - prevDate) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    runningStreak++;
                } else {
                    runningStreak = 1;
                }
            } else {
                runningStreak = 1;
            }
            if (runningStreak > maxStreak) maxStreak = runningStreak;
            prevDate = curDate;
        }

        // Current Streak Calculation
        const today = new Date();
        const yest = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const formatDateStr = (d) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
        };

        const todayStr = formatDateStr(today);
        const yestStr = formatDateStr(yest);

        let currentStreak = 0;
        let checkDate = activeDates.has(todayStr) ? today : (activeDates.has(yestStr) ? yest : null);

        if (checkDate) {
            let cursor = new Date(checkDate);
            while (activeDates.has(formatDateStr(cursor))) {
                currentStreak++;
                cursor.setDate(cursor.getDate() - 1);
            }
        }

        return { currentStreak, maxStreak };
    }

    // --- Render Today's Problem List in Popup ---
    async function loadDailyProblemsInPopup() {
        const local = await chrome.storage.local.get(["cfProblems"]);
        const sync = await chrome.storage.sync.get(["cfSettings"]);
        const isBlind = sync.cfSettings?.blindMode || false;
        const problems = local.cfProblems || [];

        dailyCountLabel.textContent = `${problems.length} problem${problems.length === 1 ? "" : "s"}`;
        popupDailyList.innerHTML = "";

        if (problems.length === 0) {
            popupDailyList.innerHTML = `<li class="empty-state">No daily set generated yet. Open Codeforces to view suggestions!</li>`;
            return;
        }

        problems.forEach((p) => {
            const li = document.createElement("li");
            li.className = "problem-item";

            const leftBox = document.createElement("div");
            leftBox.style.cssText = "display:flex; align-items:center; gap:6px; overflow:hidden; flex:1;";

            if (p.isSolved) {
                leftBox.innerHTML = SVG_CHECK;
            }

            const a = document.createElement("a");
            a.className = `problem-link ${p.isSolved ? "solved-text" : ""}`;
            a.href = p.contestId
                ? `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`
                : `https://codeforces.com/problemset?search=${encodeURIComponent(p.name)}`;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = p.name ? `${p.contestId ? p.contestId + p.index + " - " : ""}${p.name}` : `${p.contestId}/${p.index}`;
            leftBox.appendChild(a);
            li.appendChild(leftBox);

            const ratingSpan = document.createElement("span");
            const actualRating = p.rating ?? "-";
            if (isBlind) {
                ratingSpan.className = "rating-badge masked";
                ratingSpan.textContent = "••••";
                ratingSpan.title = "Blind Mode: hover or click to reveal rating";
                ratingSpan.addEventListener("click", () => {
                    if (ratingSpan.textContent === "••••") {
                        ratingSpan.textContent = actualRating;
                        ratingSpan.classList.add("revealed");
                    } else {
                        ratingSpan.textContent = "••••";
                        ratingSpan.classList.remove("revealed");
                    }
                });
                ratingSpan.addEventListener("mouseenter", () => {
                    ratingSpan.textContent = actualRating;
                });
                ratingSpan.addEventListener("mouseleave", () => {
                    if (!ratingSpan.classList.contains("revealed")) {
                        ratingSpan.textContent = "••••";
                    }
                });
            } else {
                ratingSpan.className = "rating-badge";
                ratingSpan.textContent = actualRating;
                ratingSpan.title = "Problem Rating";
            }
            li.appendChild(ratingSpan);

            popupDailyList.appendChild(li);
        });
    }

    // --- Normalize Avatar URL through codeforces.com to bypass direct userpic 503 blocks ---
    function normalizeCodeforcesAvatarUrl(url) {
        if (!url) return "";
        let clean = url.trim();

        if (clean.startsWith("https://")) clean = clean.slice(8);
        else if (clean.startsWith("http://")) clean = clean.slice(7);
        else if (clean.startsWith("//")) clean = clean.slice(2);
        else if (clean.startsWith("/")) clean = clean.slice(1);

        // If it's already routed through codeforces.com/userpic.codeforces.org/
        if (clean.startsWith("codeforces.com/userpic.codeforces.org/")) {
            return "https://" + clean;
        }

        // If it's on userpic.codeforces.org, proxy through codeforces.com to bypass Cloudflare 503
        if (clean.startsWith("userpic.codeforces.org/")) {
            return "https://codeforces.com/" + clean;
        }

        // If it's on userpic.codeforces.com
        if (clean.startsWith("userpic.codeforces.com/")) {
            return "https://codeforces.com/userpic.codeforces.org/" + clean.slice("userpic.codeforces.com/".length);
        }

        if (clean.startsWith("codeforces.com/")) {
            return "https://" + clean;
        }

        return "https://" + clean;
    }

    // --- Load User Avatar with Robust Protocol Resolution & Blob Fallback ---
    function loadAvatar(photoUrl, fallbackPhotoUrl) {
        const primaryUrl = normalizeCodeforcesAvatarUrl(photoUrl);
        const secondaryUrl = normalizeCodeforcesAvatarUrl(fallbackPhotoUrl);

        if (!primaryUrl && !secondaryUrl) {
            profilePic.src = "icons/48.png";
            return;
        }

        const targetUrl = primaryUrl || secondaryUrl;
        profilePic.referrerPolicy = "no-referrer";

        profilePic.onerror = async function () {
            this.onerror = null;
            // If primary failed and secondary is different, try secondary
            if (secondaryUrl && secondaryUrl !== targetUrl) {
                profilePic.src = secondaryUrl;
                return;
            }
            // Otherwise try blob fetch via extension host permissions
            try {
                const resp = await fetch(targetUrl);
                if (resp.ok) {
                    const blob = await resp.blob();
                    profilePic.src = URL.createObjectURL(blob);
                    return;
                }
            } catch (err) {
                console.warn("[Daily CF] Avatar blob load error:", err);
            }
            profilePic.src = "icons/48.png";
        };

        profilePic.src = targetUrl;
    }

    // --- Fetch Profile & Submission Details ---
    async function fetchProfile(username) {
        if (!username) return;
        try {
            showStatus("Loading profile data...");

            // 1. Fetch user info FIRST to immediately render avatar, handle, and rank
            const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`).then((r) => r.json());
            if (userRes.status !== "OK" || !userRes.result || !userRes.result[0]) {
                throw new Error("Codeforces API rejected user info request");
            }

            const user = userRes.result[0];

            // Render identity immediately (prefer custom titlePhoto, fallback to avatar)
            const primaryPhoto = (user.titlePhoto && !user.titlePhoto.includes("no-title")) ? user.titlePhoto : user.avatar;
            const secondaryPhoto = user.avatar || user.titlePhoto;
            loadAvatar(primaryPhoto, secondaryPhoto);

            const rankColor = getRankColor(user.rank);
            profileHandle.textContent = user.handle;
            profileHandle.href = `https://codeforces.com/profile/${encodeURIComponent(user.handle)}`;
            profileHandle.style.color = rankColor;
            profileRank.textContent = user.rank ? `${user.rank.toUpperCase()} (Rating: ${user.rating ?? "Unrated"})` : "Unrated";
            profileRank.style.color = rankColor;
            statMaxRating.textContent = user.maxRating ?? "-";
            profileCard.style.display = "block";

            // Cache identity for instant render on future popup opens
            chrome.storage.local.set({
                cfCachedUser: {
                    handle: user.handle,
                    avatar: primaryPhoto,
                    fallbackAvatar: secondaryPhoto,
                    rank: user.rank,
                    rating: user.rating,
                    maxRating: user.maxRating,
                },
            });

            // 2. Fetch submissions for solved count & streaks (asynchronously without blocking avatar)
            try {
                const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(username)}&from=1&count=2000`).then((r) => r.json());
                if (statusRes.status === "OK") {
                    const submissions = statusRes.result;
                    const solvedKeys = new Set();
                    const unsolvedMap = new Map();

                    submissions.forEach((sub) => {
                        if (!sub.problem) return;
                        const key = `${sub.problem.contestId ?? "NA"}-${sub.problem.index ?? sub.problem.name ?? "NA"}`;
                        if (sub.verdict === "OK") {
                            solvedKeys.add(key);
                            unsolvedMap.delete(key);
                        } else if (!solvedKeys.has(key) && !unsolvedMap.has(key)) {
                            unsolvedMap.set(key, sub.problem);
                        }
                    });

                    statSolved.textContent = solvedKeys.size;

                    // Streaks
                    const { currentStreak, maxStreak } = calculateStreaks(submissions);
                    statStreak.textContent = `${currentStreak}d`;
                    statMaxStreak.textContent = `${maxStreak}d`;

                    // Cache streak info
                    chrome.storage.local.set({
                        cfUserStreak: {
                            currentStreak,
                            maxStreak,
                            lastComputed: new Date().toISOString(),
                        },
                    });

                    // Recent Unsolved List
                    popupUnsolvedList.innerHTML = "";
                    let unsolvedCount = 0;
                    for (const [, prob] of unsolvedMap) {
                        if (unsolvedCount >= 5) break;
                        const li = document.createElement("li");
                        li.className = "problem-item";

                        const a = document.createElement("a");
                        a.className = "problem-link";
                        a.href = prob.contestId
                            ? `https://codeforces.com/problemset/problem/${prob.contestId}/${prob.index}`
                            : `https://codeforces.com/problemset?search=${encodeURIComponent(prob.name)}`;
                        a.target = "_blank";
                        a.rel = "noopener noreferrer";
                        a.textContent = prob.name ?? `${prob.contestId}/${prob.index}`;

                        const badge = document.createElement("span");
                        badge.className = "rating-badge";
                        badge.textContent = prob.rating ?? "-";

                        li.appendChild(a);
                        li.appendChild(badge);
                        popupUnsolvedList.appendChild(li);
                        unsolvedCount++;
                    }

                    if (unsolvedCount === 0) {
                        popupUnsolvedList.innerHTML = `<li class="empty-state">All recent submissions passed!</li>`;
                    }
                }
            } catch (statusErr) {
                console.warn("[Daily CF] Submissions fetch error:", statusErr);
            }

            loadDailyProblemsInPopup();
            showStatus("Profile synchronized", "info");
        } catch (err) {
            console.error("[Daily CF] Profile fetch error:", err);
            showStatus("Error loading user profile or invalid handle", "error");
        }
    }

    // --- Contest Calendar Engine ---
    async function fetchContests(force = false) {
        contestsContainer.innerHTML = `<div class="empty-state">Loading upcoming contests...</div>`;

        try {
            let contests = [];
            const now = new Date();
            const cache = await chrome.storage.local.get(["cfContests", "cfContestsUpdated"]);

            if (
                !force &&
                cache.cfContests &&
                cache.cfContestsUpdated &&
                now - new Date(cache.cfContestsUpdated) < 12 * 60 * 60 * 1000
            ) {
                contests = cache.cfContests;
            } else {
                const res = await fetch("https://codeforces.com/api/contest.list?gym=false").then((r) => r.json());
                if (res.status !== "OK") throw new Error("Contest API error");
                contests = res.result;
                await chrome.storage.local.set({
                    cfContests: contests,
                    cfContestsUpdated: now.toISOString(),
                });
            }

            // Filter upcoming
            const nowSeconds = Math.floor(now.getTime() / 1000);
            const upcoming = contests
                .filter((c) => c.phase === "BEFORE" || c.startTimeSeconds > nowSeconds)
                .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
                .slice(0, 5);

            contestsContainer.innerHTML = "";

            if (upcoming.length === 0) {
                contestsContainer.innerHTML = `<div class="empty-state">No upcoming contests scheduled at the moment.</div>`;
                return;
            }

            upcoming.forEach((c, idx) => {
                const startTime = new Date(c.startTimeSeconds * 1000);
                const endTime = new Date((c.startTimeSeconds + c.durationSeconds) * 1000);
                const diffMs = startTime.getTime() - now.getTime();
                const timeRemainingStr = formatTimeRemaining(diffMs);

                const card = document.createElement("div");
                card.className = `contest-card ${idx === 0 ? "highlight" : ""}`;

                const title = document.createElement("div");
                title.className = "contest-title";
                title.textContent = c.name;
                card.appendChild(title);

                const metaRow = document.createElement("div");
                metaRow.className = "contest-meta-row";

                const dateStr = startTime.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });

                metaRow.innerHTML = `
                    <span>${dateStr}</span>
                    <span class="countdown-chip">Starts in ${timeRemainingStr}</span>
                `;
                card.appendChild(metaRow);

                // Actions (Codeforces link & Google Calendar export)
                const actions = document.createElement("div");
                actions.className = "contest-actions";

                const cfLink = document.createElement("a");
                cfLink.href = "https://codeforces.com/contests";
                cfLink.target = "_blank";
                cfLink.className = "btn btn-secondary btn-sm";
                cfLink.innerHTML = `<span>View</span> ${SVG_EXTERNAL}`;
                actions.appendChild(cfLink);

                // Google Calendar Link
                const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    c.name
                )}&dates=${toGoogleCalendarDate(startTime)}/${toGoogleCalendarDate(endTime)}&details=${encodeURIComponent(
                    "Codeforces Contest: " + c.name + "\nURL: https://codeforces.com/contests"
                )}`;

                const gCalLink = document.createElement("a");
                gCalLink.href = gCalUrl;
                gCalLink.target = "_blank";
                gCalLink.className = "btn btn-secondary btn-sm";
                gCalLink.innerHTML = `<span>Add to Cal</span> ${SVG_CAL_PLUS}`;
                actions.appendChild(gCalLink);

                card.appendChild(actions);
                contestsContainer.appendChild(card);
            });
        } catch (err) {
            console.error("[Daily CF] Contest fetch error:", err);
            contestsContainer.innerHTML = `<div class="empty-state">Could not load contests. Check internet connection.</div>`;
        }
    }

    refreshContestsBtn.addEventListener("click", () => fetchContests(true));

    // --- Practice Settings Engine ---
    function updateCustomRangeVisibility() {
        const selected = document.querySelector('input[name="difficultyMode"]:checked')?.value;
        customRangeRow.style.display = selected === "custom" ? "grid" : "none";
    }

    function updateCustomYearVisibility() {
        const selected = yearPresetSelect.value;
        customYearRow.style.display = selected === "custom" ? "grid" : "none";
    }

    difficultyRadios.forEach((r) => r.addEventListener("change", updateCustomRangeVisibility));
    yearPresetSelect.addEventListener("change", updateCustomYearVisibility);

    // Auto-save blind mode toggle immediately on flip
    blindModeToggle.addEventListener("change", async () => {
        const data = await chrome.storage.sync.get(["cfSettings"]);
        const s = data.cfSettings || {};
        s.blindMode = blindModeToggle.checked;
        await chrome.storage.sync.set({ cfSettings: s });
        showStatus(s.blindMode ? "Blind Mode enabled" : "Blind Mode disabled", "info");
        loadDailyProblemsInPopup();
    });

    async function loadSettings() {
        const data = await chrome.storage.sync.get(["cfSettings"]);
        const s = data.cfSettings || {};

        const mode = s.difficultyMode || "standard";
        const radio = document.querySelector(`input[name="difficultyMode"][value="${mode}"]`);
        if (radio) radio.checked = true;

        customMinRating.value = s.customMinRating || 1200;
        customMaxRating.value = s.customMaxRating || 1600;
        selectedTagSelect.value = s.selectedTag || "all";
        problemCountSelect.value = s.problemCount || "5";
        blindModeToggle.checked = Boolean(s.blindMode);

        const currentYear = new Date().getFullYear();
        yearPresetSelect.value = s.yearPreset || "all";
        customMinYear.value = s.customMinYear || (currentYear - 5);
        customMaxYear.value = s.customMaxYear || currentYear;

        updateCustomRangeVisibility();
        updateCustomYearVisibility();
    }

    saveSettingsBtn.addEventListener("click", async () => {
        const difficultyMode = document.querySelector('input[name="difficultyMode"]:checked')?.value || "standard";
        const minR = parseInt(customMinRating.value, 10) || 800;
        const maxR = parseInt(customMaxRating.value, 10) || 2000;
        const selectedTag = selectedTagSelect.value || "all";
        const problemCount = parseInt(problemCountSelect.value, 10) || 5;
        const blindMode = blindModeToggle.checked;

        const currentYear = new Date().getFullYear();
        const yearPreset = yearPresetSelect.value || "all";
        const rawMinY = parseInt(customMinYear.value, 10);
        const rawMaxY = parseInt(customMaxYear.value, 10);
        const minY = isNaN(rawMinY) ? (currentYear - 5) : Math.max(2010, rawMinY);
        const maxY = isNaN(rawMaxY) ? currentYear : Math.min(2035, rawMaxY);

        const cfSettings = {
            difficultyMode,
            customMinRating: Math.min(minR, maxR),
            customMaxRating: Math.max(minR, maxR),
            selectedTag,
            problemCount,
            blindMode,
            yearPreset,
            customMinYear: Math.min(minY, maxY),
            customMaxYear: Math.max(minY, maxY),
        };

        await chrome.storage.sync.set({ cfSettings });
        // Clear daily cache so Codeforces re-rolls with the new configuration
        await chrome.storage.local.remove(["cfProblems", "cfLastUpdated"]);

        showStatus("Practice settings saved & daily cache refreshed!", "info");
        loadDailyProblemsInPopup();
    });

    // --- Username Save / Clear Listeners ---
    saveUserBtn.addEventListener("click", () => {
        const uname = usernameInput.value.trim();
        if (!uname) return showStatus("Please enter a valid handle", "error");

        chrome.storage.sync.set({ cfUsername: uname });
        chrome.storage.local.set({ cfUsername: uname }, () => {
            showStatus("Handle saved");
            clearUserBtn.style.display = "inline-block";
            fetchProfile(uname);
        });
    });

    usernameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveUserBtn.click();
    });

    clearUserBtn.addEventListener("click", () => {
        usernameInput.value = "";
        chrome.storage.sync.remove("cfUsername");
        chrome.storage.local.remove(["cfUsername", "cfProblems", "cfLastUpdated", "cfCachedUser", "cfUserStreak"]);
        profileCard.style.display = "none";
        clearUserBtn.style.display = "none";
        showStatus("Handle cleared");
    });

    // --- Initial Storage Load ---
    chrome.storage.sync.get(["cfUsername", "darkMode"], async (syncData) => {
        applyTheme(Boolean(syncData.darkMode));

        let uname = syncData.cfUsername;
        if (!uname) {
            const localData = await chrome.storage.local.get(["cfUsername"]);
            uname = localData.cfUsername;
        }

        // Instantly display cached avatar & user identity without network delay
        const localCache = await chrome.storage.local.get(["cfCachedUser"]);
        if (localCache.cfCachedUser && (!uname || localCache.cfCachedUser.handle === uname)) {
            const u = localCache.cfCachedUser;
            loadAvatar(u.avatar, u.fallbackAvatar);
            const rankColor = getRankColor(u.rank);
            profileHandle.textContent = u.handle;
            profileHandle.href = `https://codeforces.com/profile/${encodeURIComponent(u.handle)}`;
            profileHandle.style.color = rankColor;
            profileRank.textContent = u.rank ? `${u.rank.toUpperCase()} (Rating: ${u.rating ?? "Unrated"})` : "Unrated";
            profileRank.style.color = rankColor;
            statMaxRating.textContent = u.maxRating ?? "-";
            profileCard.style.display = "block";
        }

        if (uname) {
            usernameInput.value = uname;
            clearUserBtn.style.display = "inline-block";
            fetchProfile(uname);
        }
    });

    loadSettings();
});
