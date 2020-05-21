import subprocess
import time, datetime


def get_date_string(date_str):     
    fmt = '%Y-%m-%d'
    time_tuple = time.strptime(date_str, fmt)
    year, month, day = time_tuple[:3]
    a_date = datetime.date(year, month, day)
    rtn = a_date.strftime("%a %b %d %X %Y %z +0000")
    return rtn


def get_commit_command(date_str):
    curdate = get_date_string(date_str)
    command = "git commit --date=\""+  curdate + "\" -am \"" + "update\""
    return command


def init_repository(date_str, URL):
    command_list = ["echo init > README.md",
                     "git init",
                     "git add README.md",
                     "git remote add origin " + URL,
                     ]
    command_list += [get_commit_command(date_str)]
    command_list += ["git push -u origin master"]
    command = "&& ".join(command_list)
    #print(command)
    print("Initializing repository...")
    subprocess.call(command, shell=True)
    

def commit_as_date(date_str, times):
    for i in range(times):
        command_list = ["echo " + get_date_string(date_str) + ":  " + str("update") +" >> work.txt"]
        command_list += ["git add work.txt"]
        command_list += [get_commit_command(date_str)]
        command = "&& ".join(command_list)
        #print(command)
        subprocess.call(command, shell=True)
        print(date_str)
    #subprocess.call("git push", shell=True)


def push():
    subprocess.call("git push", shell=True)

    
if __name__ == "__main__":       
    txt_file = open("./date.txt", "r")
    is_init = False
    URL = "https://github.com/xxx/520.git"
    
    flag = 0
    for line in txt_file.readlines():
        line_str = line.replace("\n","")
        date_str = line_str.split(":")[0]
        num = int(line_str.split(":")[1])
        command_list = []
        for i in range(num):
            if flag == 0 and is_init:
                init_repository(date_str, URL)
                flag += 1 
                continue;
            command_list += ["echo " + get_date_string(date_str) + ":  " + str("update") +" >> work.txt"]
            command_list += ["git add work.txt"]
            command_list += [get_commit_command(date_str)]
            command = "&& ".join(command_list)  
            flag += 1 
        if command_list:
            print(line_str)
            subprocess.call(command, shell=True)
    print("pushing...")
    push()
