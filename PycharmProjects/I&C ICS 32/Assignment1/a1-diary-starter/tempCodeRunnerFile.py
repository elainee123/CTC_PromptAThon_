DIARY_NAME = Command_Line.strip().split()[-1]
    Full_Path = PATH / f'{DIARY_NAME}.json'

    # Check directory
    if not PATH.exists() or not PATH.is_dir():
        print("ERROR")
        return

    # Check for duplicate
    if Full_Path.exists():
        print("ERROR")
        return

    # Get user info
    username = input()
    password = input()
    bio = input()

    # Create and save notebook
    notebook = Notebook(username, password, bio)
    notebook.save(str(Full_Path))

    print(f"{Full_Path.resolve()} CREATED")