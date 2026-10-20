(() => {
    // Prevent duplicate injection
    if (window.__DAILY_CF_INJECTED__) return;
    window.__DAILY_CF_INJECTED__ = true;

    // --- Vector SVG Icons (Zero Emojis) ---
    const SVG = {
        calendar: `<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:-1px;"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2-0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/></svg>`,
        chevronDown: `<svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:-1px;"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>`,
        chevronUp: `<svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:-1px;"><path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/></svg>`,
        check: `<svg width="12" height="12" viewBox="0 0 16 16" fill="#10b981" style="vertical-align:-1px;"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/></svg>`,
        reroll: `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:-1px;"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/></svg>`,
        user: `<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:-1px;"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>`,
    };

    // Scoped CSS styles matching native Codeforces sideboxes
    function injectWidgetStyles() {
        if (document.getElementById("daily-cf-injected-style")) return;
        const style = document.createElement("style");
        style.id = "daily-cf-injected-style";
        style.textContent = `
            #cf-problem-table {
                margin-top: 1em;
            }
            #cf-problem-table table.rtable {
                table-layout: fixed;
                width: 100%;
                border-collapse: collapse;
            }
            #cf-problem-table table.rtable tbody tr {
                transition: background-color 0.15s ease;
            }
            #cf-problem-table table.rtable tbody tr:hover {
                background-color: #f0f4fc !important;
            }
            #cf-problem-table table.rtable th:first-child,
            #cf-problem-table table.rtable td:first-child {
                width: 2.25em;
                min-width: 2.25em;
                max-width: 2.25em;
                padding: 3px 0;
                text-align: center;
                vertical-align: middle;
            }
            #cf-problem-table table.rtable td:nth-child(2) {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: middle;
            }
            #cf-problem-table table.rtable th:last-child,
            #cf-problem-table table.rtable td:last-child {
                width: 5em;
                min-width: 5em;
                max-width: 5em;
                text-align: center;
                padding: 3px 4px;
                vertical-align: middle;
            }
            .daily-cf-caption {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .daily-cf-caption .top-links a {
                text-decoration: none;
                font-size: 0.85em;
                color: #3b5998;
                cursor: pointer;
            }
            .daily-cf-caption .top-links a:hover {
                text-decoration: underline;
            }
            .daily-cf-drawer {
                background: #f8fafc;
                border-bottom: 1px solid transparent;
                padding: 0 10px;
                font-size: 11px;
                max-height: 0;
                overflow: hidden;
                opacity: 0;
                transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, padding 0.3s ease, border-color 0.3s ease;
            }
            .daily-cf-drawer.open {
                max-height: 180px;
                opacity: 1;
                padding: 8px 10px;
                border-bottom-color: #b9c4da;
            }
            .daily-cf-drawer-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 3px 0;
                border-bottom: 1px dashed #cbd5e1;
            }
            .daily-cf-drawer-item:last-child {
                border-bottom: none;
            }
            .daily-cf-drawer-link {
                color: #2563eb;
                text-decoration: none;
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 170px;
            }
            .daily-cf-drawer-link:hover {
                text-decoration: underline;
            }
            /* Row Hover: Clean, smooth cross-fade from Problem # to Reroll Icon */
            .daily-cf-idx-wrap {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 18px;
            }
            .daily-cf-idx-text {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.2s ease;
                opacity: 1;
            }
            .daily-cf-row-reroll {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                color: #3b5998;
                cursor: pointer;
                padding: 0;
                margin: 0;
                line-height: 1;
                opacity: 0;
                transition: opacity 0.2s ease, color 0.15s ease;
                pointer-events: none;
            }
            #cf-problem-table table.rtable tr:hover .daily-cf-idx-text {
                opacity: 0;
            }
            #cf-problem-table table.rtable tr:hover .daily-cf-row-reroll {
                opacity: 1;
                pointer-events: auto;
            }
            .daily-cf-row-reroll:hover {
                color: #10a37f;
            }
            /* Smooth Rating Display and Masked Pill */
            .daily-cf-rating-span {
                display: inline-block;
                min-width: 44px;
                padding: 1px 4px;
                text-align: center;
                font-variant-numeric: tabular-nums;
                border-radius: 3px;
                box-sizing: border-box;
                transition: opacity 0.2s ease, background-color 0.2s ease, color 0.2s ease;
            }
            .daily-cf-rating-span.masked {
                background: #e1e7f2;
                color: #64748b;
                font-family: monospace;
                letter-spacing: normal;
                cursor: pointer;
                user-select: none;
            }
            .daily-cf-rating-span.masked:hover,
            .daily-cf-rating-span.masked.revealed {
                background: #d1fae5;
                color: #065f46;
            }
            .daily-cf-solved-text {
                text-decoration: line-through !important;
                opacity: 0.6;
            }
            .daily-cf-onboarding-box {
                padding: 12px;
                font-size: 12px;
            }
            .daily-cf-onboarding-box p {
                margin: 0 0 8px 0;
                color: #475569;
            }
            .daily-cf-onboard-btn {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                background: #10a37f;
                color: #fff;
                border: none;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
            }
            .daily-cf-onboard-btn:hover {
                background: #0d8a6a;
            }
        `;
        document.head.appendChild(style);
    }

    // Locate the right sidebar on Codeforces pages
    function findSidebarContainer() {
        const personalSidebarParent = document.querySelector(".roundbox.sidebox.borderTopRound .personal-sidebar")?.parentNode;
        if (personalSidebarParent) return personalSidebarParent;

        const sidebox = document.querySelector(".roundbox.sidebox");
        if (sidebox) return sidebox;

        const sidebarElem = document.getElementById("sidebar");
        if (sidebarElem) return sidebarElem.firstElementChild || sidebarElem;

        return null;
    }

    // --- Onboarding Card (Rendered if user declined prompt) ---
    function renderOnboardingCard(sidebar, detectedHandle) {
        let existing = document.getElementById("cf-problem-table");
        if (existing) existing.remove();

        const tableDiv = document.createElement("div");
        tableDiv.id = "cf-problem-table";
        tableDiv.className = "roundbox sidebox top-contributed borderTopRound";

        const caption = document.createElement("div");
        caption.className = "caption titled";
        caption.textContent = "→ Daily CF Setup";
        tableDiv.appendChild(caption);

        const cardBody = document.createElement("div");
        cardBody.className = "daily-cf-onboarding-box";

        let html = `<p>Track your daily practice with tailored recommendations right here.</p>`;
        if (detectedHandle) {
            html += `
                <div style="margin-bottom: 8px;">
                    <button id="dailyCfDetectBtn" class="daily-cf-onboard-btn">
                        ${SVG.user} <span>Use Handle: <strong>${detectedHandle}</strong></span>
                    </button>
                </div>
                <div style="font-size:11px; color:#64748b; margin-bottom: 6px;">or enter another handle:</div>
            `;
        }

        html += `
            <div style="display:flex; gap:4px;">
                <input type="text" id="dailyCfManualHandle" placeholder="Codeforces handle" style="flex:1; height:24px; padding:0 6px; font-size:11px;" />
                <button id="dailyCfManualSaveBtn" class="daily-cf-onboard-btn">Save</button>
            </div>
        `;

        cardBody.innerHTML = html;
        tableDiv.appendChild(cardBody);

        sidebar.parentNode.insertBefore(tableDiv, sidebar.nextSibling);

        const handleSave = async (uname) => {
            if (!uname) return;
            await chrome.storage.sync.set({ cfUsername: uname });
            await chrome.storage.local.set({ cfUsername: uname });
            initDailyCF();
        };

        const detectBtn = cardBody.querySelector("#dailyCfDetectBtn");
        if (detectBtn) {
            detectBtn.addEventListener("click", () => handleSave(detectedHandle));
        }

        const manualBtn = cardBody.querySelector("#dailyCfManualSaveBtn");
        const manualInput = cardBody.querySelector("#dailyCfManualHandle");
        if (manualBtn && manualInput) {
            manualBtn.addEventListener("click", () => handleSave(manualInput.value.trim()));
            manualInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") handleSave(manualInput.value.trim());
            });
        }
    }

    // --- Format Time Remaining Helper ---
    function formatTimeRemaining(diffMs) {
        if (diffMs <= 0) return "Running";
        const totalMinutes = Math.floor(diffMs / 60000);
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes = totalMinutes % 60;

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    // --- Main Daily CF Injected Widget ---
    async function initDailyCF() {
        injectWidgetStyles();

        const syncData = await chrome.storage.sync.get(["cfUsername", "cfSettings"]);
        const localData = await chrome.storage.local.get(["cfUsername"]);
        let username = syncData.cfUsername || localData.cfUsername;

        const settings = syncData.cfSettings || {
            difficultyMode: "standard",
            customMinRating: 800,
            customMaxRating: 2000,
            selectedTag: "all",
            problemCount: 5,
            blindMode: false,
        };

        const sidebar = findSidebarContainer();
        if (!sidebar) {
            console.log("[Daily CF] Sidebar element not found on page.");
            return;
        }

        // --- Handle Detection with User Confirmation (No silent auto-sync) ---
        if (!username) {
            const detectedHandle = document.querySelector("#header a[href^='/profile/']")?.textContent?.trim() || null;
            let approvedHandle = null;

            if (detectedHandle) {
                // Ask user confirmation before syncing handle
                const confirmed = window.confirm(
                    `Daily CF:\nFound logged-in Codeforces handle "${detectedHandle}".\n\nWould you like to use this handle for your daily practice suggestions?`
                );
                if (confirmed) {
                    approvedHandle = detectedHandle;
                }
            }

            if (!approvedHandle) {
                // If user declined or was not logged in, ask via prompt
                const prompted = window.prompt(
                    "Daily CF: Please enter your Codeforces username to receive daily problem suggestions:",
                    detectedHandle || ""
                );
                if (prompted && prompted.trim()) {
                    approvedHandle = prompted.trim();
                }
            }

            if (approvedHandle) {
                username = approvedHandle;
                await chrome.storage.sync.set({ cfUsername: approvedHandle });
                await chrome.storage.local.set({ cfUsername: approvedHandle });
                console.log("[Daily CF] Handle saved after user approval:", approvedHandle);
            } else {
                renderOnboardingCard(sidebar, detectedHandle);
                return;
            }
        }

        // Create or locate existing container
        let tableDiv = document.getElementById("cf-problem-table");
        if (tableDiv) tableDiv.remove();

        tableDiv = document.createElement("div");
        tableDiv.id = "cf-problem-table";
        tableDiv.className = "roundbox sidebox top-contributed borderTopRound";

        // Caption Header (matching native Codeforces .caption.titled)
        const caption = document.createElement("div");
        caption.className = "caption titled daily-cf-caption";

        const titleText = document.createElement("span");
        titleText.textContent = "→ Daily CF";
        caption.appendChild(titleText);

        // Top-links area for upcoming contests drawer
        const topLinks = document.createElement("div");
        topLinks.className = "top-links";

        const contestToggle = document.createElement("a");
        contestToggle.id = "dailyCfContestBadge";
        contestToggle.href = "#";
        contestToggle.innerHTML = `Contests ${SVG.chevronDown}`;
        contestToggle.title = "View upcoming Codeforces contests";
        topLinks.appendChild(contestToggle);

        caption.appendChild(topLinks);
        tableDiv.appendChild(caption);

        // Expandable Contest Drawer
        const contestDrawer = document.createElement("div");
        contestDrawer.id = "dailyCfContestDrawer";
        contestDrawer.className = "daily-cf-drawer";
        tableDiv.appendChild(contestDrawer);

        contestToggle.addEventListener("click", (e) => {
            e.preventDefault();
            const isOpen = contestDrawer.classList.toggle("open");
            contestToggle.innerHTML = `Contests ${isOpen ? SVG.chevronUp : SVG.chevronDown}`;
        });

        // Problem Table Element (Exact 3-column Codeforces rtable: #, Problem, Rating)
        const table = document.createElement("table");
        table.className = "rtable";
        const tbody = document.createElement("tbody");

        const headerRow = document.createElement("tr");
        [
            ["#", "left", "2.25em"],
            ["Problem", "", ""],
            ["Rating", "", "5em"],
        ].forEach(([txt, cls, w]) => {
            const th = document.createElement("th");
            th.textContent = txt;
            if (cls) th.className = cls;
            if (w) th.style.width = w;
            headerRow.appendChild(th);
        });
        tbody.appendChild(headerRow);
        table.appendChild(tbody);
        tableDiv.appendChild(table);

        // Footer Bar (Last refresh time + Blind Mode toggle + Refresh Button)
        const footer = document.createElement("div");
        footer.style.cssText = "padding: 0.3em 0.5em 0.3em 0.5em; display:flex; align-items:center; justify-content:space-between; font-size:11px;";

        const lastUptTime = document.createElement("span");
        lastUptTime.style.cssText = "color:#666; font-size:0.9em;";
        lastUptTime.textContent = "Last: Checking...";
        footer.appendChild(lastUptTime);

        const btnGroup = document.createElement("div");
        btnGroup.style.cssText = "display:flex; align-items:center; gap:4px;";

        // In-place blind mode update with debounced fade to prevent race conditions & jerking
        let blindAnimTimeout = null;
        function updateBlindRatings(isBlind) {
            if (blindAnimTimeout) clearTimeout(blindAnimTimeout);
            const rows = tbody.querySelectorAll("tr:not(:first-child)");
            rows.forEach((row) => {
                const ratingSpan = row.querySelector(".daily-cf-rating-span");
                if (ratingSpan) ratingSpan.style.opacity = "0";
            });

            blindAnimTimeout = setTimeout(() => {
                rows.forEach((row, i) => {
                    const ratingSpan = row.querySelector(".daily-cf-rating-span");
                    if (!ratingSpan) return;
                    const prob = currentProblems[i];
                    if (!prob) return;
                    const actualRating = prob.rating ?? "-";

                    if (isBlind) {
                        ratingSpan.className = "daily-cf-rating-span masked";
                        ratingSpan.textContent = "••••";
                        ratingSpan.title = "Blind Mode: hover or click to reveal";
                    } else {
                        ratingSpan.className = "daily-cf-rating-span";
                        ratingSpan.textContent = actualRating;
                        ratingSpan.title = "Rating: " + actualRating;
                    }
                    ratingSpan.style.opacity = "1";
                });
                blindAnimTimeout = null;
            }, 80);
        }

        // Rating Hide / Blind Mode button at the bottom of the table (fixed min-width prevents reflow)
        const blindBtn = document.createElement("input");
        blindBtn.type = "button";
        blindBtn.id = "dailyCfBlindBtn";
        blindBtn.value = settings.blindMode ? "Ratings: Hidden" : "Ratings: Visible";
        blindBtn.title = "Toggle Blind Mode (Mask or show ratings)";
        blindBtn.style.cssText = "height:1.65em; min-width:96px; text-align:center; box-sizing:border-box; padding:0 0.5em; font-size:10px; cursor:pointer;";
        blindBtn.addEventListener("click", async () => {
            settings.blindMode = !settings.blindMode;
            await chrome.storage.sync.set({ cfSettings: settings });
            blindBtn.value = settings.blindMode ? "Ratings: Hidden" : "Ratings: Visible";
            updateBlindRatings(settings.blindMode);
        });
        btnGroup.appendChild(blindBtn);

        // Refresh Button (native CF form button)
        const refreshBtn = document.createElement("input");
        refreshBtn.type = "submit";
        refreshBtn.value = "Refresh";
        refreshBtn.style.cssText = "height:1.65em; padding:0 0.7em; font-size:11px; cursor:pointer;";
        btnGroup.appendChild(refreshBtn);

        footer.appendChild(btnGroup);
        tableDiv.appendChild(footer);
        sidebar.parentNode.insertBefore(tableDiv, sidebar.nextSibling);

        let currentProblems = [];

        // --- Render Problems Table ---
        function renderProblemsTable(problems) {
            currentProblems = problems || [];
            tbody.querySelectorAll("tr:not(:first-child)").forEach((r) => r.remove());

            if (!problems || problems.length === 0) {
                const row = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 3;
                td.style.textAlign = "center";
                td.style.padding = "8px";
                td.textContent = "No matching unattempted problems found.";
                row.appendChild(td);
                tbody.appendChild(row);
                return;
            }

            problems.forEach((prob, i) => {
                const row = document.createElement("tr");
                row.className = i % 2 ? "dark" : "";
                if (i === problems.length - 1) row.classList.add("bottom");

                // Col 1: ID Number wrapped in .daily-cf-idx-wrap for smooth hover swap
                const idxTd = document.createElement("td");
                idxTd.className = "left" + (row.className ? " dark" : "");

                const idxWrap = document.createElement("div");
                idxWrap.className = "daily-cf-idx-wrap";

                const numSpan = document.createElement("span");
                numSpan.className = "daily-cf-idx-text";
                if (prob.isSolved) {
                    numSpan.innerHTML = SVG.check;
                    numSpan.title = "Solved today!";
                } else {
                    numSpan.textContent = i + 1;
                }
                idxWrap.appendChild(numSpan);

                const rerollBtn = document.createElement("button");
                rerollBtn.type = "button";
                rerollBtn.className = "daily-cf-row-reroll";
                rerollBtn.title = `Reroll problem #${i + 1}`;
                rerollBtn.innerHTML = SVG.reroll;
                rerollBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    rerollSingleProblem(i);
                });
                idxWrap.appendChild(rerollBtn);

                idxTd.appendChild(idxWrap);
                row.appendChild(idxTd);

                // Col 2: Problem Link (Tags shown ONLY on hover as tooltip)
                const probTd = document.createElement("td");
                probTd.className = row.className.includes("dark") ? " dark" : "";

                const a = document.createElement("a");
                a.href = prob.contestId
                    ? `https://codeforces.com/problemset/problem/${prob.contestId}/${prob.index}`
                    : `https://codeforces.com/problemset?search=${encodeURIComponent(prob.name)}`;
                a.target = "_blank";
                a.textContent = prob.name ?? `${prob.contestId}/${prob.index}`;
                if (prob.isSolved) a.className = "daily-cf-solved-text";

                // Tooltip showing tags on hover
                const tagList = prob.tags && prob.tags.length > 0 ? prob.tags.join(", ") : "None";
                const tooltipText = `Tags: ${tagList}`;
                a.title = tooltipText;
                probTd.title = tooltipText;

                probTd.appendChild(a);
                row.appendChild(probTd);

                // Col 3: Rating (Masked with peek if blind mode)
                const ratingTd = document.createElement("td");
                ratingTd.className = row.className.includes("dark") ? " dark" : "";
                const ratingSpan = document.createElement("span");
                const actualRating = prob.rating ?? "-";
                ratingSpan.dataset.realRating = actualRating;

                if (settings.blindMode) {
                    ratingSpan.className = "daily-cf-rating-span masked";
                    ratingSpan.textContent = "••••";
                    ratingSpan.title = "Blind Mode: hover or click to reveal";
                } else {
                    ratingSpan.className = "daily-cf-rating-span";
                    ratingSpan.textContent = actualRating;
                    ratingSpan.title = "Rating: " + actualRating;
                }

                ratingSpan.addEventListener("click", () => {
                    if (!settings.blindMode) return;
                    if (ratingSpan.textContent === "••••") {
                        ratingSpan.textContent = actualRating;
                        ratingSpan.classList.add("revealed");
                    } else {
                        ratingSpan.textContent = "••••";
                        ratingSpan.classList.remove("revealed");
                    }
                });
                ratingSpan.addEventListener("mouseenter", () => {
                    if (settings.blindMode && !ratingSpan.classList.contains("revealed")) {
                        ratingSpan.textContent = actualRating;
                    }
                });
                ratingSpan.addEventListener("mouseleave", () => {
                    if (settings.blindMode && !ratingSpan.classList.contains("revealed")) {
                        ratingSpan.textContent = "••••";
                    }
                });

                ratingTd.appendChild(ratingSpan);
                row.appendChild(ratingTd);

                tbody.appendChild(row);
            });
        }

        // --- Load Contest Drawer ---
        async function updateContests() {
            try {
                let { cfContests } = await chrome.storage.local.get(["cfContests"]);
                if (!cfContests || !cfContests.length) {
                    const res = await fetch("https://codeforces.com/api/contest.list?gym=false").then((r) => r.json());
                    if (res.status === "OK") {
                        cfContests = res.result;
                        await chrome.storage.local.set({ cfContests, cfContestsUpdated: new Date().toISOString() });
                    }
                }

                if (!cfContests) return;

                const nowSec = Math.floor(Date.now() / 1000);
                const upcoming = cfContests
                    .filter((c) => c.phase === "BEFORE" || c.startTimeSeconds > nowSec)
                    .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
                    .slice(0, 4);

                if (upcoming.length > 0) {
                    const next = upcoming[0];
                    const diffMs = next.startTimeSeconds * 1000 - Date.now();
                    const badgeElem = document.getElementById("dailyCfContestBadge");
                    if (badgeElem) {
                        const isOpen = contestDrawer.classList.contains("open");
                        badgeElem.innerHTML = `Next in ${formatTimeRemaining(diffMs)} ${isOpen ? SVG.chevronUp : SVG.chevronDown}`;
                    }

                    contestDrawer.innerHTML = "";
                    upcoming.forEach((c) => {
                        const item = document.createElement("div");
                        item.className = "daily-cf-drawer-item";

                        const startTime = new Date(c.startTimeSeconds * 1000);
                        const diff = startTime.getTime() - Date.now();

                        item.innerHTML = `
                            <a class="daily-cf-drawer-link" href="https://codeforces.com/contests" target="_blank" title="${c.name}">
                                ${c.name}
                            </a>
                            <span style="color:#065f46; font-weight:700;">${formatTimeRemaining(diff)}</span>
                        `;
                        contestDrawer.appendChild(item);
                    });
                }
            } catch (err) {
                console.error("[Daily CF] Contest drawer update error:", err);
            }
        }

        // Determine year range filter from settings
        function getYearBounds(currentYear) {
            let filterMinYear = 2010;
            let filterMaxYear = currentYear;

            if (settings.yearPreset === "last3") {
                filterMinYear = currentYear - 3;
                filterMaxYear = currentYear;
            } else if (settings.yearPreset === "last5") {
                filterMinYear = currentYear - 5;
                filterMaxYear = currentYear;
            } else if (settings.yearPreset === "custom") {
                const rawMin = parseInt(settings.customMinYear, 10);
                const rawMax = parseInt(settings.customMaxYear, 10);
                filterMinYear = isNaN(rawMin) ? 2010 : Math.max(2010, rawMin);
                filterMaxYear = isNaN(rawMax) ? currentYear : Math.min(2035, rawMax);
                if (filterMinYear > filterMaxYear) {
                    const tmp = filterMinYear;
                    filterMinYear = filterMaxYear;
                    filterMaxYear = tmp;
                }
            }
            return { filterMinYear, filterMaxYear };
        }

        // --- Problem Candidates & Filter Pipeline ---
        async function fetchProblems(force = false) {
            try {
                if (!force) {
                    const cache = await chrome.storage.local.get(["cfProblems", "cfLastUpdated"]);
                    const todayStr = new Date().toDateString();
                    if (
                        cache.cfProblems &&
                        cache.cfLastUpdated &&
                        new Date(cache.cfLastUpdated).toDateString() === todayStr
                    ) {
                        renderProblemsTable(cache.cfProblems);
                        updateLastUpdatedLabel(cache.cfLastUpdated);
                        updateContests();
                        return;
                    }
                }

                lastUptTime.textContent = "Fetching...";

                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

                // Load problemset
                let { cfProblemset, cfProblemsetUpdated } = await chrome.storage.local.get([
                    "cfProblemset",
                    "cfProblemsetUpdated",
                ]);

                if (!cfProblemset || !cfProblemsetUpdated || new Date(cfProblemsetUpdated) < weekAgo) {
                    const probRes = await fetch("https://codeforces.com/api/problemset.problems").then((r) => r.json());
                    if (probRes.status !== "OK") throw new Error("API error: problemset.problems");
                    cfProblemset = probRes.result.problems;
                    cfProblemsetUpdated = now.toISOString();
                    await chrome.storage.local.set({ cfProblemset, cfProblemsetUpdated });
                }

                // Load contests for date mapping
                let { cfContests, cfContestsUpdated } = await chrome.storage.local.get(["cfContests", "cfContestsUpdated"]);
                if (!cfContests || !cfContestsUpdated || new Date(cfContestsUpdated) < weekAgo) {
                    const contRes = await fetch("https://codeforces.com/api/contest.list?gym=false").then((r) => r.json());
                    if (contRes.status !== "OK") throw new Error("API error: contest.list");
                    cfContests = contRes.result;
                    cfContestsUpdated = now.toISOString();
                    await chrome.storage.local.set({ cfContests, cfContestsUpdated });
                }

                const contestDateMap = new Map();
                cfContests.forEach((c) => contestDateMap.set(c.id, new Date(c.startTimeSeconds * 1000)));

                // Fetch user status & user info
                const [statusRes, userRes] = await Promise.all([
                    fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(username)}&from=1&count=10000`).then((r) => r.json()),
                    fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`).then((r) => r.json()),
                ]);

                if (statusRes.status !== "OK" || userRes.status !== "OK") {
                    throw new Error("API user verification error");
                }

                const submissions = statusRes.result;
                const user = userRes.result[0];
                const userRating = user.rating ?? 1200;

                // Build set of attempted problems
                const attempted = new Set();
                submissions.forEach((sub) => {
                    if (sub.problem && sub.problem.contestId && sub.problem.index) {
                        attempted.add(`${sub.problem.contestId}-${sub.problem.index}`);
                    }
                });

                // Filter problems matching the configured year range
                const currentYear = now.getFullYear();
                const { filterMinYear, filterMaxYear } = getYearBounds(currentYear);

                let unattempted = cfProblemset.filter((p) => {
                    const key = `${p.contestId}-${p.index}`;
                    if (attempted.has(key)) return false;
                    const contestDate = contestDateMap.get(p.contestId);
                    if (!contestDate) return false;
                    const pYear = contestDate.getFullYear();
                    return pYear >= filterMinYear && pYear <= filterMaxYear;
                });

                // If strict year range yields 0 problems, fallback gracefully to all unattempted
                if (unattempted.length === 0) {
                    window.alert(`[Daily CF] No unattempted problems found in year range ${filterMinYear}-${filterMaxYear}. Falling back to all unattempted.`);
                    unattempted = cfProblemset.filter((p) => {
                        const key = `${p.contestId}-${p.index}`;
                        return !attempted.has(key);
                    });
                }

                // Apply topic / tag filter (strictly preserving tag)
                let tagFiltered = unattempted;
                const activeTag = (settings.selectedTag || "all").toLowerCase().trim();
                if (activeTag && activeTag !== "all") {
                    const matched = unattempted.filter((p) => p.tags && p.tags.some((t) => t.toLowerCase() === activeTag));
                    if (matched.length > 0) {
                        tagFiltered = matched;
                    } else {
                        console.warn(`[Daily CF] No unattempted problems found with tag "${activeTag}". Falling back to all topics.`);
                    }
                }

                // Determine target rating bounds based on difficulty settings
                let minBound = 800;
                let maxBound = 2000;

                if (user.rating === undefined || user.rating <= 700) {
                    minBound = 800;
                    maxBound = 1000;
                } else if (settings.difficultyMode === "warmup") {
                    minBound = Math.max(800, userRating - 200);
                    maxBound = Math.max(800, userRating - 50);
                } else if (settings.difficultyMode === "challenge") {
                    minBound = userRating + 100;
                    maxBound = userRating + 300;
                } else if (settings.difficultyMode === "custom") {
                    minBound = settings.customMinRating || 800;
                    maxBound = settings.customMaxRating || 2000;
                } else {
                    // Standard
                    minBound = Math.max(800, userRating - 100);
                    maxBound = userRating + 100;
                }

                // Filter candidates within bounds preserving the tag
                let candidates = tagFiltered.filter((p) => p.rating && p.rating >= minBound && p.rating <= maxBound);

                // If fewer than needed, widen bound to ±300 WITHIN the tagFiltered set (NEVER drop the tag)
                if (candidates.length < (settings.problemCount || 5)) {
                    const widened = tagFiltered.filter((p) => p.rating && Math.abs(p.rating - userRating) <= 300);
                    if (widened.length > 0) {
                        candidates = widened;
                    }
                }

                // If still empty, use any problem from tagFiltered (NEVER drop the tag)
                if (candidates.length === 0) {
                    candidates = tagFiltered;
                }

                // Sample target problem count
                const count = Math.min(settings.problemCount || 5, candidates.length);
                const picked = [];
                const usedKeys = new Set();

                while (picked.length < count && usedKeys.size < candidates.length) {
                    const prob = candidates[Math.floor(Math.random() * candidates.length)];
                    const key = `${prob.contestId}-${prob.index}`;
                    if (!usedKeys.has(key)) {
                        picked.push({
                            contestId: prob.contestId,
                            index: prob.index,
                            name: prob.name,
                            rating: prob.rating,
                            tags: prob.tags,
                            isSolved: false,
                        });
                        usedKeys.add(key);
                    }
                }

                // Cache daily result
                const updateTimestamp = now.toISOString();
                await chrome.storage.local.set({
                    cfProblems: picked,
                    cfLastUpdated: updateTimestamp,
                });

                renderProblemsTable(picked);
                updateLastUpdatedLabel(updateTimestamp);
                updateContests();
            } catch (err) {
                console.error("[Daily CF] Fetch problems error:", err);
                lastUptTime.textContent = "Error fetching";
            }
        }

        // --- Reroll a Single Problem (Preserving Tag & Year Range) ---
        async function rerollSingleProblem(targetIndex) {
            try {
                const { cfProblemset, cfProblems, cfContests } = await chrome.storage.local.get([
                    "cfProblemset",
                    "cfProblems",
                    "cfContests",
                ]);
                if (!cfProblemset || !cfProblems || !cfProblems[targetIndex]) return;

                const contestDateMap = new Map();
                if (cfContests) {
                    cfContests.forEach((c) => contestDateMap.set(c.id, new Date(c.startTimeSeconds * 1000)));
                }

                const currentYear = new Date().getFullYear();
                const { filterMinYear, filterMaxYear } = getYearBounds(currentYear);

                const currentKeys = new Set(cfProblems.map((p) => `${p.contestId}-${p.index}`));
                const oldProb = cfProblems[targetIndex];
                const targetRating = oldProb.rating || 1200;
                const activeTag = (settings.selectedTag || "all").toLowerCase().trim();

                // Find candidate matching similar rating bounds, active tag, and year range
                let pool = cfProblemset.filter((p) => {
                    const key = `${p.contestId}-${p.index}`;
                    if (currentKeys.has(key)) return false;
                    const matchesTag = activeTag === "all" || (p.tags && p.tags.some((t) => t.toLowerCase() === activeTag));
                    const matchesRating = p.rating && Math.abs(p.rating - targetRating) <= 150;
                    const contestDate = contestDateMap.get(p.contestId);
                    const pYear = contestDate ? contestDate.getFullYear() : currentYear;
                    const matchesYear = pYear >= filterMinYear && pYear <= filterMaxYear;
                    return matchesTag && matchesRating && matchesYear;
                });

                // If pool is empty, relax year constraint while strictly preserving tag
                if (pool.length === 0) {
                    pool = cfProblemset.filter((p) => {
                        const key = `${p.contestId}-${p.index}`;
                        if (currentKeys.has(key)) return false;
                        const matchesTag = activeTag === "all" || (p.tags && p.tags.some((t) => t.toLowerCase() === activeTag));
                        const matchesRating = p.rating && Math.abs(p.rating - targetRating) <= 200;
                        return matchesTag && matchesRating;
                    });
                }

                if (pool.length > 0) {
                    const replacement = pool[Math.floor(Math.random() * pool.length)];
                    cfProblems[targetIndex] = {
                        contestId: replacement.contestId,
                        index: replacement.index,
                        name: replacement.name,
                        rating: replacement.rating,
                        tags: replacement.tags,
                        isSolved: false,
                    };
                    await chrome.storage.local.set({ cfProblems });
                    renderProblemsTable(cfProblems);
                }
            } catch (err) {
                console.error("[Daily CF] Reroll error:", err);
            }
        }

        function updateLastUpdatedLabel(isoString) {
            if (!isoString) {
                lastUptTime.textContent = "Last: Never";
                return;
            }
            const date = new Date(isoString);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
            const hr12 = hours % 12 === 0 ? 12 : hours % 12;
            const minStr = minutes < 10 ? "0" + minutes : minutes;
            lastUptTime.textContent = `Last: ${hr12}:${minStr} ${ampm}`;
        }

        refreshBtn.addEventListener("click", () => fetchProblems(true));

        // Initial Load
        fetchProblems(false);
    }

    // --- Live Multi-Tab Synchronization ---
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "sync" && (changes.cfUsername || changes.cfSettings)) {
            initDailyCF();
        } else if (areaName === "local" && (changes.cfUsername || changes.cfProblems)) {
            initDailyCF();
        }
    });

    // Start on DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDailyCF);
    } else {
        initDailyCF();
    }
})();

