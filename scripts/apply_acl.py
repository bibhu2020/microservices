import yaml
import requests
import os

with open(".github/access-control/acl.yml", "r") as f:
    acl = yaml.safe_load(f)

repo_owner = os.getenv("GITHUB_REPOSITORY").split("/")[0]
repo_name = os.getenv("GITHUB_REPOSITORY").split("/")[1]
token = os.getenv("GH_TOKEN")
headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/vnd.github+json"
}

def set_repo_permission(username, permission):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/collaborators/{username}"
    res = requests.put(url, headers=headers, json={"permission": permission.lower()})
    print(f"Set {username} to {permission}: {res.status_code} - {res.text}")

for user in acl["configuration"]["manageAccess"]:
    set_repo_permission(user["member"], user["role"])
