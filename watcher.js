// run once on load
checkSolvedProblems();

async function checkSolvedProblems() {
    // get username
    const data = await chrome.storage.sync.get("cfUsername");
    const username = data.cfUsername;
    if (!username) return;

    try {
        // fetch latest submissions
        const statusRes = await fetch(
            `https://codeforces.com/api/user.status?handle=${username}&from=1&count=100`
        ).then((r) => r.json());

        if (statusRes.status !== "OK") throw new Error("API error");

        // collect solved keys
        const acceptedKeys = new Set();
        statusRes.result.forEach((sub) => {
            if (sub.verdict === "OK") {
                const key = `${sub.problem.contestId ?? "NA"}-${
                    sub.problem.index ?? sub.problem.name ?? "NA"
                }`;
                acceptedKeys.add(key);
            }
        });

        // get cache
        const cache = await chrome.storage.local.get(["cfProblems"]);
        if (!cache.cfProblems || !cache.cfProblems.length) return;

        // remove solved from cache
        const updatedProblems = cache.cfProblems.filter((p) => {
            const key = `${p.contestId ?? "NA"}-${p.index ?? p.name ?? "NA"}`;
            return !acceptedKeys.has(key);
        });

        // save back if changed
        if (updatedProblems.length !== cache.cfProblems.length) {
            await chrome.storage.local.set({ cfProblems: updatedProblems });
        }
    } catch (err) {
        console.error("error checking problems:", err);
    }
}
