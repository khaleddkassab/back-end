pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                // Check out code from Git
                git branch: 'main', url: 'https://github.com/khaleddkassab/back-end.git'
                
                // Build Docker image
                sh 'docker build -t docker-compose.yaml .'
                // Replace 'backend-image' with the name you want for your Docker image
            }
        }

        stage('Run') {
            steps {
                // Run Docker container
                sh 'docker run -p 8080:8080 docker-compose.yaml'
                // Replace 'backend-image' with the name of your Docker image
            }
        }
    }
}
