import requests

class Validate_Token:
    def __init__(self,token:str)->None:
        self.token = token
        self.url = "https://api.github.com/user"
        self.headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
    def  validate_token(self)->bool:
        response = requests.get(self.url, headers=self.headers)
        if response.status_code == 200:
            return True
        else:
            return False

