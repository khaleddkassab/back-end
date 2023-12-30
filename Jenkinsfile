pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                // Check out code from Git
                git 'https://github.com/your-backend-repo.git'
                
                // Build Docker image
                sh 'docker build -t backend-image .'
            }
        }

        stage('Run') {
            steps {
                // Run Docker container
                sh 'docker run -p 8080:8080 backend-image'
            }
        }
    }
}
