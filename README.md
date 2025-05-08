# AUTOMETAR - Automated CI/CD Workflow Generator

AUTOMETAR is a powerful tool that automates the creation and management of GitHub Actions workflows for your projects. It provides a user-friendly interface to generate and deploy CI/CD pipelines for various frameworks.

## Features

- 🔄 Automated GitHub Actions workflow generation
- 🚀 Support for multiple frameworks:
  - Django
  - FastAPI
  - Laravel
  - NestJS
  - NextJS
  - NodeJS
- 🔐 Secure GitHub token integration
- 🔍 Repository and branch management
- 🛠️ Customizable deployment configurations

## Prerequisites

- Python 3.12+
- Django
- GitHub Account with Personal Access Token
- SSH access to deployment server

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AUTOMETAR.git
cd AUTOMETAR
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Usage

### 1. Authentication

- Create a GitHub Personal Access Token with necessary permissions
- Add the token to your user profile in the application

### 2. Repository Management

- List all public repositories
- View repository details including branches
- Create workflows for selected repositories

### 3. Workflow Creation

Example API request for creating a Django workflow:

```json
POST /api/v1/create-workflow/{repo_name}/
{
    "push_branches": ["main", "dev"],
    "pull_request_branches": ["main"],
    "version": "3.12",
    "server_path": "/var/www/project",
    "service_name": "gunicorn"
}
```

### 4. Deployment

The generated workflow will:
- Set up the Python environment
- Install dependencies
- Deploy to your server using SSH
- Restart necessary services

## API Endpoints

- `GET /api/v1/get-repos/` - List all public repositories
- `GET /api/v1/get-repo/{repo_name}/` - Get repository details
- `POST /api/v1/create-workflow/{repo_name}/` - Create workflow for repository

## Security

- All API endpoints require authentication
- GitHub tokens are securely stored
- SSH keys are managed through GitHub Secrets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- GitHub Actions
- Django REST Framework
- All contributors and users of the project 