#lab3.py

# Starter code for lab 3 in ICS 32 Programming with Software Libraries in Python

# Replace the following placeholders with your information.
# Please see the README in this repository for the requirements of this lab exercise

# NAME: Rui Wang
# EMAIL: rwang29@uci.edu
# STUDENT ID: 40248554

import os
import pathlib

def change_directory_path(directorypath):
    try:
        print(f'Current directory: {directorypath}')
        while True:
            path_change = bool(input("Do you want to change the directory: Y/N\n") == 'Y')
            if path_change:
                directory_path_change = input("Enter new directory:\n")
                if os.path.exists(directory_path_change):
                    directorypath = directory_path_change
                    print(f'Directory successfully changed to: {directorypath}')
                    break
                else:
                    print("The directory doesn't exist, please try again or use the original directorypath")
            else:
                break
    except Exception as ex:
        print(f"ERROR --- change_directory_path --- {ex}")
    return directorypath

def create_file(filepath):
    try:
        if not os.path.exists(filepath):
            with open(filepath, "w") as file:
                file.write('')
    except Exception as ex:
        print(f"ERROR --- create_file --- {ex}")

def readfile(filepath):
    try:
        with open(filepath, "r") as file:
            for line in file.readlines():
                print(line)
    except Exception as ex:
        print(f"ERROR --- readfile --- {ex}")

def enter_note(filepath):
    try:
        with open(filepath, "a") as file:
            while True:
                user_input = input("Please enter a new note (enter q to exit): ")
                if user_input == 'q':
                    break
                file.write(str(user_input+'\n'))
    except Exception as ex:
        print(f"ERROR --- enter_note --- {ex}")

def run():
    try:
        directorypath = pathlib.Path().resolve()
        directorypath = change_directory_path(directorypath)
        filepath = directorypath+"/pynote.txt"

        create_file(filepath)

        print("Welcome to PyNote!")
        print("Here are your notes:\n")

        readfile(filepath)
        enter_note(filepath)

    except Exception as ex:
        print(f"ERROR --- MAIN ERROR --- {ex}")

if __name__ == '__main__':
    run()
