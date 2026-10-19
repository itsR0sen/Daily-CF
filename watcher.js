// Daily CF — Submissions Watcher Script
(() => {
    checkSolvedProblems();

    async function checkSolvedProblems() {
        try {
            const data = await chrome.storage.sync.get("cfUsername");
            const username = data.cfUsername;
            if (!username) return;

            // Fetch recent 100 submissions
            const statusRes = await fetch(
                `https://codeforces.com/api/user.status?handle=${encodeURIComponent(username)}&from=1&count=100`
            ).then((r) => r.json());

            if (statusRes.status !== "OK") throw new Error("Submissions API error");

            // Build set of accepted problem keys
            const acceptedKeys = new Set();
            statusRes.result.forEach((sub) => {
                if (sub.verdict === "OK" && sub.problem) {
                    const key = `${sub.problem.contestId ?? "NA"}-${sub.problem.index ?? sub.problem.name ?? "NA"}`;
                    acceptedKeys.add(key);
                }
            });

            // Read current daily problems cache
            const cache = await chrome.storage.local.get(["cfProblems"]);
            if (!cache.cfProblems || !cache.cfProblems.length) return;

            let changed = false;
            const updatedProblems = cache.cfProblems.map((p) => {
                const key = `${p.contestId ?? "NA"}-${p.index ?? p.name ?? "NA"}`;
                if (acceptedKeys.has(key) && !p.isSolved) {
                    changed = true;
                    return {
                        ...p,
                        isSolved: true,
                        solvedAt: new Date().toISOString(),
                    };
                }
                return p;
            });

            // Update storage if any problem was newly solved
            if (changed) {
                await chrome.storage.local.set({ cfProblems: updatedProblems });
                console.log("[Daily CF Watcher] Solved problem status updated.");
            }
        } catch (err) {
            console.error("[Daily CF Watcher] Error checking solved submissions:", err);
        }
    }
})();
