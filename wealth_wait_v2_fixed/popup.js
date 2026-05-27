document.addEventListener('DOMContentLoaded', () => {
    // Load existing values
    chrome.storage.sync.get(['wage', 'goal'], (data) => {
        if (data.wage) document.getElementById('wage').value = data.wage;
        if (data.goal) document.getElementById('goal').value = data.goal;
    });

    // Save button logic
    document.getElementById('save').onclick = () => {
        const wage = document.getElementById('wage').value;
        const goal = document.getElementById('goal').value;

        chrome.storage.sync.set({ wage, goal }, () => {
            const btn = document.getElementById('save');
            btn.innerText = "Saved!";
            btn.style.background = "#10b981";
            setTimeout(() => {
                btn.innerText = "Save Settings";
                btn.style.background = "#2563eb";
            }, 1500);
        });
    };
});