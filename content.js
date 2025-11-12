console.log("[CF DEBUG] Content script initialized.");

chrome.storage.sync.get(["cfUsername"], async (data) => {
    const username = data.cfUsername;
    if (!username) {
        window.alert(
            "Save your Username in CF Daily Extension to get daily Suggestions!"
        );
        return;
    }
    console.log("[CF DEBUG] CF username found:", username);

    const sidebar = document.querySelector(
        ".roundbox.sidebox.borderTopRound .personal-sidebar"
    )?.parentNode;
    if (!sidebar) {
        console.log("[CF DEBUG] Sidebar container not found. Aborting.");
        return;
    }

    const existingTable = document.getElementById("cf-problem-table");
    if (existingTable) existingTable.remove();

    const tableDiv = document.createElement("div");
    tableDiv.id = "cf-problem-table";
    tableDiv.className = "roundbox sidebox top-contributed borderTopRound";
    tableDiv.style.marginTop = "1em";

    // Caption
    const caption = document.createElement("div");
    caption.className = "caption titled";
    caption.textContent = "→ Daily CF";

    const lastUptTime = document.createElement("span");
    lastUptTime.style.fontSize = "0.8em";
    lastUptTime.style.color = "#666";
    lastUptTime.style.float = "left";
    lastUptTime.textContent = "Last: Never";

    tableDiv.appendChild(caption);

    // Table skeleton
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

    // Refresh button container
    const refreshContainer = document.createElement("div");
    refreshContainer.style.cssText =
        "padding: 0em 0.5em 0.2em 1em;text-align:right; margin-top:0.5em;";
    const refreshBtn = document.createElement("input");
    refreshBtn.type = "submit";
    refreshBtn.value = "Refresh";
    refreshBtn.style.cssText =
        "height:1.65em;padding:0 0.7em;cursor:pointer;transition:background 0.2s ease;";
    refreshContainer.appendChild(lastUptTime);
    refreshContainer.appendChild(refreshBtn);
    tableDiv.appendChild(refreshContainer);

    sidebar.parentNode.insertBefore(tableDiv, sidebar.nextSibling);

    // Minimal slide-down + fade-in animation
    function animateRows() {
        const rows = tbody.querySelectorAll("tr:not(:first-child)");
        rows.forEach((row, i) => {
            row.style.opacity = 0;
            row.style.transform = "translateY(-3px)";
            setTimeout(() => {
                row.style.transition = "opacity 0.2s ease, transform 0.2s ease";
                row.style.opacity = 1;
                row.style.transform = "translateY(0)";
            }, i * 20);
        });
    }

    // Update "Last updated" timestamp display
    async function updateLastRefreshed() {
        const cache = await chrome.storage.local.get(["cfLastUpdated"]);
        if (!cache.cfLastUpdated) {
            lastUptTime.textContent = "Last: Never";
            return;
        }

        const date = new Date(cache.cfLastUpdated);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const hr12 = hours % 12 === 0 ? 12 : hours % 12;
        const minStr = minutes < 10 ? "0" + minutes : minutes;

        lastUptTime.textContent = `Last: ${hr12}:${minStr} ${ampm}`;
    }

    // Render problems into table
    function renderProblems(problems) {
        tbody
            .querySelectorAll("tr:not(:first-child)")
            .forEach((r) => r.remove());

        if (!problems || problems.length === 0) {
            const row = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 3;
            td.textContent = "No problems to suggest.";
            row.appendChild(td);
            tbody.appendChild(row);
            animateRows();
            return;
        }

        problems.forEach((prob, i) => {
            const row = document.createElement("tr");
            row.className = i % 2 ? "dark" : "";
            if (i === problems.length - 1) row.classList.add("bottom");

            const idx = document.createElement("td");
            idx.className = "left" + (row.className ? " dark" : "");
            idx.textContent = i + 1;
            row.appendChild(idx);

            const probTd = document.createElement("td");
            probTd.className = row.className.includes("dark") ? " dark" : "";
            const a = document.createElement("a");
            a.href = prob.contestId
                ? `https://codeforces.com/problemset/problem/${prob.contestId}/${prob.index}`
                : `https://codeforces.com/problemset?search=${encodeURIComponent(
                      prob.name
                  )}`;
            a.target = "_blank";
            a.textContent = prob.name ?? `${prob.contestId}/${prob.index}`;
            a.className = " text-align-left";
            probTd.appendChild(a);
            row.appendChild(probTd);

            const ratingTd = document.createElement("td");
            ratingTd.className = row.className.includes("dark") ? " dark" : "";
            ratingTd.textContent = prob.rating ?? "-";
            row.appendChild(ratingTd);

            tbody.appendChild(row);
        });

        animateRows();
        updateLastRefreshed();
    }

    // Fetch unattempted problems (weekly refresh of problemset + contest list)
    async function fetchProblems(force = false) {
        try {
            // 1. Check daily cache
            if (!force) {
                const cache = await chrome.storage.local.get([
                    "cfProblems",
                    "cfLastUpdated",
                ]);
                const today = new Date().toDateString();
                if (
                    cache.cfProblems &&
                    cache.cfLastUpdated &&
                    new Date(cache.cfLastUpdated).toDateString() === today
                ) {
                    console.log("[CF DEBUG] Loaded problems from daily cache.");
                    renderProblems(cache.cfProblems);
                    return;
                }
            }

            console.log("[CF DEBUG] Fetching fresh problems...");

            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            // 2. Load problemset (weekly refresh)
            let { cfProblemset, cfProblemsetUpdated } =
                await chrome.storage.local.get([
                    "cfProblemset",
                    "cfProblemsetUpdated",
                ]);

            if (
                !cfProblemset ||
                !cfProblemsetUpdated ||
                new Date(cfProblemsetUpdated) < weekAgo
            ) {
                console.log(
                    "[CF DEBUG] Refreshing full problemset from API..."
                );
                const problemsetRes = await fetch(
                    "https://codeforces.com/api/problemset.problems"
                ).then((r) => r.json());

                if (problemsetRes.status !== "OK")
                    throw new Error("API error: problemset.problems");

                cfProblemset = problemsetRes.result.problems;
                cfProblemsetUpdated = now.toISOString();

                await chrome.storage.local.set({
                    cfProblemset,
                    cfProblemsetUpdated,
                });
            } else {
                console.log("[CF DEBUG] Using cached problemset.");
            }

            // 3. Load contest list (weekly refresh)
            let { cfContests, cfContestsUpdated } =
                await chrome.storage.local.get([
                    "cfContests",
                    "cfContestsUpdated",
                ]);

            if (
                !cfContests ||
                !cfContestsUpdated ||
                new Date(cfContestsUpdated) < weekAgo
            ) {
                console.log("[CF DEBUG] Refreshing contest list from API...");
                const contestsRes = await fetch(
                    "https://codeforces.com/api/contest.list?gym=false"
                ).then((r) => r.json());

                if (contestsRes.status !== "OK")
                    throw new Error("API error: contest.list");

                cfContests = contestsRes.result;
                cfContestsUpdated = now.toISOString();

                await chrome.storage.local.set({
                    cfContests,
                    cfContestsUpdated,
                });
            } else {
                console.log("[CF DEBUG] Using cached contest list.");
            }

            // 4. Build contest date map
            const contestDateMap = new Map();
            cfContests.forEach((c) => {
                contestDateMap.set(c.id, new Date(c.startTimeSeconds * 1000));
            });

            // 5. Fetch user status + info
            const [statusRes, userRes] = await Promise.all([
                fetch(
                    `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
                ).then((r) => r.json()),
                fetch(
                    `https://codeforces.com/api/user.info?handles=${username}`
                ).then((r) => r.json()),
            ]);

            if (statusRes.status !== "OK" || userRes.status !== "OK")
                throw new Error("API error");

            const submissions = statusRes.result;
            const user = userRes.result[0];
            const userRating = user.rating ?? 1500;

            // 6. Build attempted set
            const attempted = new Set();
            submissions.forEach((sub) => {
                if (sub.problem.contestId && sub.problem.index) {
                    attempted.add(
                        `${sub.problem.contestId}-${sub.problem.index}`
                    );
                }
            });

            // 7. Filter unattempted & recent (<3 years)
            const threeYearsAgo = new Date(
                now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000
            );
            const unattempted = cfProblemset.filter((p) => {
                const key = `${p.contestId}-${p.index}`;
                const contestDate = contestDateMap.get(p.contestId);
                return (
                    !attempted.has(key) &&
                    contestDate &&
                    contestDate >= threeYearsAgo
                );
            });

            //8. Problem set creation
            let candidates;
            if (user.rating === undefined || user.rating <= 700) {
                candidates = unattempted.filter(
                    (p) =>
                        p.rating === 800 ||
                        p.rating === 900 ||
                        p.rating === 1000
                );
            } else {
                const filtered = unattempted.filter(
                    (p) => p.rating && Math.abs(p.rating - userRating) <= 300
                );

                candidates = filtered.length >= 5 ? filtered : unattempted;
            }

            // 9. Randomly pick up to 10 problems
            const picked = [];
            const usedKeys = new Set();
            while (picked.length < Math.min(10, candidates.length)) {
                const prob =
                    candidates[Math.floor(Math.random() * candidates.length)];
                const key = `${prob.contestId}-${prob.index}`;
                if (!usedKeys.has(key)) {
                    picked.push(prob);
                    usedKeys.add(key);
                }
            }

            // 10. Save daily cache
            await chrome.storage.local.set({
                cfProblems: picked,
                cfLastUpdated: now.toISOString(),
            });

            renderProblems(picked);
            console.log("[CF DEBUG] Problems saved to daily cache.");
        } catch (err) {
            console.error("[CF DEBUG] Error fetching problems:", err);
            renderProblems([]);
        }
    }

    // Button click → force refresh
    refreshBtn.addEventListener("click", () => fetchProblems(true));

    // Initial load
    fetchProblems(false);
});
