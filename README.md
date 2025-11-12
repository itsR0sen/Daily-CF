# **Daily CF – Chrome Extension**

**Repository:** [Daily CF on GitHub](https://github.com/itsR0sen/Extensions/tree/4931fe679f217e66cd7fe26cb5d8bba00f854cf0/Daily%20CF)
**Author:** [itsR0sen](https://github.com/itsR0sen)

---

## **Overview**

**Daily CF** is a Chrome extension developed to enhance the problem-solving workflow on the Codeforces platform. It automatically suggests a new problem each day based on the user’s history and rating range, presenting it directly in the Codeforces interface. This effectively removes the need to decide what to solve each day and streamlines practice into a quick, habitual step.

---

## **Key Features**

-   Daily automatic selection of a relevant problem from Codeforces.
-   Seamless integration into Codeforces pages (problem set, submission pages, etc.).
-   Implements local caching to avoid repeat suggestions within a 24-hour window.
-   Minimal overhead and clean UI integration—built for efficiency.
-   Configurable via extension source to adjust rating range, problem filters, and supported pages.

---

## **Project Structure (as per repository)**

```
Daily CF/
│
├── manifest.json           # Configuration for Chrome extension: version, permissions, content scripts
├── content.js              # Injects UI into Codeforces pages and coordinates daily problem logic
├── watcher.js              # Monitors submission pages to detect accepted problems and update state
├── popup.html              # Popup UI (optional interface when toolbar icon is clicked)
├── popup.js                # Script associated with popup.html for user actions/settings
├── icons/                  # Folder containing icon files used for toolbar, extension listing
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md               # Documentation file (this document)
```

---

## **Manual Installation Guide (Chrome)**

Follow these detailed steps to install **Daily CF** manually from the GitHub source.

### **Step 1: Download the Extension Files**

1. Open the repository:
   [Daily CF – GitHub](https://github.com/itsR0sen/Extensions/tree/4931fe679f217e66cd7fe26cb5d8bba00f854cf0/Daily%20CF)
2. Click the green **Code** button and select **Download ZIP**.
3. Extract the downloaded ZIP file to a folder of your choice (for example: `Documents/DailyCF`).
4. Confirm that the extracted folder includes the file `manifest.json` at its root.

### **Step 2: Access Chrome’s Extensions Page**

1. Open **Google Chrome**.
2. In the address bar, enter:

    ```
    chrome://extensions/
    ```

    Press **Enter** to navigate to the extensions management page.

### **Step 3: Enable Developer Mode**

1. On the extensions page, locate the toggle labeled **Developer mode** (usually at top-right).
2. Switch **Developer mode** to **ON**. This enables additional options: **Load unpacked**, **Pack extension**, **Update**.

### **Step 4: Load the Unpacked Extension**

1. Click the **Load unpacked** button.
2. A file-browser dialog will appear. Navigate to the folder where you extracted the extension (the folder containing `manifest.json`).
3. Select that folder and click **Open** (or the equivalent).
4. Chrome will install the extension. If successful, you will see **Daily CF** listed among installed extensions.

### **Step 5: Verify Installation**

1. Ensure that the extension **Daily CF** appears in the list and is **Enabled** (toggle is switched on).
2. Check the Chrome toolbar: the extension’s icon (from the `icons/` folder) should appear.
3. To pin it: click the puzzle-piece icon (Extensions menu) → find _Daily CF_ → click the **pin** icon.

### **Step 6: Watch Visual Tutorial (Optional)**

For a clear, step-by-step installation walkthrough, view the video tutorial at:
[Click this for Youtube Video](https://youtu.be/oswjtLwCUqg?si=LnK9wOZkxAxOoUW7)

---

## **Usage Instructions**

1. Navigate to [Codeforces](https://codeforces.com/) using Chrome.
2. On a supported page (e.g., problem set, user profile, submission page), **Daily CF** will automatically inject its panel.
3. The panel displays your “Problem of the Day”. Click the link in the panel to open the problem.
4. After 24 hours, a new problem will be selected and displayed automatically.
5. If you change pages or reload the browser, the panel will refresh accordingly.

---

## **Development Notes**

-   When you make changes to the source code (e.g., content.js, watcher.js), revisit `chrome://extensions/` and click the **Reload (🔄)** icon beside _Daily CF_ to apply updates.
-   For debugging, navigate to a Codeforces page, right-click → **Inspect** → open the **Console** tab to view logs emitted by the extension scripts.
-   To support additional Codeforces URLs or alter where the panel appears, modify the `"matches"` field under `content_scripts` in `manifest.json`.
-   To adjust problem selection logic (e.g., rating range, tags), review the code in `content.js` and `watcher.js`.

---

## **Future Enhancements**

Planned enhancements include:

-   A user interface for selecting preferred rating range or problem tags.
-   Tracking the history of daily problems solved and providing statistics.
-   Theme support (light/dark mode) to match Codeforces UI.
-   Publishing the extension to the Chrome Web Store for automatic updates and easier installation.

---

## **License**

This project is provided under an open-source license for educational and personal usage.
You may modify and redistribute the extension provided that you credit the original author:
**[itsR0sen](https://github.com/itsR0sen)**
