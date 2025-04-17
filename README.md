
# ERP Inventory & Sales Module Frontend and Backend

This project consists of a backend built with **Django** (REST API) and a frontend built with **Angular**. The backend handles the core logic for the application, including user authentication, orders, inventory, and more. The frontend is responsible for providing a user interface to interact with the backend.

## Table of Contents
- [Backend Setup (Django)]
- [Frontend Setup (Angular)]
- [Running the Application Locally]
- [API Endpoints]
- [Database Setup]

---

## Backend Setup (Django)

### Requirements
- Python 3.13
- Django 4.x+
- Django REST framework
- PostgreSQL
- Redis (for caching)
- Docker (for containerization)

### Installation Steps

1. **Clone the Repository**  
   Clone the repository to your local machine:

   ```bash
   git clone https://github.com/vishnnu-vishnu/ERP.git
   cd ERP/backend
   ```

2. **Create a Virtual Environment and Activate**  
   Create and activate a Python virtual environment:

   ```bash
   python -m venv venv
   venv\Scriptsctivate  # For Windows
   source venv/bin/activate  # For macOS/Linux
   ```

3. **Install Dependencies**  
   Install the necessary Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up the Database**  
   Set up your PostgreSQL database (or other databases as required):

   - Update the `DATABASES` configuration in `settings.py` to reflect your PostgreSQL setup.
   - Run migrations to apply the database schema:

     ```bash
     python manage.py migrate
     ```

5. **Start the Development Server**  
   Start the Django development server:

   ```bash
   python manage.py runserver
   ```

   The backend should now be running at `http://127.0.0.1:8000`.

---

## Frontend Setup (Angular)

### Requirements
- Node.js 14.x+
- Angular CLI
- npm

### Installation Steps

1. **Clone the Repository**  
   Clone the repository to your local machine:

   ```bash
   git clone https://github.com/vishnnu-vishnu/ERP.git
   cd ERP/frontend
   ```

2. **Install Dependencies**  
   Install the necessary Node.js dependencies:

   ```bash
   npm install
   ```

3. **Start the Angular Development Server**  
   Start the Angular development server:

   ```bash
   ng serve
   ```

   The frontend should now be running at `http://localhost:4200`.

---

## Running the Application Locally

### Docker (Optional)
If you'd like to run both the backend and frontend using Docker, you can use the provided `docker-compose.yml` file.

1. **Build and Start Containers**  
   Build and start the containers:

   ```bash
   docker-compose up --build
   ```

   This will start the Django backend and Angular frontend in separate containers.

---




---

## Database Setup

1. **Configure Database**  
   - Update the database settings in `settings.py` under the `DATABASES` configuration.
   - Create a PostgreSQL database (or your preferred database).
   - Run migrations to set up the database schema:

     ```bash
     python manage.py migrate
     ```



## Environment Variables

Ensure you set up the following environment variables in your `.env` file or in your hosting environment:

# .env


DB_NAME,
DB_USER,
DB_PASSWORD,
DB_HOST,
DB_PORT,
REDIS_HOST,

---

