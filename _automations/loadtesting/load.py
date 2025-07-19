import requests
import concurrent.futures
import time
import uuid

url = 'https://www.microsoft.com/en-us/translator/xyz/'
duration = 5 * 60  # 5 minutes in seconds

def make_request():
    unique_param = str(uuid.uuid4())  # Generate a unique identifier
    response = requests.get(f"{url}?cache_bypass={unique_param}")
    response = requests.get(url)
    print(f"{url}?cache_bypass={unique_param}")
    print(f"Status code: {response.status_code}")
    # Capture other response details as needed
    # unique_param = str(int(time.time()))  # Generate a timestamp
    # response = requests.get(f"{url}?test={unique_param}")
    # #response = requests.get(url)
    #print(f"Status code: {response.status_code}")

def run_load_test(num_users):
    start_time = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=num_users) as executor:
        futures = {executor.submit(make_request) for _ in range(num_users)}
        concurrent.futures.wait(futures)

    elapsed_time = time.time() - start_time
    print(f"Elapsed time: {elapsed_time:.2f} seconds")

def main():
    num_users = 1
    start_time = time.time()
    while time.time() - start_time < 60:  # Scale load over 1 minute
        num_users += 1
        run_load_test(num_users)
        time.sleep(1)

    # Keep the load at 50 users for 5 minutes
    for _ in range(duration):
        run_load_test(num_users)
        time.sleep(1)

if __name__ == "__main__":
    main()
