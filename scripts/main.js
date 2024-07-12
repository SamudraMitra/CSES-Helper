if (typeof browser === "undefined") var browser = chrome;

const chromeStorage = chrome.storage.local;

const submitCodeFile = (fileData) => {
    const formData = new FormData();
    const languageSelector = document.getElementById("lang");
    const languageOption = document.getElementById("option");
    const csrfToken = document.querySelector("input[name='csrf_token']").value;
    formData.append('csrf_token', csrfToken);
    formData.append('task', problemId);
    formData.append('lang', languageSelector.value);
    if (!languageOption.disabled) formData.append('option', languageOption.value);
    formData.append('target', 'problemset');
    formData.append('type', 'course');
    formData.append('file', fileData, 'code.cpp');
    fetch('/course/send.php', {
        method: 'POST',
        body: formData
    }).then((response) => {
        if (response.ok) {
            location.href = response.url;
        }
    }).catch((error) => {
        console.error('Error:', error);
    });
};
const isSubmitPage = () => location.href.startsWith("https://cses.fi/problemset/submit");

if (isSubmitPage()) {
    const languageSelector = document.getElementById("lang");
    const languageOption = document.getElementById("option");

    chromeStorage.get(["language", "option"]).then((result) => {
        setTimeout(() => {
            if (result.language) languageSelector.value = result.language;
            languageSelector.dispatchEvent(new Event('change'));
            setTimeout(() => {
                if (result.option) languageOption.value = result.option;
                languageSelector.dispatchEvent(new Event('change'));
            }, 300);
        }, 300);
    });
    languageSelector.addEventListener("change", () => {
        chromeStorage.set({ language: languageSelector.value });
    });
    languageOption.addEventListener("change", () => {
        chromeStorage.set({ option: languageOption.value });
    });
    const codeInputArea = document.createElement("textarea");
    codeInputArea.id = "code";
    codeInputArea.style.width = "500px";
    codeInputArea.style.height = "300px";
    const form = document.querySelector("form");
    form.insertBefore(codeInputArea, form.children[5]);
    const submitButton = document.querySelector("input[type='submit']");
    submitButton.addEventListener("click", (event) => {
        const code = document.getElementById("code").value;
        if (code == "") {
            const fileInput = document.querySelector("input[type='file']");
            submitCodeFile(fileInput.files[0]);
            return;
        }
        submitCodeFile(new Blob([code], { type: 'text/plain' }))
        event.preventDefault();
    });
}
