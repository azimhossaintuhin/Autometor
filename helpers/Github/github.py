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

    def get_repos(self):
        url = f"{API_URL}/users/{self.username}/repos"

        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            data = json.loads(response.json())
            return data
        else:
            return False

    def get_repo(self, reponame: str):
        url = f"{API_URL}/repos/{self.username}/{reponame}"
        response = requests.get(url, headers=self.token)
        if response.status_code == 200:
            data = json.loads(response.json())
            return data
        else:
            return False

    def get_branches(self, reponame):
        url = f"{API_URL}/repos/{self.username}/{reponame}/branches"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            data = json.loads(response.json())
            return data
        else:
            return False

    def _encode_content(self, content):
        return base64.b64encode(content.encode()).decode()

    def add_workflow(self, content, reponame):
        url = f"{API_URL}/repos/{self.username}/{reponame}/contents/.github/workflows/daautometor_workflow.yaml"
        body = {
            "message": "Add daautometor_workflow.yaml",
            "content": self._encode_content(content),
            "branch": "main",
        }
        response = requests.put(url, headers=self.headers, json=body)
        if response.status_code == 200:
            data = json.loads(response.json())
            return data
        else:
            return False
        
    
