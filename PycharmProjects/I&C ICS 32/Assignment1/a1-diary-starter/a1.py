# Starter code for assignment 1 in ICS 32 Programming with Software Libraries in Python

# NAME: Rui Wang
# EMAIL: rwang29
# STUDENT ID: 40248554

from command_parser import *
from pathlib import Path
import json, time

#All Command_Line function should be in 'command_parser' file

def run():
    Notebookpass = None
    Notebook = None
    try:
        while True:
            Command_Line = input('')
            if Command_Line == "Q":
                return
            elif Command_Line[0] == "C":
                Notebookpass, Notebook = Create_Notebook(Command_Line)
            elif Command_Line[0] == "D":
                Delete_Notebook(Command_Line)
            elif Command_Line[0] == "O":
                Notebookpass, Notebook = Load_Notebook(Command_Line)
            elif Command_Line[0] == "E":
                Edite_Notebook(Command_Line, Notebookpass, Notebook)
            elif Command_Line[0] == "P":
                Print_Notebook(Command_Line, Notebook)
            else:
                print("ERROR")
    except Exception:
        print("ERROR")

if __name__=="__main__": 
    run()