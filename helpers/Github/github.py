from helpers.Github.utils.authenticator import Validate_Token
import requests
import json
import base64

API_URL = "https://api.github.com"


class github:
    def __init__(self, token: str) -> None:
        self.token = token
        self.validate_token = Validate_Token(token)
        self.user_data = self.validate_token.validate_token()
        if not self.user_data:
            raise ValueError("Invalid token")
        self.username = self.user_data["login"]
        self.user_id = self.user_data["id"]
        self.avatar_url = self.user_data["avatar_url"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def get_user_data(self):
        url = f"{API_URL}/user"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            return False

    def get_repos(self,  per_page=100, page=1):
        try:
            url = f"{API_URL}/user/repos"
            params = {
                 
             "per_page": per_page,
                 "page": page
             }
            response = requests.get(url, headers=self.headers, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error: {response.status_code}, {response.text}")
                return False
        except Exception as e:
            print(str(e))
            return False

    def get_branches(self, reponame):
        url = f"{API_URL}/repos/{self.username}/{reponame}/branches"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            return False

    def add_workflow(self, reponame, content):
        try:
            url = f"{API_URL}/repos/{self.username}/{reponame}/contents/.github/workflows/workflow.yaml"

            body = {
                "message": "Add daautometor_workflow.yaml",
                "content": base64.b64encode(content.encode()).decode(),
                "branch": "main",
            }
            response = requests.put(url, headers=self.headers, json=body)
            print("response", response.json())
            if response.status_code == 201:
                data = response.json()
                return data
            if response.status_code == 422:
                return "Workflow already exists"
        except Exception as e:
            print(str(e))
            return str(e)

    def create_env_variables(self, reponame, variables):
        try:
            for key, value in variables.items():
                url = f"{API_URL}/repos/{self.username}/{reponame}/actions/variables"  # fixed typo and removed trailing slash

                payload = {
                    "name": key,
                    "value": str(value),
                }

                response = requests.post(url, headers=self.headers, json=payload)

                if response.status_code == 201:
                    print(f"✅ Created variable: {key}")
                elif response.status_code == 409:
                    print(f"⚠️ Variable already exists: {key}")
                else:
                    print(
                        f"❌ Failed to create {key}: {response.status_code} - {response.text}"
                    )

            return True  # moved outside the loop

        except Exception as e:
            print(f"Exception: {str(e)}")
            return str(e)

    def get_env_variables(self, reponame):
        url = f"{API_URL}/repos/{self.username}/{reponame}/actions/variables"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            return False

    def delete_env_variables(self, reponame, key):
        url = f"{API_URL}/repos/{self.username}/{reponame}/actions/variables/{key}"
        response = requests.delete(url, headers=self.headers)
        if response.status_code == 204:
            return True
        else:
            return False
