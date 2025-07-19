# Create a python env and upgrade pip
sudo apt install python3.12-venv
python3 -m venv .env
source .env/bin/activate
pip install --upgrade pip setuptools wheel


# Deactivate a python environment
deactivate
rm -rf .env


# find-stg-acc.py

Dependencies:
pip install azure-mgmt-storage azure-identity azure-mgmt-resource azure-core



# find_app_kv.py
It finds out the app services (that refers to key vault). If the key vault stores a storage key, it reports it.

Usage:
python3 find-app-kv.py <subscriptionId>
python3 find-app-kv.py 56b2c80b-1904-40ce-b905-81213c43ca34 //BADEPROD

Dependencies:
pip install azure-identity azure-mgmt-resource azure-mgmt-web

Inputs:
- subscriptionId: 

Outputs:
- Generates a XLSX report.
