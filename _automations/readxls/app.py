import pandas as pd
import requests

def get_response_code(domain):
    try:
        url = f"https://{domain}"
        print(url)
        response = requests.get(url, timeout=3)
        return response.status_code
    except requests.exceptions.RequestException as e:
        print("Error:", e)
        return None

# Define a function to flush the data to the Excel file
def flush_to_excel():
    df.to_excel(input_file, index=False)
    print("Data flushed to", input_file)

# Read the Excel file
input_file = "domains.xlsx"
#output_file = "updated_domains.xlsx"

df = pd.read_excel(input_file)

# Iterate over each row and update the response code
for index, row in df.iterrows():
    domain = row['FQDN']
    #print(domain)
    try:
        response_code = get_response_code(domain)
        print(response_code)
        if response_code is not None:
            df.at[index, 'HTTPCode'] = response_code
        else:
            df.at[index, 'HTTPCode'] = "None"
        #print('done')
    except Exception as e:
        print(f"Error processing domain '{domain}':", e)

    if (index + 1) % 10 == 0:
            flush_to_excel()

# Flush any remaining data
flush_to_excel()

