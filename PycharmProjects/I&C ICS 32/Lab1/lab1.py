# lab1.py
# Name: Rui Wang
# Email: rwang29@uci.edu
# ID: 40248554
def basic_calculator():
    number1 = int(input("Enter your first operand: "))
    number2 = int(input("Enter your second operand: "))
    operator = input("Enter your desired operator (+, -, x, or /): ")
    if operator not in ['+','-','x','/']:
        print("Invalid operator")
        return
    ans = number1 + number2 if operator == "+" else number1 - number2 if operator == "-" else number1 * number2 if operator == '*' else number1 / number2
    print(f'\nThe result of your calculation is: {round(ans,4) if type(ans) == float else ans}')

if __name__ == "__main__":
    basic_calculator()
