from django.core.management.base import BaseCommand
from apps.cicd.models import Language, Framework

class Command(BaseCommand):
    help = 'Populates the database with programming languages and their high-demand frameworks'

    def handle(self, *args, **kwargs):
        data = [
            {
                "language": "Python",
                "frameworks": ["Django", "Flask", "FastAPI"]
            },
            {
                "language": "JavaScript",
                "frameworks": ["React", "Vue", "Angular", "Next.js"]
            },
            {
                "language": "Java",
                "frameworks": ["Spring", "JSF", "Hibernate"]
            },
            {
                "language": "PHP",
                "frameworks": ["Laravel", "Symfony", "CodeIgniter"]
            },
            {
                "language": "Ruby",
                "frameworks": ["Ruby on Rails", "Sinatra"]
            },
            {
                "language":"Go",
                "frameworks":["Gin", "Echo", "Fiber"]
            },
            {
                "language":"C#",
                "frameworks":["ASP.NET", "Entity Framework", "Dapper"]
            },
            
        ]

        for item in data:
            lang_obj, created = Language.objects.get_or_create(name=item["language"])
            for fw in item["frameworks"]:
                Framework.objects.get_or_create(language=lang_obj, name=fw)

        self.stdout.write(self.style.SUCCESS('✅ Successfully populated languages and frameworks.'))
