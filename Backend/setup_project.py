import os

# Project structure
structure = {
    "finpilot-backend": {
        "routes": [
            "auth.js",
            "data.js",
            "analyze.js",
            "chat.js",
            "process.js"
        ],
        "controllers": [
            "authController.js",
            "dataController.js",
            "analyzeController.js",
            "chatController.js",
            "processController.js"
        ],
        "services": [
            "ipfsService.js",
            "analysisService.js",
            "chatService.js",
            "walletService.js"
        ],
        "utils": [
            "categories.js",
            "rules.js",
            "promptBuilder.js"
        ],
        "middleware": [
            "errorHandler.js"
        ],
        "root_files": [
            "index.js",
            "package.json",
            ".env"
        ]
    }
}

def create_structure(base, content):
    for key, value in content.items():
        base_path = os.path.join(base, key)
        os.makedirs(base_path, exist_ok=True)

        # Create root files
        for file in value.get("root_files", []):
            open(os.path.join(base_path, file), "w").close()

        # Create subfolders and files
        for folder, files in value.items():
            if folder == "root_files":
                continue

            folder_path = os.path.join(base_path, folder)
            os.makedirs(folder_path, exist_ok=True)

            for file in files:
                file_path = os.path.join(folder_path, file)
                open(file_path, "w").close()

        print(f"✅ Created project at: {base_path}")

# Run
create_structure(".", structure)