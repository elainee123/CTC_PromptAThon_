#lab2.py
# NAME: Rui Wang
# EMAIL: rwang29@uci.edu
# STUDENT ID: 40248554

def add(a, b):
    return  a + b

def sub(a, b):
    return  a - b

def div(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "ZeroDivisionError: Cannot divide by zero." # solving the zero division problem

def mul(a, b):
    return  a * b

def run():
    try:
        a = float(input("Enter left operand: "))
        b = float(input("Enter right operand: ")) # except input more than integer
    except ValueError:
        print("Error: Please enter valid numeric values.")
        run()
        return

    operator = input("What type of calculation would you like to perform (+, -, x, /)? ")

    r = 0

    if operator == "+":
        r = add(a,b)
    elif operator == "-":
        r = sub(a,b)
    elif operator == "x":
        r = mul(a,b)
    elif operator == "/":
        r = div(a,b)
    else:
        r = "Unable to perform the desired calculation, please try again."

    if type(r) == float:
        print(f'{r:.2f}') #trying to solve the binary addition inaccuracy problem
        # if a = 2.11 b = 1.09 the result will be 3.1999999999 instead of 3.20
    else:
        print(r)

    if input("Run another calculation (y/n)? ") == "y":
        run()

if __name__ == "__main__":
    print("Welcome to PyCalc!")
    run()
