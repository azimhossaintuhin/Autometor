from rest_framework.renderers import JSONRenderer
from collections.abc import Mapping


class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context['response']
        status_code = response.status_code
        success = 200 <= status_code < 300

        request = renderer_context.get("request")
        method = request.method if request else ""

        if method == "POST":
            message = "Created successfully" if success else "Failed to create"
        elif method in ["PUT", "PATCH"]:
            message = "Updated successfully" if success else "Failed to update"
        elif method == "DELETE":
            message = "Deleted successfully" if success else "Failed to delete"
        else:
            message = "Fetched successfully" if success else "Failed to fetch data"

        if isinstance(data, dict) and "message" in data:
            message = data.pop("message")

        response_data = {
            "status": success,
            "message": message,
        }

        if success:
            if method == "DELETE":
                response_data["data"] = None
            elif not data:
                response_data["message"] = "No data found"
                response_data["data"] = []
            else:
                if isinstance(data, Mapping) and all(k in data for k in ["current_page", "last_page", "per_page", "results" , "total"]):
                    response_data["pagination"] = {
                        "current_page": data["current_page"],
                        "last_page": data["last_page"],
                        "per_page": data["per_page"],
                        "total": data["total"]
                    }
                    response_data["data"] = data["results"]
                else:
                    response_data["data"] = data
        else:
            if isinstance(data, dict):
                if "errors" in data and isinstance(data["errors"], str):
                    response_data["errors"] = data["errors"]
                elif "detail" in data and isinstance(data["detail"], str):
                    response_data["errors"] = data["detail"]
                elif "non_field_errors" in data:
                    response_data["errors"] = data["non_field_errors"]
                elif "message" in data:
                    response_data["errors"] = data["message"]
                else:
                    # Convert error lists to single string values
                    response_data["errors"] = {
                        key: value[0] if isinstance(
                            value, list) and value else value
                        for key, value in data.items()
                    }
            else:
                print(data)
                response_data["errors"] = "An unknown error occurred"

        return super().render(response_data, accepted_media_type, renderer_context)
