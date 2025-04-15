# Starter code for assignment 1 in ICS 32 Programming with Software Libraries in Python

# Replace the following placeholders with your information.

# NAME: Rui Wang
# EMAIL: rwang29@uci.edu
# STUDENT ID: 40248554

from notebook import *
from pathlib import Path
import shlex
import json, time

def Create_Notebook(Command_Line):
    """
    In the formate: C <PATH> -n <DIARY_NAME>
    Get all the info in Command_Line
    Create notebook with the input 'username', 'password', and 'bio' to the path
    Print the <PATH> CREATED
    """
    try:
        quote_char = Command_Line.split()[1][0]
    except IndexError:
        print("ERROR")
        return None,None

    if quote_char not in ['"',"'"] or '-n' not in Command_Line.shlex.split():
        print("ERROR")
        return None, None

    tyr:
        PATH = Path(Command_Line.split(quote_char)[1])
        DIARY_NAME = Command_Line.split()[-1]
        Full_Path = PATH / f'{DIARY_NAME}.json'
    except IndexError:
        print("ERROR")
        return None,None
    
    if not PATH.exists() or not PATH.is_dir() or Full_Path.exists():
        print("ERROR")
        return None, None

    username = input()
    password = input()
    bio = input()

    try:
        Full_Path.touch() #Create a json file first
    except PermissionError or FileNotFoundError:
        print(ERROR)
        return None,None

    notebook = Notebook(username,password,bio)
    notebook.save(str(Full_Path))
    print(f'{str(Full_Path)} CREATED')
    return PATH,notebook

def Delete_Notebook(Command_Line):
    """
    In the formate: D <PATH>
    Get the notebook's path from in Command_Line
    Delete notebook with the path 
    Print the <PATH> DELETED

    if file not json or doesn't exist, print ERROR
    """
    PATH = Path(Command_Line[2:])
    try:
        if PATH.exists() and PATH.is_file() and PATH.suffix == '.json':
            PATH.unlink()
            print(f"{str(PATH)} DELETED")
        else:
            print("ERROR")
    except PermissionError or FileNotFoundError:
        print(ERROR)
        return

def Load_Notebook(Command_Line):
    """
    In the formate: O <PATH>
    Input username and password
    if they matches then print: 
        Notebook loaded.
        <Username>
        <Bio>
    """
    try:
        PATH = Path(Command_Line[2:])
        if not PATH.exists() or not PATH.is_file() or PATH.suffix != '.json':
            print("ERROR")
            return None,None
        username = input()
        password = input()

        notebook = Notebook("","","")
        notebook.load(str(PATH))

        if (notebook.username != None) and username == notebook.username and password == notebook.password:
            print("Notebook loaded.")
            print(notebook.username)
            print(notebook.bio)
            return PATH, notebook
        else:
            print("ERROR")
            return None,None
    except Exception as ex:
        print("ERROR")
        #print(f'Load_Notebook: {ex}')

def Edite_Notebook(Command_Line,Notebookpass,Notebook):
    line = shlex.split(Command_Line)
    i = 1
    try:
        while i < len(line):
            flag = line[i]
            i+=1
            if flag == '-usr':
                username = line[i]
                Notebook.username = username
                Notebook.save(str(Notebookpass))
            elif flag == '-pwd':
                password = line[i]
                Notebook.password = password
                Notebook.save(str(Notebookpass))
            elif flag == '-bio':
                bio = line[i]
                Notebook.bio = bio
                Notebook.save(str(Notebookpass))
            elif flag == '-add':
                newdir = line[i]
                Notebook.add_diary(Diary(newdir))
                Notebook.save(str(Notebookpass))
            elif flag == '-del':
                dele = line[i]
                if Notebook.del_diary(int(dele)):
                    Notebook.save(str(Notebookpass))
                else:
                    print("ERROR")
                    break
            else:
                print("ERROR")
                break
            i+=1
    except IndexError or ValueError:
        print("ERROR")


def Print_Notebook(Command_Line,Notebook):
    line = shlex.split(Command_Line)
    i = 1
    try:
        while i < len(line):
            flag = line[i]
            if flag == "-usr":
                print(Notebook.username)
            elif flag == "-pwd":
                print(Notebook.password)
            elif flag == "-bio":
                print(Notebook.bio)
            elif flag == "-diaries":
                for index, diary in enumerate(Notebook.get_diaries()):
                    print(f"{index}: {diary.entry}")
            elif flag == "-diary":
                i += 1
                if i >= len(line):
                    print("ERROR")
                    break
                index = int(line[i])
                diaries = Notebook.get_diaries()
                if index < 0 or index >= len(diaries):
                    print("ERROR")
                    break
                print(diaries[index].entry)

            elif flag == "-all":
                print(Notebook.username)
                print(Notebook.password)
                print(Notebook.bio)
                for index, diary in enumerate(Notebook.get_diaries()):
                    print(f"{index}: {diary.entry}")
            else:
                print("ERROR")
                break
            i += 1
    except ValueError:
        print("ERROR")
